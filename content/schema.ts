/**
 * Content schema for the Prophets' Duʿāʾ collection.
 *
 * Design rule that shapes everything below: **Arabic scripture is never authored
 * here.** A duʿāʾ record does not carry Qurʾānic Arabic as a string. It carries a
 * *reference* — which āyāt, and which words within them — and the text is derived
 * at build time from an authenticated source and hash-locked (see
 * `scripts/fetch-content.ts` and `content.lock.json`).
 *
 * This is stricter than "fetch the Arabic once and commit it", and deliberately so.
 * The Phase 1 audit found two entries where a duʿāʾ had been excerpted from its
 * āyah and the cut point then *backfilled with invented connective words* — text
 * that reads fluently, carries a correct-looking citation, and is invisible to
 * review. Storing excerpt boundaries as word indices makes that class of error
 * unrepresentable: there is no field in which a human can put an Arabic word.
 */

import { z } from "zod";

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

/** Stable, URL-safe slug. Lowercase, hyphenated, no leading/trailing hyphen. */
export const Slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase hyphenated slug");

/** BCP-47-ish language tag. We only ship a small closed set today. */
export const LangTag = z.enum(["en", "tr", "ar"]);

/**
 * A citation to something a human can check. Every factual claim on the site
 * carries one of these or does not ship (brief §2.2).
 */
export const Citation = z.object({
  /** e.g. "Tafsīr Ibn Kathīr", "al-Bidāya wa'l-Nihāya", "Sunan Abī Dāwūd" */
  work: z.string().min(1),
  author: z.string().min(1).optional(),
  /** Volume/page/section, however that work is normally cited. */
  locus: z.string().min(1).optional(),
  /** Only when a stable public URL exists. Not a substitute for `work`. */
  url: z.string().url().optional(),
});
export type Citation = z.infer<typeof Citation>;

/* ------------------------------------------------------------------ *
 * Scripture references
 * ------------------------------------------------------------------ */

/** Which orthography the fetched Arabic is in. Declared once, site-wide. */
export const Script = z.enum(["uthmani", "imlaei"]);
export type Script = z.infer<typeof Script>;

/** A single āyah. */
export const AyahRef = z.object({
  surah: z.number().int().min(1).max(114),
  ayah: z.number().int().min(1),
});
export type AyahRef = z.infer<typeof AyahRef>;

/**
 * A half-open word range `[fromWord, toWord)` into the whitespace-split
 * concatenation of the referenced āyāt, used to isolate the supplication from
 * surrounding narrative.
 *
 * Why this exists: 16 of the 42 entries in the original corpus were excerpts —
 * "wa-Dhā'l-Nūn idh dhahaba mughāḍiban…" trimmed away so the duʿāʾ itself
 * stands alone — but nothing in the data recorded that fact, so a reader could
 * not tell a complete āyah from a fragment. Encoding the cut as indices both
 * records it and makes it verifiable.
 *
 * Omit entirely when the duʿāʾ is the whole of the referenced āyāt.
 */
export const Excerpt = z.object({
  fromWord: z.number().int().min(0),
  toWord: z.number().int().min(1),
  /**
   * Why the text was cut here — normally "drops narrative preamble" or
   * "drops the closing address". Rendered in the source panel so the excerpt
   * is disclosed to the reader, not just to the repository.
   */
  note: z.string().min(1),
});

/* ------------------------------------------------------------------ *
 * Sources
 * ------------------------------------------------------------------ */

export const QuranSource = z.object({
  type: z.literal("quran"),
  ayat: z.array(AyahRef).min(1),
  excerpt: Excerpt.optional(),
  /** Transliterated sūrah name, e.g. "al-Anbiyāʾ". Derived at fetch time. */
  surahName: z.string().min(1),
  surahNameAr: z.string().min(1),
});

