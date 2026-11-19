/**
 * Supplications attributed to a prophet in a scripture outside the Qurʾān and
 * the Sunnah.
 *
 * This exists for one reason: several prophets the Qurʾān names have no
 * supplication quoted in it. Dāwūd is the clearest case — 38:24 reports that he
 * sought forgiveness and prostrated but does not quote his words, and 2:250 is
 * the collective duʿāʾ of Ṭālūt's band. Leaving him with an empty page says
 * something false about the historical record.
 *
 * **What this material is, and is not.**
 *
 * Islamic belief holds that the Zabūr was given to Dāwūd. It does not hold that
 * the received Book of Psalms is that revelation preserved. These texts carry no
 * Islamic chain of transmission, no grading, and no scriptural authority in
 * Islam. They are included as *attribution recorded elsewhere* — clearly
 * labelled, in their own section, never mixed into the Qurʾānic entries, and
 * never presented as revelation.
 *
 * Selection is deliberately narrow. A passage is only included when it is a
 * supplication in form, is traditionally attributed to the prophet in question,
 * and contains nothing that contradicts Islamic belief about God. Passages
 * touching the divine nature, sonship, intercession, or the divine name as a
 * proper noun are left out — not censored from a text we are quoting, but simply
 * not selected, because this is a duʿāʾ reference and not an edition of the
 * Psalms.
 *
 * The text is **fetched, never typed**, from the World English Bible, which is
 * explicitly public domain. The same rule that governs the Qurʾānic Arabic
 * governs this: no scripture is written from memory anywhere in this repository.
 */

export type AttributedSeed = {
  id: string;
  speaker: string;
  title: { en: string; tr: string };
  /** Passage reference for bible-api.com, e.g. "psalm+51:1-2". */
  query: string;
  /** Human-readable citation. */
  work: string;
  locus: string;
  /** Why this passage was selected and what its status is. */
  note: { en: string; tr: string };
  themes: string[];
  situations: { en: string[]; tr: string[] };
  /** Turkish rendering of the passage. Project draft, flagged as such. */
  turkish: string;
};

/**
 * **Empty, deliberately.** The one entry here was Psalm 51, offered as the
 * words behind Dāwūd's istighfār in 38:24. The Psalm's own superscription sets
 * it after the episode of David and Bathsheba — a narrative Islamic scholarship
 * rejects as an account of a prophet. Presenting it beside 38:24 pointed
 * readers to that story. Dāwūd remains on the site through 27:15. The
 * mechanism is kept so a future entry can be added under the same rules.
 */
export const ATTRIBUTED_SEEDS: AttributedSeed[] = [];
