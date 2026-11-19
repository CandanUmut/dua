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
function word(w: string, uthmani = true): string {
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
    // Before an alif waṣla the wāw/fāʾ is always the conjunction: وَٱغْفِرْ
    // is wa-ghfir, the same as the ḥadīth's وَاغْفِرْ.
    const beforeWasla = chars[2] === "ٱ" || (!uthmani && chars[2] === "ا" && chars[3] !== FATHA);
    // In Uthmani spelling a bare alif straight after the fatḥa is a long ā of
    // the root — فَاطِرَ is fāṭira, not fa-ṭira; the conjunction before a
    // hamzated word is written أ / إ instead.
    const rootLongA = uthmani && chars[2] === "ا";
    while (k < chars.length && chars[k] === "ٱ") k++;
    const followingMarks: string[] = [];
    let m = k + 1;
    while (m < chars.length && DIACRITICS.has(chars[m])) { followingMarks.push(chars[m]); m++; }
    const clusterStart =
      followingMarks.includes(SUKUN) || followingMarks.includes(SHADDA);
    if (beforeWasla || (!clusterStart && !rootLongA)) {
      out += (chars[0] === "و" ? "wa" : "fa") + "-";
      start = 2;
    }
  }

  // Word-initial alif waṣla takes a helping vowel when the letter after it is
  // vowelless: ٱشْرَحْ is ishraḥ, not shraḥ.
  // After a prefix the waṣla is elided, not voiced: wa-jʿal, not wa-ijʿal.
  if (chars[start] === "ٱ" && start === 0) {
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

    // Uthmani writes some long ā vowels as a wāw carrying a dagger alif —
    // صَلَوٰة is ṣalāh, حَيَوٰة is ḥayāh. After a short a the wāw is silent and
    // the vowel is long. (After a long ā, as in سَمَٰوَٰت, it is a real wāw.)
    if (c === "و" && dagger && !short && !tanwin && out.endsWith("a") && i > start) {
      out = out.slice(0, -1) + "ā";
      continue;
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

/**
 * Words in this corpus whose opening wāw or fāʾ is a root letter, not the
 * conjunction, where the spelling alone cannot tell them apart. Reviewed by
 * hand against every "wa-"/"fa-" split the rule produces; a new entry must be
 * checked the same way (the critic flags these).
 */
const ROOT_WF = /^(?:faqīr\S*|faʿala|wahana|wahaba|waliyy\S*|warathat\S*|warāʾī)$/u;

export function transliterate(arabic: string, uthmani = true): string {
  // A hamza carried on a tatweel (أَسْـَٔلَكَ) is a full hamza with its vowel;
  // read as a mark it vanishes and gives "ʾasalaka".
  const pre = arabic.replace(/\u0640([\u064B-\u0650]?)\u0654([\u064B-\u0650]?)/g, "\u0621$1$2");
  const words = pre
    .split(" ")
    .map((w) => {
      const out = word(w, uthmani);
      const joined = out.replace(/^(wa|fa)-/, "$1");
      return ROOT_WF.test(joined) ? joined : out;
    })
    .filter((w) => w.length > 0);
  let s = words.join(" ");
  // Collapse triple letters to a geminate. These arise where a prefix ends in
  // the same consonant the article assimilates to — بِٱللَّهِ producing
  // "billlahi", ٱلَّتِى producing "alllatī". No Arabic word has a triple.
  s = s.replace(/(.)\1{2,}/gu, "$1$1");
  // Tidy: collapse doubled separators, drop stray hyphens at word edges.
  s = s.replace(/\s+/g, " ").replace(/-\s/g, "- ").replace(/\s-/g, " -").trim();
  // The divine name. A letter-by-letter reading of ٱللَّه gives "al-lah", and
  // imlāʾī إله has no written alif to lengthen; both are fixed by name, since
  // these are the words a reader most needs to say correctly.
  s = s
    .replace(/(^|[\s-])al-lah(umma|u|i|a)(?=\s|$)/gi, (_, pre, end) => `${pre}${pre === "-" ? "" : ""}Allāh${end}`)
    .replace(/\b(li|bi)llahi\b/g, "$1llāhi")
    .replace(/ʾilaha\b/g, "ʾilāha")
    // bi-/li- + article before a sun letter: biṣ-ṣāliḥīna, bir-raḥmāni.
    .replace(/(^|\s)(bi|li)l(th|dh|sh|ṣ|ḍ|ṭ|ẓ|t|d|r|z|s|n)\3/g, "$1$2$3-$3")
    // The article after the conjunction is written out, as in ALA-LC: wa-al-.
    .replace(/(^|\s)(wa|fa)l(?=[^aiuāīū\s-])/g, "$1$2-al-")
    // Imlāʾī spellings without the long vowel written.
    .replace(/(^|[\s-])hadh(ā|ihi)(?=\s|$)/g, "$1hādh$2")
    .replace(/samawāt/g, "samāwāt")
    // ALA-LC does not mark a word-initial hamza.
    .replace(/(^|[\s-])ʾ(?=[aiuāīū])/g, "$1");
  s = pausal(s);
  // Capitalise the opening letter of the line.
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * The ḥadīth edition writes the vowel of lām-alif after the alif (لاَ, لاَّ)
 * where the Uthmani text writes it on the lām (لَا, لَّا). Both render the
 * same on screen, but a letter-by-letter reader takes the first as a bare lām
 * and produces "l yaghfiru" for lā yaghfiru and "ʾil ʾanta" for illā anta.
 * Moving a fatḥa (and any shadda) back onto the lām fixes the reading. Only the
 * transliteration input is normalised; the displayed Arabic is untouched.
 */
export function transliterateImlaei(arabic: string): string {
  const fixed = arabic.replace(/لا([ّ]?)([َ])([ّ]?)/g, "ل$1$3$2ا");
  return transliterate(fixed, false);
}

/**
 * The pausal form of the last word: a reader stops at the end of the line, so
 * the final case vowel is not said — al-khāsirīna is read al-khāsirīn, a final
 * tanwīn fatḥ becomes a long ā, and a final tāʾ marbūṭa becomes h.
 */
function pausal(line: string): string {
  const m = /(\S+)$/.exec(line);
  if (!m) return line;
  let w = m[1];
  if (/at(?:an|un|in|a|u|i)$/.test(w)) w = w.replace(/at(?:an|un|in|a|u|i)$/, "ah");
  else if (/[^aāiīuū]an$/.test(w)) w = w.replace(/an$/, "ā");
  else if (/[^aāiīuū](?:un|in)$/.test(w)) w = w.slice(0, -2);
  else if (/[^aiuāīū\s-][aiu]$/.test(w)) w = w.slice(0, -1);
  return line.slice(0, m.index) + w;
}
