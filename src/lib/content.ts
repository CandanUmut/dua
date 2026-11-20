/**
 * Read-side access to the built content. Runs at build time.
 */

import site from "../../content/generated/site.json";
import type { Dua, Prophet, Theme, Honorific } from "../../content/schema.js";
import { pick, t, url, type Lang } from "./i18n";

export const DUAS = site.duas as unknown as Dua[];
export const PROPHETS = site.prophets as unknown as Prophet[];
export const THEMES = (site.themes as unknown as Theme[]).slice().sort((a, b) => a.order - b.order);
export const MOMENTS = site.moments as string[];
export const LEGACY_REDIRECTS = site.legacyRedirects as Record<string, string>;

export const bySpeaker = (id: string) => DUAS.filter((d) => d.speaker === id);
export const byTheme = (id: string) => DUAS.filter((d) => d.themes.includes(id));
export const byMoment = (id: string) => DUAS.filter((d) => d.moments.includes(id));
export const dua = (id: string) => DUAS.find((d) => d.id === id);
export const prophet = (id: string) => PROPHETS.find((p) => p.id === id);
export const theme = (id: string) => THEMES.find((t) => t.id === id);

export const inOrder = (section?: Prophet["section"]) =>
  PROPHETS.filter((p) => (section ? p.section === section : true)).sort((a, b) => a.order - b.order);

/** Honorifics are data; the form is a reader setting. */
/**
 * Abbreviations follow each language's convention: Turkish writes (s.a.v.),
 * (a.s.), (r.a.); English (saw), (as), (ra).
 */
export const HONORIFICS: Record<Honorific, { arabic: string; full: Record<Lang, string>; abbr: Record<Lang, string> }> = {
  "sallallahu-alayhi-wa-sallam": {
    arabic: "ﷺ",
    full: { en: "peace and blessings be upon him", tr: "sallallahu aleyhi ve sellem" },
    abbr: { en: "(saw)", tr: "(s.a.v.)" },
  },
  "alayhi-salam": { arabic: "عليه السلام", full: { en: "peace be upon him", tr: "aleyhisselam" }, abbr: { en: "(as)", tr: "(a.s.)" } },
  "alayha-salam": { arabic: "عليها السلام", full: { en: "peace be upon her", tr: "aleyhesselam" }, abbr: { en: "(as)", tr: "(a.s.)" } },
  "radiyallahu-anhu": { arabic: "رضي الله عنه", full: { en: "may Allah be pleased with him", tr: "radıyallahu anh" }, abbr: { en: "(ra)", tr: "(r.a.)" } },
  "radiyallahu-anha": { arabic: "رضي الله عنها", full: { en: "may Allah be pleased with her", tr: "radıyallahu anhâ" }, abbr: { en: "(ra)", tr: "(r.a.)" } },
  none: { arabic: "", full: { en: "", tr: "" }, abbr: { en: "", tr: "" } },
};

/** The form a page shows before the reader chooses: abbreviation in Turkish, the Arabic glyph in English. */
export const defaultHonForm = (lang: Lang) => (lang === "tr" ? "abbr" : "arabic");

const honOf = (h: Honorific | undefined) => {
  const x = HONORIFICS[h ?? "none"];
  return { a: x.arabic, f: x.full, b: x.abbr };
};

export const translation = (d: Dua, lang: "en" | "tr") => d.translations.find((t) => t.lang === lang);

export const name = (p: Prophet | undefined, lang: Lang) => (p ? p.name[lang] || p.name.en : "");

/** "21:87" / "20:25–28" / "Bukhārī 6306" — compact, for lists. */
export function refLabel(d: Dua, lang: Lang = "en"): string {
  if (d.source.type === "hadith") {
    return `${lang === "tr" ? d.source.collectionTr : d.source.collection} ${d.source.number}`;
  }
  if (d.source.type === "attributed") return d.source.locus;
  const { ayat } = d.source;
  const first = ayat[0];
  const last = ayat[ayat.length - 1];
  return ayat.length > 1 ? `${first.surah}:${first.ayah}–${last.ayah}` : `${first.surah}:${first.ayah}`;
}

/** "Sūrat al-Anbiyāʾ 21:87" / "Enbiyâ Sûresi 21:87" / "Ṣaḥīḥ al-Bukhārī 6306". */
export function fullRef(d: Dua, lang: Lang): string {
  if (d.source.type === "quran") {
    const n = lang === "tr" ? d.source.surahNameTr : d.source.surahName;
    return `${t("surah", lang, { n })} ${refLabel(d)}`;
  }
  return refLabel(d, lang);
}

