/**
 * Assembles the final, schema-validated content the site renders.
 *
 * Inputs:
 *   content/duas.ts                    references + editorial metadata
 *   content/hadith.ts                  the five Sunnah entries
 *   content/generated/arabic.json      fetched, hash-locked Arabic
 *   content/generated/legacy-migration.json   the preserved Turkish
 *
 * Output:
 *   content/generated/site.json        everything, validated against the schema
 *
 * Anything that fails validation stops the build. `draft` entries are dropped
 * here rather than filtered in the UI, so there is no path by which unreviewed
 * content reaches a page.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import { DUA_SEEDS } from "../content/duas.js";
import { HADITH_SEEDS } from "../content/hadith.js";
import { PROPHETS } from "../content/prophets.js";
import { THEMES, THEME_IDS } from "../content/themes.js";
import { Dua, Prophet, Theme } from "../content/schema.js";
import { transliterate } from "./transliterate.js";
import { sha256 } from "./fetch-content.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = async (p: string) => JSON.parse(await readFile(resolve(ROOT, p), "utf8"));

const arabic: any[] = await read("content/generated/arabic.json");
const migration: any = await read("content/generated/legacy-migration.json");

const arabicById = new Map(arabic.map((a) => [a.id, a]));
const legacyById = new Map<string, any>(migration.migrated.map((m: any) => [m.id, m]));
const legacyByLegacyId = new Map<string, any>(
  [...migration.migrated, ...migration.orphaned].map((m: any) => [m.legacyId ?? m.legacyId, m]),
);
for (const o of migration.orphaned) legacyByLegacyId.set(o.legacyId, o);

const PICKTHALL = {
  translator: "Marmaduke Pickthall",
  licence: "Public domain",
  source: "https://api.alquran.cloud/v1",
};

/**
 * Attribution for the Turkish, per the Phase 1 checkpoint decision. These are
 * the project's own translations; the schema refuses a bare "project
 * translation" with nobody named, so the repository owner is recorded as
 * translator and the review is what is still outstanding.
 */
const TURKISH = {
  translator: "Umut Candan",
  licence: "CC BY-SA 4.0",
};

const problems: string[] = [];
const duas: unknown[] = [];

/* ------------------------------ Qurʾānic ------------------------------ */

for (const seed of DUA_SEEDS) {
  const ar = arabicById.get(seed.id);
  if (!ar) { problems.push(`${seed.id}: no fetched Arabic`); continue; }

  const legacy = legacyById.get(seed.id);
  const translations: any[] = [
    {
      lang: "en",
      // Verbatim. Pickthall's parenthetical glosses — "(Moses) said" — stay in:
      // editing a translation while still crediting the translator misattributes
      // it, and stripping them here produced dangling fragments like "said: My
      // Lord!" where the gloss carried the subject.
      text: ar.translations["en.pickthall"],
      ...PICKTHALL,
    },
  ];
  if (legacy?.turkish) {
    translations.push({ lang: "tr", text: legacy.turkish, ...TURKISH });
  }

  const unknownThemes = seed.themes.filter((t) => !THEME_IDS.includes(t));
  if (unknownThemes.length) problems.push(`${seed.id}: unknown themes ${unknownThemes.join(", ")}`);
  if (!PROPHETS.some((p) => p.id === seed.speaker)) {
    problems.push(`${seed.id}: unknown speaker "${seed.speaker}"`);
  }

  duas.push({
    id: seed.id,
    speaker: seed.speaker,
    title: seed.title,
    source: {
      type: "quran",
      ayat: seed.ayat,
      excerpt: seed.excerpt,
      surahName: ar.surahNameEn,
      surahNameAr: ar.surahName,
    },
    arabic: {
      text: ar.text,
      script: "uthmani",
      sha256: ar.sha256,
      edition: ar.edition,
      // The complete āyah, so the page can show the supplication in context
      // rather than leaving the excerpted Arabic and a whole-āyah translation
      // side by side saying different amounts.
      fullText: ar.fullText,
    },
    transliteration: { text: transliterate(ar.text), scheme: "ala-lc" },
    translations,
    context: {
      summary: legacy?.context ?? placeholderContext(seed, ar),
      references: [{ work: "Qurʾān", locus: ar.ref }],
    },
    reflection: legacy?.reflection
      ? { text: legacy.reflection, author: "Umut Candan" }
      : undefined,
    themes: seed.themes,
    situations: seed.situations,
    related: [],
    form: seed.form ?? "dua",
    // Everything carrying migrated prose is needs-review until a tafsīr
    // citation is attached; entries with only generated context are too.
    reviewStatus: "needs-review",
  });
}