/**
 * Ḥadīth sources are hand-entered — there is no equivalent clean API — so the
 * schema compensates by demanding more: a grading and *who* gave it. An
 * ungraded ḥadīth citation does not validate.
 */
export const HadithSource = z.object({
  type: z.literal("hadith"),
  /** e.g. "Ṣaḥīḥ al-Bukhārī" */
  collection: z.string().min(1),
  book: z.string().min(1).optional(),
  /** Reference number as that collection numbers it. String — numbering varies. */
  number: z.string().min(1),
  /** e.g. "ṣaḥīḥ", "ḥasan", "ḥasan ṣaḥīḥ" */
  grading: z.string().min(1),
  /** Who graded it. "al-Bukhārī", "Muslim", "al-Albānī", … */
  gradedBy: z.string().min(1),
  url: z.string().url().optional(),
});

/**
 * A supplication attributed to a prophet in a scripture outside the Qurʾān and
 * the Sunnah — currently only the Psalms, for Dāwūd.
 *
 * Deliberately a separate variant rather than a flag on the others, so that no
 * template can render it as though it were Qurʾānic. It carries no grading
 * because there is no Islamic chain to grade, and it requires a `note` stating
 * exactly what its status is, which the page shows prominently.
 */
export const AttributedSource = z.object({
  type: z.literal("attributed"),
  tradition: z.string().min(1),
  work: z.string().min(1),
  locus: z.string().min(1),
  translation: z.string().min(1),
  licence: z.string().min(1),
  note: z.string().min(1),
});

export const Source = z.discriminatedUnion("type", [
  QuranSource,
  HadithSource,
  AttributedSource,
]);
export type Source = z.infer<typeof Source>;

/* ------------------------------------------------------------------ *
 * Arabic text (derived, never authored)
 * ------------------------------------------------------------------ */

/**
 * Populated by `scripts/fetch-content.ts`. Hand-editing `text` breaks the
 * build: `scripts/verify-content.ts` re-hashes it against `content.lock.json`
 * and CI fails on drift.
 */
export const ArabicText = z.object({
  text: z.string().min(1),
  script: Script,
  /** SHA-256 of `text`. Must match `content.lock.json`. */
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  /** Edition identifier at the upstream source, for provenance. */
  edition: z.string().min(1),
  /**
   * The complete āyah(s) the excerpt was taken from.
   *
   * Needed because the English translation is Pickthall's rendering of the
   * *whole* āyah, while `text` may be only the supplication within it. Showing
   * a nine-word Arabic excerpt beside a forty-word English translation is
   * quietly misleading — so the page renders the full āyah with the
   * supplication distinguished, and the two correspond exactly.
   */
  fullText: z.string().min(1).optional(),
});

/* ------------------------------------------------------------------ *
 * Translations
 * ------------------------------------------------------------------ */

/**
 * Every translation names a translator and a licence. The Phase 1 audit found
 * all 47 existing translations marked `"translation_note": "Paraphrase"` with
 * no translator recorded — which is unshippable under brief §2.3 not because
 * the prose was bad but because nobody could say where it came from.
 */
export const Translation = z.object({
  lang: LangTag,
  text: z.string().min(1),
  /**
   * A person or body. "Project translation" is not a translator — if this
   * project produced the text, name the translator and the reviewer.
   */
  translator: z.string().min(1),
  /** SPDX identifier where one applies, otherwise a plain description. */
  licence: z.string().min(1),
  /** Named human who checked it against the Arabic. */
  reviewedBy: z.string().min(1).optional(),
  /**
   * True for renderings this project produced that no one has yet checked.
   * Rendered with a visible label so a draft is never mistaken for established,
   * attributed work like Pickthall's or Elmalılı's.
   */
  draft: z.boolean().optional(),
  source: z.string().url().optional(),
});
export type Translation = z.infer<typeof Translation>;

/* ------------------------------------------------------------------ *
 * Editorial layers
 * ------------------------------------------------------------------ */

