/**
 * Assembles the final, schema-validated content the site renders.
 *
 * Inputs:
 *   content/duas.ts                     Qurʾānic references + metadata
 *   content/hadith.ts                   ḥadīth references + translations
 *   content/editorial.ts                occasions and reflections, EN + TR
 *   content/surahs.ts                   sūrah names in the site's spelling
 *   content/generated/arabic.json       fetched, hash-locked Qurʾānic Arabic
 *   content/generated/hadith.json       fetched, hash-locked ḥadīth Arabic
 *   content/generated/tafsir.json       Tafsīr al-Jalālayn
 *   content/generated/ayah-counts.json  for global āyah numbers (audio)
 *
 * Output:
 *   content/generated/site.json         everything, validated against the schema
 *
 * Anything that fails validation stops the build.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import { DUA_SEEDS } from "../content/duas.js";
import { HADITH_SEEDS, MOMENTS } from "../content/hadith.js";
import { ATTRIBUTED_SEEDS } from "../content/attributed.js";
import { EDITORIAL } from "../content/editorial.js";
import { SURAH_NAMES } from "../content/surahs.js";
import { PROPHETS } from "../content/prophets.js";
import { THEMES, THEME_IDS } from "../content/themes.js";
import { Dua, Prophet, Theme } from "../content/schema.js";
import { transliterate, transliterateImlaei } from "./transliterate.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = async (p: string) => JSON.parse(await readFile(resolve(ROOT, p), "utf8"));

const arabic: any[] = await read("content/generated/arabic.json");
const hadith: any[] = await read("content/generated/hadith.json");
const tafsirFile: any = await read("content/generated/tafsir.json");
const ayahCounts: number[] = await read("content/generated/ayah-counts.json");

const arabicById = new Map(arabic.map((a) => [a.id, a]));
const hadithById = new Map(hadith.map((h) => [h.id, h]));

/** Global āyah number, 1–6236, as per-āyah audio files are numbered. */
const globalAyah = (surah: number, ayah: number) =>
  ayahCounts.slice(0, surah - 1).reduce((a, b) => a + b, 0) + ayah;

const PICKTHALL = {
  translator: "Marmaduke Pickthall",
  licence: "Public domain",
  source: "https://api.alquran.cloud/v1",
};
const ELMALILI = {
  translator: "Elmalılı Hamdi Yazır",
  licence: "Public domain",
  source: "https://api.alquran.cloud/v1",
};
/**
 * The project's own translations — the ḥadīth, in both languages. Credited on
 * the page as "project translation" and, until the maintainer has checked one
 * against the Arabic and set `reviewed` in content/hadith.ts, as "not yet
 * reviewed".
 */
const PROJECT = (reviewed: boolean | undefined) => ({
  translator: "Project translation",
  licence: "CC BY-SA 4.0",
  project: true,
  ...(reviewed ? { reviewedBy: "Umut Candan" } : { draft: true }),
});

const problems: string[] = [];
const duas: unknown[] = [];

/* ------------------------------ Qurʾānic ------------------------------ */

for (const seed of DUA_SEEDS) {
  const ar = arabicById.get(seed.id);
  if (!ar) { problems.push(`${seed.id}: no fetched Arabic`); continue; }
  const surah = seed.ayat[0].surah;
  const names = SURAH_NAMES[surah];
  if (!names) problems.push(`${seed.id}: sūrah ${surah} missing from content/surahs.ts`);
  const ed = EDITORIAL[seed.id];
  if (!ed) problems.push(`${seed.id}: no entry in content/editorial.ts`);

  const unknownThemes = seed.themes.filter((t) => !THEME_IDS.includes(t));
  if (unknownThemes.length) problems.push(`${seed.id}: unknown themes ${unknownThemes.join(", ")}`);
  if (!PROPHETS.some((p) => p.id === seed.speaker)) {
    problems.push(`${seed.id}: unknown speaker "${seed.speaker}"`);
  }

  const references = [
    ...(ed?.refs ?? [`Qurʾān ${ar.ref}`]).map((r) => ({ work: r })),
    ...(ed?.jalalayn ? [{ work: "Tafsīr al-Jalālayn" }] : []),
  ];

  duas.push({
    id: seed.id,
    speaker: seed.speaker,
    title: seed.title,
    source: {
      type: "quran",
      ayat: seed.ayat,
      excerpt: seed.excerpt,
      surahName: names?.en ?? ar.surahNameEn,
      surahNameTr: names?.tr ?? ar.surahNameEn,
      surahNameAr: ar.surahName,
    },
    arabic: {
      text: ar.text,
      script: "uthmani",
      sha256: ar.sha256,
      edition: ar.edition,
      fullText: ar.fullText,
    },
    transliteration: { text: transliterate(ar.text), scheme: "ala-lc" },
    translations: [
      // Verbatim. Pickthall's parenthetical glosses stay in: editing a
      // translation while crediting the translator misattributes it.
      { lang: "en", text: ar.translations["en.pickthall"], ...PICKTHALL },
      { lang: "tr", text: ar.translations["tr.yazir"], ...ELMALILI },
    ],
    context: {
      summary: ed?.occasion ?? { en: "", tr: "" },
      references,
    },
    tafsir: buildTafsir(seed.id),
    reflection: ed?.reflection ? { text: ed.reflection } : undefined,
    themes: seed.themes,
    situations: seed.situations,
    related: [],
    moments: [],
    audioAyahs: seed.ayat.map((a) => globalAyah(a.surah, a.ayah)),
    form: seed.form ?? "dua",
    reviewStatus: "verified",
  });
}