/* ------------------------------- Ḥadīth ------------------------------- */

for (const seed of HADITH_SEEDS) {
  const legacy = legacyByLegacyId.get(seed.legacyId);
  const translations: any[] = [];
  if (legacy?.turkish) translations.push({ lang: "tr", text: legacy.turkish, ...TURKISH });
  if (translations.length === 0) {
    problems.push(`${seed.id}: no translation available`);
    continue;
  }

  duas.push({
    id: seed.id,
    speaker: "muhammad",
    title: seed.title,
    source: {
      type: "hadith",
      collection: seed.source.collection,
      number: seed.source.number,
      grading: seed.source.grading,
      gradedBy: seed.source.gradedBy,
      url: seed.source.url,
    },
    arabic: {
      text: seed.arabic,
      script: "uthmani",
      sha256: sha256(seed.arabic),
      edition: "hand-entered (see content/hadith.ts)",
    },
    transliteration: { text: transliterate(seed.arabic), scheme: "ala-lc" },
    translations,
    context: {
      summary: legacy?.context ?? "",
      references: [
        { work: seed.source.collection, locus: seed.source.number, url: seed.source.url },
      ],
    },
    themes: seed.themes,
    situations: seed.situations,
    related: [],
    form: "dua",
    reviewStatus: "needs-review",
  });
}

/* ----------------------------- validation ----------------------------- */

const parsedDuas = z.array(Dua).safeParse(duas);
if (!parsedDuas.success) {
  for (const issue of parsedDuas.error.issues.slice(0, 25)) {
    problems.push(`dua[${issue.path.join(".")}]: ${issue.message}`);
  }
}
const parsedProphets = z.array(Prophet).safeParse(PROPHETS);
if (!parsedProphets.success) {
  for (const issue of parsedProphets.error.issues.slice(0, 15)) {
    problems.push(`prophet[${issue.path.join(".")}]: ${issue.message}`);
  }
}
const parsedThemes = z.array(Theme).safeParse(THEMES);
if (!parsedThemes.success) {
  for (const issue of parsedThemes.error.issues.slice(0, 15)) {
    problems.push(`theme[${issue.path.join(".")}]: ${issue.message}`);
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} content problem(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

const all = parsedDuas.success ? parsedDuas.data : [];
// `draft` never reaches a page. Filtering here rather than in the UI means
// there is no route that could accidentally render it.
const shipped = all.filter((d) => d.reviewStatus !== "draft");

/* --------------------------- related duʿāʾ ---------------------------- */
// Computed rather than authored: most-shared-themes, then same speaker.
for (const d of shipped) {
  const scored = shipped
    .filter((o) => o.id !== d.id)
    .map((o) => ({
      id: o.id,
      score:
        o.themes.filter((t) => d.themes.includes(t)).length * 2 +
        (o.speaker === d.speaker ? 1 : 0),
    }))
    .filter((o) => o.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  d.related = scored.map((s) => s.id);
}

/**
 * Old deep links were hash routes — `#view=dua&id=yunus-21-87`. They must
 * redirect rather than 404 (brief §8), so the legacy id of every entry is
 * carried through for the shim in the layout.
 */
const legacyRedirects: Record<string, string> = {};
for (const seed of DUA_SEEDS) if (seed.legacyId) legacyRedirects[seed.legacyId] = seed.id;
for (const seed of HADITH_SEEDS) legacyRedirects[seed.legacyId] = seed.id;

await writeFile(
  resolve(ROOT, "content/generated/site.json"),
  JSON.stringify(
    { duas: shipped, prophets: PROPHETS, themes: THEMES, legacyRedirects, generatedAt: new Date().toISOString() },
    null,
    2,
  ) + "\n",
);

const byStatus = shipped.reduce<Record<string, number>>((acc, d) => {
  acc[d.reviewStatus] = (acc[d.reviewStatus] ?? 0) + 1;
  return acc;
}, {});

console.error(`✓ ${shipped.length} duʿāʾ validated (${all.length - shipped.length} draft excluded)`);
console.error(`  status: ${JSON.stringify(byStatus)}`);
console.error(`  turkish: ${shipped.filter((d) => d.translations.some((t) => t.lang === "tr")).length}/${shipped.length}`);
console.error(`✓ content/generated/site.json`);

/* ------------------------------- helpers ------------------------------ */

function placeholderContext(seed: { title: { en: string } }, ar: { ref: string; surahNameEn: string }): string {
  return `From Sūrat ${ar.surahNameEn}, ${ar.ref}. The occasion of this supplication has not yet been written with a tafsīr citation.`;
}