/**
 * The occasion — when and why it was said. The highest-value field on the site,
 * and the one users actually come for. Requires citations.
 */
export const Context = z.object({
  summary: z.string().min(1),
  references: z.array(Citation).min(1),
});

/**
 * A passage of classical commentary, quoted and attributed.
 *
 * This is what replaced the "awaiting a tafsīr citation" placeholder that used
 * to sit on every entry. A note saying a citation is missing is not a citation;
 * either the source is there or the claim should not be.
 */
export const Tafsir = z.object({
  work: z.string().min(1),
  author: z.string().min(1),
  translator: z.string().min(1),
  licence: z.string().min(1),
  text: z.string().min(1),
  url: z.string().url().optional(),
  /** "commentary" for a general gloss, "occasion" for asbāb al-nuzūl. */
  kind: z.enum(["commentary", "occasion"]),
});
export type Tafsir = z.infer<typeof Tafsir>;

/**
 * This project's own reflection on applying the duʿāʾ.
 *
 * Kept deliberately separate from `context`, and rendered in a visually distinct
 * register, because it is *not* transmitted knowledge. The audit found 47 of
 * these presented in the same visual weight as sourced material — advice like
 * "use this dua to own mistakes" reading as though it carried the authority of
 * the citation above it. Separating the type is what lets the UI separate the
 * voice.
 *
 * A reflection may not make a factual claim about reward, virtue, or occasion —
 * those belong in `context` with a citation, or nowhere (brief §2.2).
 */
export const Reflection = z.object({
  text: z.string().min(1),
  /**
   * Optional. A reflection makes no factual claim — it is explicitly labelled
   * as an editorial note rather than transmitted knowledge — so naming a person
   * on every one of them adds nothing a reader can act on. The label carries the
   * distinction; the byline was just noise.
   */
  author: z.string().min(1).optional(),
});

/* ------------------------------------------------------------------ *
 * Transliteration
 * ------------------------------------------------------------------ */

/**
 * One scheme, site-wide, declared. The audit found the original corpus mixing
 * bare-ASCII (`zalamna`) with apostrophe-ʿayn (`'ala al-ardi`) and collapsing
 * every emphatic — ẓ/z, ṣ/s, ḥ/h all rendered identically, so distinct words
 * became indistinguishable.
 */
export const TransliterationScheme = z.enum(["ala-lc", "simplified"]);

export const Transliteration = z.object({
  text: z.string().min(1),
  scheme: TransliterationScheme,
});

/* ------------------------------------------------------------------ *
 * Duʿāʾ
 * ------------------------------------------------------------------ */

export const ReviewStatus = z.enum(["verified", "needs-review", "draft"]);
export type ReviewStatus = z.infer<typeof ReviewStatus>;

export const Dua = z.object({
  id: Slug,
  /** Prophet slug, or a companion-section figure. Validated in validate-content.ts. */
  speaker: Slug,
  title: z.object({
    en: z.string().min(1),
    tr: z.string().min(1),
    ar: z.string().min(1).optional(),
  }),

  source: Source,

  /** Derived at build time. Absent until `content:fetch` has run. */
  arabic: ArabicText.optional(),

  transliteration: Transliteration.optional(),
  translations: z.array(Translation).min(1),

  context: Context,
  /** Classical commentary, quoted and attributed. */
  tafsir: z.array(Tafsir).default([]),
  reflection: Reflection.optional(),

  themes: z.array(Slug).min(1),
  /** Plain-language situations: "before a difficult conversation". */
  situations: z.object({
    en: z.array(z.string().min(1)),
    tr: z.array(z.string().min(1)),
  }),

  related: z.array(Slug).default([]),

  /**
   * Not every entry is grammatically a supplication. 12:18 (`fa-ṣabrun jamīl`)
   * is a statement of patience; 19:18 is Maryam seeking refuge from the one
   * before her. Both belong on the site; neither should be silently labelled a
   * duʿāʾ. Labelling them accurately costs nothing and is the difference
   * between a reference and an approximation.
   */
  form: z.enum(["dua", "statement", "istiadha", "dhikr"]).default("dua"),

  reviewStatus: ReviewStatus,
});
export type Dua = z.infer<typeof Dua>;

