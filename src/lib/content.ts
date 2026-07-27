/**
 * Read-side access to the built content. Everything here runs at build time —
 * no page fetches data in the browser.
 */

import site from "../../content/generated/site.json";
import type { Dua, Prophet, Theme, Honorific } from "../../content/schema.js";

export const DUAS = site.duas as unknown as Dua[];
export const PROPHETS = site.prophets as unknown as Prophet[];
export const THEMES = site.themes as unknown as Theme[];
/** Legacy `#view=dua&id=…` identifiers → current duʿāʾ slugs. */
export const LEGACY_REDIRECTS = site.legacyRedirects as Record<string, string>;

export const bySpeaker = (id: string) => DUAS.filter((d) => d.speaker === id);
export const byTheme = (id: string) => DUAS.filter((d) => d.themes.includes(id));
export const dua = (id: string) => DUAS.find((d) => d.id === id);
export const prophet = (id: string) => PROPHETS.find((p) => p.id === id);
export const theme = (id: string) => THEMES.find((t) => t.id === id);

export const inOrder = (section?: Prophet["section"]) =>
  PROPHETS.filter((p) => (section ? p.section === section : true)).sort(
    (a, b) => a.order - b.order,
  );

/**
 * Honorifics are data, and the *form* is a user setting — so each one carries
 * all three renderings and the UI picks. Never concatenated into a name.
 */
export const HONORIFICS: Record<Honorific, { arabic: string; full: string; abbr: string }> = {
  "sallallahu-alayhi-wa-sallam": {
    arabic: "ﷺ",
    full: "peace and blessings be upon him",
    abbr: "(ṣ)",
  },
  "alayhi-salam": { arabic: "عليه السلام", full: "peace be upon him", abbr: "(as)" },
  "alayha-salam": { arabic: "عليها السلام", full: "peace be upon her", abbr: "(as)" },
  "radiyallahu-anhu": { arabic: "رضي الله عنه", full: "may Allah be pleased with him", abbr: "(ra)" },
  "radiyallahu-anha": { arabic: "رضي الله عنها", full: "may Allah be pleased with her", abbr: "(ra)" },
  none: { arabic: "", full: "", abbr: "" },
};

export const translation = (d: Dua, lang: "en" | "tr") =>
  d.translations.find((t) => t.lang === lang);

export const refLabel = (d: Dua): string => {
  if (d.source.type === "hadith") {
    return `${d.source.collection} ${d.source.number}`;
  }
  const { ayat } = d.source;
  const first = ayat[0];
  const last = ayat[ayat.length - 1];
  return ayat.length > 1
    ? `${first.surah}:${first.ayah}–${last.ayah}`
    : `${first.surah}:${first.ayah}`;
};

/**
 * Arabic search normalisation, so a reader typing undiacriticised Arabic from
 * memory finds the entry.
 *
 * Two things have to happen, and the second is easy to miss:
 *
 *  1. Strip tashkeel and unify alef forms, ta marbuta, and ya.
 *
 *  2. **Convert the dagger alif (U+0670) to a full alif rather than deleting
 *     it.** Uthmani writes many long a vowels as a superscript dagger rather
 *     than a full letter, so the word for "the wrongdoers" contains no plain
 *     alif at all. Stripping the dagger as though it were a vowel mark leaves
 *     a spelling no reader will ever type, and Arabic search silently matches
 *     nothing. This is a direct consequence of shipping Uthmani; it does not
 *     arise on an imlai corpus.
 */
const DAGGER_ALIF = /\u0670/g;
const ARABIC_MARKS = /[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED\u0640]/g;

export function normalise(s: string): string {
  return s
    .normalize("NFC")
    .replace(DAGGER_ALIF, "ا")
    .replace(ARABIC_MARKS, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    // Latin: fold diacritics so "zalimin" matches "ẓālimīn"
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ʿʾ'’‘`]/g, "")
    .toLowerCase()
    .trim();
}

export type SearchDoc = {
  id: string;
  title: string;
  speaker: string;
  ref: string;
  themes: string[];
  haystack: string;
};

export function buildSearchIndex(): SearchDoc[] {
  return DUAS.map((d) => {
    const p = prophet(d.speaker);
    const en = translation(d, "en")?.text ?? "";
    const tr = translation(d, "tr")?.text ?? "";
    const themeLabels = d.themes
      .map((t) => {
        const th = theme(t);
        return th ? `${th.label.en} ${th.label.tr}` : "";
      })
      .join(" ");
    return {
      id: d.id,
      title: d.title.en,
      speaker: p ? `${p.name.en}${p.name.enCommon ? ` (${p.name.enCommon})` : ""}` : d.speaker,
      ref: refLabel(d),
      themes: d.themes,
      haystack: normalise(
        [
          d.title.en,
          d.title.tr,
          d.arabic?.text ?? "",
          d.transliteration?.text ?? "",
          en,
          tr,
          p?.name.en,
          p?.name.enCommon,
          p?.name.tr,
          p?.name.ar,
          themeLabels,
          d.situations.en.join(" "),
          d.situations.tr.join(" "),
          refLabel(d),
        ]
          .filter(Boolean)
          .join(" "),
      ),
    };
  });
}