/* ------------------------------- Ḥadīth ------------------------------- */

for (const seed of HADITH_SEEDS) {
  const h = hadithById.get(seed.id);
  if (!h) { problems.push(`${seed.id}: not fetched — run scripts/fetch-hadith.ts`); continue; }
  const badMoments = (seed.moments ?? []).filter((m) => !(MOMENTS as readonly string[]).includes(m));
  if (badMoments.length) problems.push(`${seed.id}: unknown moments ${badMoments.join(", ")}`);
  const unknownThemes = seed.themes.filter((t) => !THEME_IDS.includes(t));
  if (unknownThemes.length) problems.push(`${seed.id}: unknown themes ${unknownThemes.join(", ")}`);

  duas.push({
    id: seed.id,
    speaker: "muhammad",
    title: seed.title,
    source: {
      type: "hadith",
      collection: h.collection,
      collectionTr: h.collectionTr,
      number: h.number,
      grading: h.grading,
      gradedBy: h.gradedBy,
      url: h.url,
    },
    arabic: {
      text: h.text,
      script: "imlaei",
      sha256: h.sha256,
      edition: "fawazahmed0/hadith-api",
    },
    transliteration: { text: transliterateImlaei(h.text), scheme: "ala-lc" },
    translations: [
      { lang: "en", text: seed.translations.en, ...PROJECT(seed.reviewed?.en) },
      { lang: "tr", text: seed.translations.tr, ...PROJECT(seed.reviewed?.tr) },
    ],
    context: {
      summary: seed.context,
      references: [{ work: h.collection, locus: h.number, url: h.url }],
    },
    tafsir: [],
    themes: seed.themes,
    situations: seed.situations,
    related: [],
    moments: seed.moments ?? [],
    audioAyahs: [],
    form: seed.form ?? "dua",
    reviewStatus: "verified",
  });
}

if (ATTRIBUTED_SEEDS.length) {
  problems.push("content/attributed.ts has entries, but rendering for them was removed — see its note");
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
for (const id of Object.keys(EDITORIAL)) {
  if (!DUA_SEEDS.some((s) => s.id === id)) problems.push(`editorial.ts: "${id}" matches no duʿāʾ`);
}

if (problems.length) {
  console.error(`✗ ${problems.length} content problem(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

const shipped = (parsedDuas.success ? parsedDuas.data : []).filter((d) => d.reviewStatus !== "draft");

/* --------------------------- related duʿāʾ ---------------------------- */
// Computed rather than authored: most-shared-themes, then same speaker.
for (const d of shipped) {
  d.related = shipped
    .filter((o) => o.id !== d.id)
    .map((o) => ({
      id: o.id,
      score:
        o.themes.filter((t) => d.themes.includes(t)).length * 2 +
        (o.speaker === d.speaker ? 1 : 0),
    }))
    .filter((o) => o.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 4)
    .map((s) => s.id);
}

/**
 * Old deep links were hash routes — `#view=dua&id=yunus-21-87`. They redirect
 * rather than 404, so the legacy id of every entry is carried through.
 */
const legacyRedirects: Record<string, string> = {};
for (const seed of DUA_SEEDS) if (seed.legacyId) legacyRedirects[seed.legacyId] = seed.id;
for (const seed of HADITH_SEEDS) if (seed.legacyId) legacyRedirects[seed.legacyId] = seed.id;

await writeFile(
  resolve(ROOT, "content/generated/site.json"),
  JSON.stringify(
    { duas: shipped, prophets: PROPHETS, themes: THEMES, moments: MOMENTS, legacyRedirects },
    null,
    2,
  ) + "\n",
);

console.error(`✓ ${shipped.length} duʿāʾ validated`);
console.error(
  `  quran ${shipped.filter((d) => d.source.type === "quran").length} · ` +
    `hadith ${shipped.filter((d) => d.source.type === "hadith").length}`,
);
console.error(`✓ content/generated/site.json`);

/* ------------------------------- helpers ------------------------------ */

/** Classical commentary for an entry — see scripts/fetch-tafsir.ts. */
function buildTafsir(id: string) {
  const e = tafsirFile.entries[id];
  if (!e?.jalalayn || e.jalalayn.length <= 40) return [];
  // Older fetches stored only the first āyah of a range; say so rather than
  // let a reader take it for commentary on the whole passage.
  const seed = DUA_SEEDS.find((s) => s.id === id)!;
  const first = `${seed.ayat[0].surah}:${seed.ayat[0].ayah}`;
  return [{ ...tafsirFile.sources.jalalayn, text: e.jalalayn, kind: "commentary", covers: e.covers ?? first }];
}