/** The first words of the Arabic, for list previews. */
export const arabicPreview = (d: Dua, words = 9) => {
  const w = (d.arabic?.text ?? "").split(" ");
  return w.length > words ? w.slice(0, words).join(" ") + " …" : w.join(" ");
};

/**
 * Entries eligible to be "the duʿāʾ of the day". Leaves out the two prophetic
 * imprecations (no situations offered), refuge addressed to a person (19:18),
 * and statements — a reader opening the site in the morning should get a
 * supplication they can make.
 */
export const dailyPool = () =>
  DUAS.filter(
    (d) =>
      d.situations.en.length > 0 &&
      d.form !== "statement" &&
      d.id !== "maryam-inni-audhu-bil-rahman-minka",
  ).map((d) => d.id);

/** The minimal record the browser needs to render a duʿāʾ: Today, the reader, lists, sharing. */
export type Card = {
  id: string;
  t: { en: string; tr: string };
  s: { en: string; tr: string };
  r: { en: string; tr: string };
  ar: string;
  tl: string;
  en: string;
  tr: string;
  au: number[];
  q: boolean;
  /** Honorific forms for the speaker: Arabic glyph, words and abbreviation per language. */
  h: { a: string; f: { en: string; tr: string }; b: { en: string; tr: string } };
};
export const cards = (): Card[] =>
  DUAS.map((d) => {
    const p = prophet(d.speaker);
    return {
      id: d.id,
      t: d.title,
      s: { en: name(p, "en"), tr: name(p, "tr") },
      r: { en: fullRef(d, "en"), tr: fullRef(d, "tr") },
      ar: d.arabic?.text ?? "",
      tl: d.transliteration?.text ?? "",
      en: translation(d, "en")?.text ?? "",
      tr: translation(d, "tr")?.text ?? "",
      au: d.audioAyahs,
      q: d.source.type === "quran",
      h: honOf(p?.honorific),
    };
  });

/* ------------------------------ search ------------------------------- */

/**
 * Arabic search normalisation. The dagger alif becomes a full alif rather than
 * being stripped: Uthmani writes many long a vowels that way, and stripping it
 * leaves a spelling no reader will type. Must match the copy in Search.astro.
 */
const DAGGER_ALIF = /ٰ/g;
const ARABIC_MARKS = /[ؐ-ًؚ-ٟۖ-ۭـ]/g;

export function normalise(s: string): string {
  return s
    .normalize("NFC")
    .replace(DAGGER_ALIF, "ا")
    .replace(ARABIC_MARKS, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ʿʾ'’‘`]/g, "")
    .replace(/ı/g, "i")
    .replace(/\u2011/g, "-")
    .toLowerCase()
    .trim();
}

export type SearchDoc = { id: string; title: string; who: string; hon: Card["h"]; ref: string; ar: string; h: string };

export function buildSearchIndex(lang: Lang): SearchDoc[] {
  return DUAS.map((d) => {
    const p = prophet(d.speaker);
    const themeLabels = d.themes.map((id) => {
      const th = theme(id);
      return th ? `${th.label.en} ${th.label.tr}` : "";
    });
    return {
      id: d.id,
      title: pick(d.title, lang),
      who: name(p, lang),
      hon: honOf(p?.honorific),
      ref: fullRef(d, lang),
      ar: arabicPreview(d, 7),
      h: normalise(
        [
          d.title.en, d.title.tr, d.arabic?.text, d.transliteration?.text,
          translation(d, "en")?.text, translation(d, "tr")?.text,
          p?.name.en, p?.name.enCommon, p?.name.tr, p?.name.ar,
          ...themeLabels,
          ...d.situations.en, ...d.situations.tr,
          refLabel(d, "en"), refLabel(d, "tr"),
          d.translations.filter((x) => !x.project).map((x) => x.translator).join(" "),
          d.context.summary.en, d.context.summary.tr,
          d.source.type === "hadith" ? `${d.source.collection} ${d.source.collectionTr}` : "",
          d.source.type === "quran" ? `${d.source.surahName} ${d.source.surahNameTr}` : "",
        ]
          .filter(Boolean)
          .join(" "),
      ),
    };
  });
}

export const duaUrl = (lang: Lang, id: string) => url(lang, `/duas/${id}/`);