/* ------------------------------------------------------------------ *
 * Prophets
 * ------------------------------------------------------------------ */

/**
 * Honorifics are data, never hardcoded strings (brief §2.5). Each figure
 * declares which honorific applies; the UI decides the *form* — Arabic glyph,
 * full English phrase, or abbreviation — from a user setting.
 */
export const Honorific = z.enum([
  /** ﷺ — the Prophet Muḥammad */
  "sallallahu-alayhi-wa-sallam",
  /** عليه السلام — the prophets */
  "alayhi-salam",
  /** عليها السلام — feminine */
  "alayha-salam",
  /** رضي الله عنه/عنها — companions */
  "radiyallahu-anhu",
  "radiyallahu-anha",
  /** No honorific (e.g. Pharaoh's magicians as a group). */
  "none",
]);
export type Honorific = z.infer<typeof Honorific>;

export const Prophet = z.object({
  id: Slug,
  name: z.object({
    /** Transliterated: "Yūnus" */
    en: z.string().min(1),
    /** Anglicised, for search and for readers who know him as: "Jonah" */
    enCommon: z.string().min(1).optional(),
    tr: z.string().min(1),
    ar: z.string().min(1),
  }),
  honorific: Honorific,
  /**
   * Ordering key for the prophetic sequence. Not a date — the chronology is
   * traditional and not uniformly datable. Used only to order the index
   * chronologically rather than alphabetically (brief §5).
   */
  order: z.number().int().min(0),
  /** Short, factual, Qurʾān-cited. Not a biography. */
  summary: z.object({ en: z.string().min(1), tr: z.string().min(1) }),
  /** The trial he is remembered for — the hook for someone in the same state. */
  trial: z.object({ en: z.string().min(1), tr: z.string().min(1) }).optional(),
  references: z.array(Citation).min(1),
  /**
   * Distinguishes prophets from the companion section — the People of the Cave,
   * Āsiyah, Maryam, the magicians. On the site but never filed under "prophets".
   */
  /**
   * `quran-taught` holds supplications the Qurʾān gives to be said without
   * quoting a named speaker — 2:286, 3:8, 25:74. They belong on a complete
   * site, but filing them under a prophet would overstate the text, and the
   * companion section is for named people. A third grouping is the honest
   * answer rather than forcing them into one of the other two.
   */
  section: z.enum(["prophet", "companion", "quran-taught"]),
});
export type Prophet = z.infer<typeof Prophet>;

/* ------------------------------------------------------------------ *
 * Themes
 * ------------------------------------------------------------------ */

export const Theme = z.object({
  id: Slug,
  /**
   * Phrased as the need, not the category. "When you have wronged someone"
   * rather than "Repentance" — someone arriving in distress is not looking up
   * a taxonomy, they are looking for their own situation in a list.
   */
  label: z.object({ en: z.string().min(1), tr: z.string().min(1) }),
  description: z.object({ en: z.string().min(1), tr: z.string().min(1) }),
  order: z.number().int().min(0),
});
export type Theme = z.infer<typeof Theme>;

/* ------------------------------------------------------------------ *
 * Lock file
 * ------------------------------------------------------------------ */

export const LockEntry = z.object({
  /** "21:87" or "20:25-28" */
  ref: z.string().min(1),
  edition: z.string().min(1),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  fetchedAt: z.string().min(1),
});

export const ContentLock = z.object({
  source: z.string().min(1),
  script: Script,
  entries: z.record(z.string(), LockEntry),
});
export type ContentLock = z.infer<typeof ContentLock>;
