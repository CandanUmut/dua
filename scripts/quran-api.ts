/**
 * Thin client for the Al Quran Cloud API, with an on-disk cache.
 *
 * Why this source: it needs no key and no signup, exposes editions explicitly,
 * and — verified during the Phase 1 audit — its `quran-uthmani` edition returns
 * full Uthmani orthography with complete tashkeel. The Quran Foundation API has
 * better provenance but requires OAuth2 client credentials that cannot live in
 * a public static build; if that changes, only this file needs to.
 *
 * The cache is committed-adjacent but gitignored: it exists so that repeated
 * builds and CI verification runs do not hammer a free public API, not as a
 * source of truth. `content.lock.json` is the source of truth.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = resolve(HERE, ".cache/ayat.json");

const API = "https://api.alquran.cloud/v1";

/** The edition this project has committed to. Changing it is a content decision. */
export const ARABIC_EDITION = "quran-uthmani";

/** Public-domain English translations, safe to redistribute. */
export const EN_EDITIONS = ["en.pickthall", "en.yusufali"] as const;

/**
 * Turkish. Elmalılı Hamdi Yazır died in 1942, so his translation is out of
 * copyright and safe to redistribute. Diyanet İşleri' modern rendering reads
 * more naturally but its licensing is unclear, and brief §2.3 says an unclear
 * licence means the translation does not ship.
 *
 * Fetching Turkish per-āyah rather than authoring it also fixes an extent bug:
 * the project's own Turkish was written per-āyah against the *old* corpus, so
 * on entries that now span a range — 20:25–28, 14:36–41 — it covered only the
 * first āyah while the Arabic and English covered all of them.
 */
export const TR_EDITIONS = ["tr.yazir"] as const;

export type AyahRef = { surah: number; ayah: number };

type CacheShape = Record<string, { text: string; surahName: string; surahNameEn: string }>;

let cache: CacheShape | null = null;

async function loadCache(): Promise<CacheShape> {
  if (cache) return cache;
  try {
    cache = JSON.parse(await readFile(CACHE_PATH, "utf8")) as CacheShape;
  } catch {
    cache = {};
  }
  return cache;
}

async function saveCache(): Promise<void> {
  await mkdir(dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 1));
}

/** Fetch with bounded exponential backoff. A flaky free API must not fail a build. */
async function getJson(url: string): Promise<any> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (attempt < 3) await new Promise((r) => setTimeout(r, 2 ** attempt * 1000));
    }
  }
  throw new Error(`Failed after 4 attempts: ${url}\n  ${String(lastErr)}`);
}

export type FetchedAyah = {
  text: string;
  surahName: string;
  surahNameEn: string;
};

export async function fetchAyah(ref: AyahRef, edition: string): Promise<FetchedAyah> {
  const key = `${ref.surah}:${ref.ayah}|${edition}`;
  const c = await loadCache();
  if (c[key]) return { text: c[key].text, surahName: c[key].surahName, surahNameEn: c[key].surahNameEn };

  const json = await getJson(`${API}/ayah/${ref.surah}:${ref.ayah}/${edition}`);
  const d = json?.data;
  if (!d || typeof d.text !== "string") {
    throw new Error(`Unexpected API shape for ${key}`);
  }
  const entry = {
    text: d.text as string,
    surahName: (d.surah?.name as string) ?? "",
    surahNameEn: (d.surah?.englishName as string) ?? "",
  };
  c[key] = entry;
  await saveCache();
  return entry;
}

/**
 * Fetch a contiguous run of āyāt and return them joined by a single space,
 * together with the per-āyah texts so callers can report word offsets.
 */
export async function fetchAyat(
  refs: AyahRef[],
  edition: string,
): Promise<{ joined: string; parts: string[]; surahName: string; surahNameEn: string }> {
  const fetched = await Promise.all(refs.map((r) => fetchAyah(r, edition)));
  return {
    joined: fetched.map((f) => normaliseWhitespace(f.text)).join(" "),
    parts: fetched.map((f) => normaliseWhitespace(f.text)),
    surahName: fetched[0].surahName,
    surahNameEn: fetched[0].surahNameEn,
  };
}

/**
 * Collapse runs of whitespace and drop standalone division markers.
 *
 * Deliberately does NOT touch any letter, diacritic, hamza form, or pause mark
 * — no tashkeel stripping, no alif unification. The point of this pipeline is
 * that the bytes we ship are the bytes the source served.
 *
 * The one exception is recitation apparatus that the source emits as its own
 * space-delimited token: U+06DE ۞ (rub-el-ḥizb, e.g. the first "word" of
 * 21:83) and the waqf/pause marks U+06D6–U+06DD (e.g. ۖ at index 18 of 2:126).
 * These mark where a reciter divides or pauses; they are not part of the āyah.
 * Left in, they would render as stray glyphs mid-line and — worse — shift
 * every excerpt word index by an amount depending on where a pause happens to
 * fall, making the boundaries in `content/duas.ts` silently wrong.
 *
 * The test is deliberately narrow: a token is dropped only if it consists
 * *entirely* of such marks. Combining marks attached to letters (the U+06ED in
 * `مُغَٰضِبًۭا`) are part of a word token and are never touched.
 */
const APPARATUS_ONLY = /^[ۖ-۞]+$/u;

export function normaliseWhitespace(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .split(" ")
    .filter((w) => w.length > 0 && !APPARATUS_ONLY.test(w))
    .join(" ")
    .trim();
}

/** Format a reference list as "21:87" or "20:25-28" or "2:127, 2:129". */
export function formatRef(refs: AyahRef[]): string {
  if (refs.length === 0) return "";
  const surah = refs[0].surah;
  const sameSurah = refs.every((r) => r.surah === surah);
  const contiguous =
    sameSurah && refs.every((r, i) => i === 0 || r.ayah === refs[i - 1].ayah + 1);
  if (contiguous && refs.length > 1) {
    return `${surah}:${refs[0].ayah}-${refs[refs.length - 1].ayah}`;
  }
  if (refs.length === 1) return `${surah}:${refs[0].ayah}`;
  return refs.map((r) => `${r.surah}:${r.ayah}`).join(", ");
}
