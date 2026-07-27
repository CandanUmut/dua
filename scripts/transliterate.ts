/**
 * Deterministic transliteration of the fetched Uthmani text.
 *
 * The Phase 1 audit found the legacy transliterations followed no scheme:
 * bare-ASCII in some entries (`zalamna`), apostrophe-ʿayn in others
 * (`'ala al-ardi`), and every emphatic collapsed — ẓ/z, ṣ/s, ḥ/h and ت/ط all
 * rendered identically, so distinct words became indistinguishable. They are
 * preserved in the migration file but are not worth correcting entry by entry.
 *
 * This generates them instead, from the same hash-locked Arabic the site
 * displays. Machine transliteration is not as good as a careful human's, but it
 * has the one property that matters here: it is *consistent*, and it cannot
 * drift from the Arabic, because it is a pure function of it. Regenerating
 * after a content change is free.
 *
 * Scheme: simplified ALA-LC. Macrons for long vowels (ā ī ū), dots for
 * emphatics and ḥ/ḍ/ṣ/ṭ/ẓ, ʿ for ʿayn, ʾ for hamza. Sun-letter assimilation is
 * applied (al-shams → ash-shams) because it reflects how the line is actually
 * said, which is the point of having a transliteration at all.
 *
 * What it does NOT attempt: pausal forms, iʿrāb dropped at a stop, or the
 * recitation-specific lengthening of madd. Entries are marked `needs-review` so
 * a human pass can correct what the machine cannot know.
 */

/* Consonants. Order matters only for multi-char sequences, of which there are none. */
const CONSONANTS: Record<string, string> = {
  "ا": "", "ٱ": "", "أ": "ʾ", "إ": "ʾ", "آ": "ʾā", "ء": "ʾ", "ؤ": "ʾ", "ئ": "ʾ",
  "ب": "b", "ت": "t", "ث": "th", "ج": "j", "ح": "ḥ", "خ": "kh",
  "د": "d", "ذ": "dh", "ر": "r", "ز": "z", "س": "s", "ش": "sh",
  "ص": "ṣ", "ض": "ḍ", "ط": "ṭ", "ظ": "ẓ", "ع": "ʿ", "غ": "gh",
  "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n",
  "ه": "h", "ة": "h", "و": "w", "ي": "y", "ى": "ā", "ﻻ": "lā",
};

/** Short vowels, sukūn, shadda, tanwīn. */
const FATHA = "َ", KASRA = "ِ", DAMMA = "ُ", SUKUN = "ْ";
const SHADDA = "ّ";
const FATHATAN = "ً", KASRATAN = "ٍ", DAMMATAN = "ٌ";
const DAGGER_ALIF = "ٰ";
const MADDA = "ٓ";

const SHORT: Record<string, string> = { [FATHA]: "a", [KASRA]: "i", [DAMMA]: "u" };
const TANWIN: Record<string, string> = { [FATHATAN]: "an", [KASRATAN]: "in", [DAMMATAN]: "un" };

/** Marks we read but never emit directly. */
const DIACRITICS = new Set([
  FATHA, KASRA, DAMMA, SUKUN, SHADDA, FATHATAN, KASRATAN, DAMMATAN,
  DAGGER_ALIF, MADDA, "ٔ", "ٕ", "ٖ", "ٗ", "٘",
  "ٟ", "ۡ", "ۢ", "ۥ", "ۦ", "ۧ", "ۨ", "۪",
  "۫", "۬", "ۭ", "۟", "۠", "ـ",
]);

const SUN_LETTERS = new Set(["ت","ث","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ل","ن"]);

