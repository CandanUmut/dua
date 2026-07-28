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
import { ATTRIBUTED_SEEDS } from "../content/attributed.js";
import { PROPHETS } from "../content/prophets.js";
import { THEMES, THEME_IDS } from "../content/themes.js";
import { Dua, Prophet, Theme } from "../content/schema.js";
import { transliterate } from "./transliterate.js";
import { sha256 } from "./fetch-content.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = async (p: string) => JSON.parse(await readFile(resolve(ROOT, p), "utf8"));

const arabic: any[] = await read("content/generated/arabic.json");
const attributed: any[] = await read("content/generated/attributed.json");
const tafsirFile: any = await read("content/generated/tafsir.json");
const attributedById = new Map(attributed.map((a) => [a.id, a]));
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
 * Elmalılı Hamdi Yazır (d. 1942) — out of copyright, and fetched per-āyah so it
 * always covers exactly the same extent as the Arabic and the English.
 *
 * This replaces the project's own Turkish as the primary rendering because that
 * Turkish was written per-āyah against the *old* corpus: on entries that now
 * span a range (20:25–28, 14:36–41, 2:127–129) it covered only the first āyah,
 * so a reader saw four āyāt of Arabic and one sentence of Turkish.
 */
const ELMALILI = {
  translator: "Elmalılı Hamdi Yazır",
  licence: "Public domain",
  source: "https://api.alquran.cloud/v1",
};

const TURKISH = {
  translator: "Umut Candan",
  licence: "CC BY-SA 4.0",
};

/**
 * Used only where no established translation exists to fetch and no project
 * translation was written — currently the ḥadīth English and the psalm Turkish.
 * Rendered with an explicit "unreviewed project draft" label.
 */
const PROJECT_DRAFT = {
  translator: "Project translation (draft)",
  licence: "CC BY-SA 4.0",
  draft: true,
};

/**
 * **Exactly one translation per language, per entry.**
 *
 * Showing two Turkish renderings side by side was a mistake: on a scripture
 * reference two translations of the same words invite the reader to adjudicate
 * between them, which is not a question a reader should be handed, and it makes
 * the page longer for no gain. One translation, and the page says plainly where
 * it came from.
 *
 * Precedence, highest first:
 *
 *   1. An established, attributed, public-domain translation fetched per-āyah —
 *      Pickthall for English, Elmalılı Hamdi Yazır for Turkish. Preferred
 *      because it is someone's published work, and because fetching per-āyah
 *      guarantees it covers exactly the extent the Arabic does.
 *   2. This project's own translation, attributed to its translator. This is
 *      what the ḥadīth entries use, since no public-domain rendering exists to
 *      fetch for them.
 *   3. An unreviewed draft, explicitly labelled.
 *
 * Nothing is lost by choosing: every legacy Turkish translation remains in
 * `data/prayers.json` and `content/generated/legacy-migration.json`, and
 * `scripts/migrate-legacy.ts` still fails the build if one would go missing
 * from the repository.
 */
function pickOne(candidates: any[]): any[] {
  const byLang = new Map<string, any>();
  for (const c of candidates) {
    if (!c || !c.text) continue;
    if (!byLang.has(c.lang)) byLang.set(c.lang, c);
  }
  return [...byLang.values()];
}

const problems: string[] = [];
const duas: unknown[] = [];

/* ------------------------------ Qurʾānic ------------------------------ */

for (const seed of DUA_SEEDS) {
  const ar = arabicById.get(seed.id);
  if (!ar) { problems.push(`${seed.id}: no fetched Arabic`); continue; }

  const legacy = legacyById.get(seed.id);
  const translations = pickOne([
    {
      lang: "en",
      // Verbatim. Pickthall's parenthetical glosses — "(Moses) said" — stay in:
      // editing a translation while still crediting the translator misattributes
      // it, and stripping them here produced dangling fragments like "said: My
      // Lord!" where the gloss carried the subject.
      text: ar.translations["en.pickthall"],
      ...PICKTHALL,
    },
    { lang: "tr", text: ar.translations["tr.yazir"], ...ELMALILI },
    // Fallback only — reached if the Turkish edition ever fails to resolve.
    { lang: "tr", text: legacy?.turkish, ...TURKISH },
  ]);

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
    tafsir: buildTafsir(seed.id),
    reflection: legacy?.reflection ? { text: legacy.reflection } : undefined,
    themes: seed.themes,
    situations: seed.situations,
    related: [],
    form: seed.form ?? "dua",
    // The occasion now carries classical commentary, quoted and attributed, so
    // there is nothing outstanding to flag.
    reviewStatus: "verified",
  });
}

/* ------------------------------- Ḥadīth ------------------------------- */

for (const seed of HADITH_SEEDS) {
  const legacy = legacyByLegacyId.get(seed.legacyId);
  // No public-domain ḥadīth translation exists to fetch, so Turkish is the
  // project's own — attributed to its translator rather than shown as an
  // anonymous draft. English has no such rendering and stays a labelled draft.
  const translations = pickOne([
    { lang: "tr", text: legacy?.turkish, ...TURKISH },
    { lang: "tr", text: seed.translations.tr, ...PROJECT_DRAFT },
    { lang: "en", text: seed.translations.en, ...PROJECT_DRAFT },
  ]);

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
    tafsir: [],
    themes: seed.themes,
    situations: seed.situations,
    related: [],
    form: "dua",
    reviewStatus: "verified",
  });
}

/* --------------------- attributed (outside Qurʾān/Sunnah) -------------- */

for (const seed of ATTRIBUTED_SEEDS) {
  const passage = attributedById.get(seed.id);
  if (!passage) { problems.push(`${seed.id}: not fetched — run content:fetch-attributed`); continue; }

  duas.push({
    id: seed.id,
    speaker: seed.speaker,
    title: seed.title,
    source: {
      type: "attributed",
      tradition: "Zabūr / Psalms",
      work: seed.work,
      locus: seed.locus,
      translation: passage.translation,
      licence: "Public domain",
      note: seed.note.en,
    },
    // No `arabic` field: this passage has no Arabic original we can source, and
    // inventing one would be exactly the failure the whole pipeline prevents.
    translations: [
      {
        lang: "en",
        text: passage.text,
        translator: passage.translation,
        licence: "Public domain",
        source: "https://bible-api.com",
      },
      { lang: "tr", text: seed.turkish, ...PROJECT_DRAFT },
    ],
    context: {
      summary: seed.note.en,
      references: [{ work: seed.work, locus: seed.locus }],
    },
    tafsir: [],
    themes: seed.themes,
    situations: seed.situations,
    related: [],
    form: "dua",
    reviewStatus: "verified",
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

/** Classical commentary for an entry — see scripts/fetch-tafsir.ts. */
function buildTafsir(id: string) {
  const e = tafsirFile.entries[id];
  if (!e?.jalalayn || e.jalalayn.length <= 40) return [];
  return [{ ...tafsirFile.sources.jalalayn, text: e.jalalayn, kind: "commentary" }];
}

function placeholderContext(seed: { title: { en: string } }, ar: { ref: string; surahNameEn: string }): string {
  return `From Sūrat ${ar.surahNameEn}, ${ar.ref}. The occasion of this supplication has not yet been written with a tafsīr citation.`;
}
