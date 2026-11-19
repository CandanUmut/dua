/**
 * Access to the ḥadīth Arabic, the counterpart of `quran-api.ts`.
 *
 * Source: fawazahmed0/hadith-api, served from jsDelivr. Released under the
 * Unlicense (public domain); the Arabic itself is classical text. Each record
 * carries the dataset's own sequential `hadithnumber`, the standard reference
 * number as `arabicnumber` (for Muslim, ʿAbd al-Bāqī's numbering, with a
 * fractional part for sub-narrations: 2721.01 is sunnah.com's "2721a"), and,
 * for the Sunan, gradings by named scholars.
 *
 * Why this matters: until this existed, the site's five ḥadīth were typed in
 * from an unverified source, and one of their reference numbers turned out to
 * point at an unrelated report. Fetching by number and cross-checking the
 * standard number makes that class of error fail the build.
 */

export const HADITH_SOURCE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

export type Book = "bukhari" | "muslim" | "abudawud" | "tirmidhi";

export const BOOKS: Record<Book, { en: string; tr: string; ar: string; sunnah: string }> = {
  bukhari: { en: "Ṣaḥīḥ al-Bukhārī", tr: "Buhârî", ar: "صحيح البخاري", sunnah: "bukhari" },
  muslim: { en: "Ṣaḥīḥ Muslim", tr: "Müslim", ar: "صحيح مسلم", sunnah: "muslim" },
  abudawud: { en: "Sunan Abī Dāwūd", tr: "Ebû Dâvûd", ar: "سنن أبي داود", sunnah: "abudawud" },
  tirmidhi: { en: "Jāmiʿ al-Tirmidhī", tr: "Tirmizî", ar: "جامع الترمذي", sunnah: "tirmidhi" },
};

export type HadithRecord = {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  grades: { name: string; grade: string }[];
};

const cache = new Map<string, HadithRecord>();

export async function fetchHadith(book: Book, datasetNumber: number): Promise<HadithRecord> {
  const key = `${book}:${datasetNumber}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const url = `${HADITH_SOURCE}/editions/ara-${book}/${datasetNumber}.json`;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const body = (await res.json()) as { hadiths: HadithRecord[] };
      const rec = body.hadiths.find((h) => h.hadithnumber === datasetNumber) ?? body.hadiths[0];
      if (!rec) throw new Error("empty response");
      cache.set(key, rec);
      return rec;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 800 * 2 ** attempt));
    }
  }
  throw new Error(`fetch ${url} failed: ${String(lastErr)}`);
}

/**
 * Tokenise a narration into words, the unit excerpt ranges index into.
 *
 * Only formatting is removed: right-to-left marks (U+200F), and tokens that
 * consist solely of punctuation (the dataset's quotation marks, "‏.‏", "ـ").
 * No letter or diacritic is touched, so a word in the excerpt is byte-identical
 * to the same word in the source.
 */
const PUNCT_ONLY = /^[\s"'“”«»().,:;!?؟،؛ـ\-–—]+$/u;
export function tokenise(text: string): string[] {
  return text
    .replace(/‏/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !PUNCT_ONLY.test(w));
}

/** Join a word range and trim the punctuation the cut leaves at either edge. */
export function slice(words: string[], from: number, to: number): string {
  return words
    .slice(from, to)
    .join(" ")
    .replace(/^[\s"'“”«».,:;،؛]+/u, "")
    .replace(/[\s"'“”«».,:;،؛]+$/u, "");
}