/** Transliterate a single word. */
function word(w: string): string {
  const chars = [...w];
  let out = "";

  // Definite article: ال / ٱل, with sun-letter assimilation.
  //
  // `assimilated` records that the article already doubled the sun letter, so
  // the shadda sitting on that letter must not double it a second time —
  // otherwise ٱلظَّٰلِمِينَ comes out `aẓ-ẓẓālimīna`.
  let start = 0;
  let assimilatedAt = -1;
  const isAlif = (c: string) => c === "ا" || c === "ٱ";

  // Prefixed conjunction wa- / fa-. Hyphenating it is the single biggest
  // readability win in a line like wa-in lam taghfir lanā wa-tarḥamnā, where
  // running it together (waʾin, watarḥamnā) buries the word boundary.
  //
  // Guard against false positives on root wāw/fāʾ: فَرْدًا is fardan, not
  // fa-rdan. The tell is the following letter's mark — a genuine prefix is
  // followed by the start of a word, and no Arabic word opens with a sukūn or
  // a shadda. That single test separates فَرْدًا from وَتَرْحَمْنَا.
  // A dagger alif on the wāw itself makes it the long ā of a root — وَٰلِدَىَّ
  // is wālidayya, not wa-lidayya — so the prefix reading is wrong there.
  if (
    chars.length > 2 &&
    (chars[0] === "و" || chars[0] === "ف") &&
    chars[1] === FATHA &&
    chars[2] !== DAGGER_ALIF
  ) {
    let k = 2;
    while (k < chars.length && chars[k] === "ٱ") k++;
    const followingMarks: string[] = [];
    let m = k + 1;
    while (m < chars.length && DIACRITICS.has(chars[m])) { followingMarks.push(chars[m]); m++; }
    const clusterStart =
      followingMarks.includes(SUKUN) || followingMarks.includes(SHADDA);
    if (!clusterStart) {
      out += (chars[0] === "و" ? "wa" : "fa") + "-";
      start = 2;
    }
  }

  // Word-initial alif waṣla takes a helping vowel when the letter after it is
  // vowelless: ٱشْرَحْ is ishraḥ, not shraḥ.
  if (chars[start] === "ٱ") {
    let k = start + 1;
    while (k < chars.length && DIACRITICS.has(chars[k])) k++;
    let m = k + 1;
    const nextMarks: string[] = [];
    while (m < chars.length && DIACRITICS.has(chars[m])) { nextMarks.push(chars[m]); m++; }
    const bare = !nextMarks.some((x) => x in SHORT || x in TANWIN);
    const isArticle = chars[k] === "ل";
    if (bare && !isArticle) {
      out += "i";
      start += 1;
    }
  }

  if (chars.length > 2 && isAlif(chars[start])) {
    // skip any diacritic sitting on the alif
    let i = start + 1;
    while (i < chars.length && DIACRITICS.has(chars[i])) i++;
    if (chars[i] === "ل") {
      let j = i + 1;
      const lamMarks: string[] = [];
      while (j < chars.length && DIACRITICS.has(chars[j])) { lamMarks.push(chars[j]); j++; }
      const next = chars[j];
      // A shadda on the lām itself means this is not article + sun letter but
      // a geminate lām: ٱلَّذِى is alladhī, not adh-dhī.
      if (lamMarks.includes(SHADDA)) {
        out += "al";
        start = i;
      } else if (next && CONSONANTS[next] !== undefined) {
        if (SUN_LETTERS.has(next)) {
          out += `a${CONSONANTS[next]}-`;
          assimilatedAt = j;
        } else {
          out += "al-";
        }
        start = i + 1;
      }
    }
  }

  for (let i = start; i < chars.length; i++) {
    const c = chars[i];

    if (DIACRITICS.has(c)) {
      // handled when the preceding consonant was emitted
      continue;
    }

    const base = CONSONANTS[c];
    if (base === undefined) continue;

    // Look ahead at the marks attached to this consonant.
    const marks: string[] = [];
    let j = i + 1;
    while (j < chars.length && DIACRITICS.has(chars[j])) {
      marks.push(chars[j]);
      j++;
    }

    const nextChar = chars[j];
    const dagger = marks.includes(DAGGER_ALIF);
    const short = marks.find((m) => m in SHORT);
    const tanwin = marks.find((m) => m in TANWIN);

    // A shadda doubles its consonant — except in two cases:
    //
    //  - the article already doubled it via sun-letter assimilation, and
    //  - it is the first letter of the word. Uthmani orthography marks
    //    assimilation *across* a word boundary by putting the shadda on the
    //    following word's opening letter (لَّمْ after وَإِن), which is a note
    //    about how the join is recited, not a geminate in the word itself.
    //    Doubling it yields `llam`, `mmin`, `Rrabbi`.
    const shadda =
      marks.includes(SHADDA) && i !== assimilatedAt && out.length > 0;

    // ة is "h" at rest but "t" when it carries a vowel or tanwīn.
    let resolved = base;
    if (c === "ة" && (short || tanwin)) resolved = "t";

    // ى is a consonantal y when it carries any mark of its own — a vowel
    // (مَسَّنِىَ → massaniya) or a sukūn (شَىْءٍ → shayʾin). It is the long
    // vowel ā only when bare. And when bare after a fatḥa the preceding
    // consonant has already emitted the ā, so emitting again gives ʿalaā.
    if (c === "ى") {
      if (short || tanwin || marks.includes(SUKUN)) resolved = "y";
    }

    let emitted = resolved;
    if (shadda && resolved) emitted = resolved + resolved;

    // Skip alif/waw/ya when they are acting as the long-vowel carrier — the
    // preceding consonant will have emitted the macron.
    if (resolved === "" && !dagger) {
      // bare alif, or alif waṣla: silent carrier
      continue;
    }

    out += emitted;

    if (dagger) {
      out += "ā";
      continue;
    }

    if (tanwin) {
      out += TANWIN[tanwin];
      continue;
    }

    if (short) {
      const v = SHORT[short];
      // check for a following long-vowel carrier
      // A fatḥa followed by a bare alif OR a bare alif maqṣūra is the long ā.
      // Both carriers must be handled here: doing ى later instead yields
      // ʿalaā for عَلَى, because the fatḥa has already emitted its own "a".
      // A dagger alif on the carrier is still "bare" for this purpose — it is
      // what makes يَخْفَىٰ a long ā rather than two vowels.
      //
      // Note: ٱ (alif waṣla) is deliberately excluded — it is an elidable
      // carrier, not a long vowel, so وَٱحْلُلْ is wa-ḥlul and not wāḥlul.
      if (v === "a" && (nextChar === "ا" || nextChar === "ى")) {
        let k = j + 1;
        const alifMarks: string[] = [];
        while (k < chars.length && DIACRITICS.has(chars[k])) { alifMarks.push(chars[k]); k++; }
        if (!alifMarks.some((m) => m in SHORT || m in TANWIN || m === SUKUN)) {
          out += "ā"; i = j; continue;
        }
      }
      if (v === "u" && nextChar === "و") {
        let k = j + 1; const m2: string[] = [];
        while (k < chars.length && DIACRITICS.has(chars[k])) { m2.push(chars[k]); k++; }
        if (!m2.some((m) => m in SHORT || m in TANWIN) && !m2.includes(SHADDA)) { out += "ū"; i = j; continue; }
      }
      if (v === "i" && (nextChar === "ي" || nextChar === "ى")) {
        let k = j + 1; const m2: string[] = [];
        while (k < chars.length && DIACRITICS.has(chars[k])) { m2.push(chars[k]); k++; }
        if (!m2.some((m) => m in SHORT || m in TANWIN) && !m2.includes(SHADDA)) { out += "ī"; i = j; continue; }
      }
      out += v;
      continue;
    }
    // sukūn or unmarked: emit nothing further
  }

  return out;
}

export function transliterate(arabic: string): string {
  const words = arabic.split(" ").map(word).filter((w) => w.length > 0);
  let s = words.join(" ");
  // Collapse triple letters to a geminate. These arise where a prefix ends in
  // the same consonant the article assimilates to — بِٱللَّهِ producing
  // "billlahi", ٱلَّتِى producing "alllatī". No Arabic word has a triple.
  s = s.replace(/(.)\1{2,}/gu, "$1$1");
  // Tidy: collapse doubled separators, drop stray hyphens at word edges.
  s = s.replace(/\s+/g, " ").replace(/-\s/g, "- ").replace(/\s-/g, " -").trim();
  // Capitalise the opening letter of the line.
  return s.charAt(0).toUpperCase() + s.slice(1);
}
