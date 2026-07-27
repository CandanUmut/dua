# AUDIT — Prophets' Duʿāʾ

**Phase 1 deliverable. No code changes accompany this document.**

Date: 2026-07-27 · Commit audited: `6bfc4ff` · Auditor: automated pass + manual review

Every claim below is reproducible. Verification scripts and the fetched-āyah cache used
to produce the content-integrity findings are described in §3.

---

## 1. Stack

| Aspect | Finding |
|---|---|
| Framework | None. Vanilla JS, single IIFE. |
| Build | None. No `package.json`, no bundler, no transpile, no CI. |
| Dependencies | Zero. No npm, no CDN, no external scripts. |
| Styling | Single hand-written `styles.css`, CSS custom properties, no preprocessor. |
| Deployment | GitHub Pages (static; `DATA_URL` resolved relative to `document.baseURI`). |
| Language | ES2020-ish JS. No TypeScript, no type checking, no linting. |
| Tests | None. |

**Files**

| File | Lines | Bytes | Role |
|---|---:|---:|---|
| `app.js` | 2,530 | 90,850 | Entire application: routing, i18n, rendering, prefs, error handling |
| `index.html` | 587 | 25,928 | Static shell + a large hardcoded visual mockup |
| `styles.css` | 1,181 | 25,105 | "Apple-like" glassmorphic UI |
| `data/prayers.json` | — | 52,881 | 47 duʿāʾ records |
| `README.md` | 1 | 5 | Effectively empty |

**Nothing is unmaintained, because nothing is depended upon.** That is genuinely a
strength — there is no upgrade debt here, no supply chain, and the whole site is four
files. It is also why the codebase is not the valuable asset: it is ~4,300 lines of
hand-rolled infrastructure that a static site generator provides for free.

**Notable in `app.js`:** a full hand-written hash router (`parseHash`, `handleRouteChange`),
a hand-written i18n layer (`I18N` with `en`/`tr`), a hand-written focus trap, a debug
overlay behind `?debug=1`, and a defensive `normalizeAndValidateData()`. The code is
competent and careful. It is also solving problems that are solved.

---

## 2. Content inventory

**47 entries · 12 prophets · 42 Qurʾānic + 5 ḥadīth.**

Fields present on every record: `id`, `prophet{ar,en,tr}`, `source{type,reference}`,
`arabic`, `transliteration`, `english`, `turkish`, `translation_note`, `topics`,
`context`, `reflection`, `sources[]`. One record additionally carries `occasion`.

| Prophet | Entries | Prophet | Entries |
|---|---:|---|---:|
| Ibrāhīm (Abraham) | 15 | Ayyūb (Job) | 2 |
| Mūsā (Moses) | 10 | Sulaymān (Solomon) | 2 |
| Nūḥ (Noah) | 5 | Ādam | 1 |
| Muḥammad ﷺ | 5 | Yūnus (Jonah) | 1 |
| Zakariyyā (Zechariah) | 3 | Yūsuf (Joseph) | 1 |
| | | ʿĪsā (Jesus) | 1 |
| | | Lūṭ (Lot) | 1 |

**Entirely absent prophets:** Yaʿqūb, Shuʿayb, Dāwūd. All three have Qurʾānic material
(§7).

### Field quality

- **Sources cited?** Partially. Every entry has a `sources[]` array, but for Qurʾānic
  entries it contains only convenience links (`quran.com/7/23`, `tanzil.net/#7:23`) —
  these locate the āyah, they do not establish the text that shipped. The 5 ḥadīth
  entries cite collection + number and link `sunnah.com`, but **carry no grading**
  (`ṣaḥīḥ`/`ḥasan`/who graded it). Brief §2.1 requires grading.
- **Tashkeel?** Present on all entries — but see §3, presence is not correctness.
- **Transliteration scheme?** **No consistent scheme.** The corpus mixes a bare ASCII
  style (`zalamna`, `khasirin`) with an apostrophe-ʿayn style (`'ala al-ardi`,
  `mu'minan`). Emphatics are not distinguished from plain consonants at all — ẓ/z, ṣ/s,
  ḥ/h, and ت/ط all collapse. `الْخَاسِرِينَ` and a hypothetical `al-khāsirīn` are
  indistinguishable from unrelated words. This is not ALA-LC, not IJMES, not a
  documented simplified scheme; it is ad hoc per entry.
- **Translations.** **All 47 records are marked `"translation_note": "Paraphrase"`.**
  No translator is named anywhere in the dataset, because there is no translator —
  these are unattributed paraphrases of unknown provenance. Under brief §2.3 not one of
  them is shippable as-is. The **Turkish** translations are in the same position, and
  they are the dataset's most distinctive asset — they must be retained and given a
  proper provenance record, not deleted (see §7 recommendation).
- **`reflection` field.** Present on all 47, entirely unsourced editorial advice
  ("Use this dua to own mistakes and ask Allah's mercy without excuses"). This is the
  category brief §2.2 targets. It is devotional guidance presented in the same visual
  register as sourced content, with no citation and no attribution.

---

## 3. Content integrity spot-check

The brief asked for five. I checked **all 42 Qurʾānic entries** programmatically against
the Al Quran Cloud API (`api.alquran.cloud/v1`), comparing against both the
`quran-uthmani` and `quran-simple` (imlāʾī) editions, at two levels: consonantal
skeleton (diacritics and alif-forms normalised away) and diacritised form.

> The brief predicted "I expect this to find problems." It did.

### 3.1 Which edition is the site actually using? Neither.

| Comparison | Full āyah match | Correct excerpt | Mismatch |
|---|---:|---:|---:|
| vs `quran-uthmani` | 12 | 6 | **24** |
| vs `quran-simple` (imlāʾī) | 22 | 16 | **4** |

At the *skeleton* level the corpus is broadly imlāʾī: it writes `الْخَاسِرِينَ`,
`السَّمَاوَاتِ`, `الظُّلُمَاتِ` where Uthmani uses dagger-alif forms `ٱلْخَٰسِرِينَ`,
`ٱلسَّمَٰوَٰتِ`, `ٱلظُّلُمَٰتِ`. That alone is a legitimate editorial choice.

But the diacritics tell a different story:

**29 of 42 entries diverge in tashkeel from the imlāʾī edition whose orthography they
otherwise follow.**

Representative — `adam-7-23`:

```
SITE  …أَنفُسَنَا وَإِن لَّمْ…      ← Uthmani-style: no sukūn on nūn, shadda-assimilated lām
API   …أَنْفُسَنَا وَإِنْ لَمْ…      ← imlāʾī: explicit sukūn, no assimilation mark
```

The site writes imlāʾī *letters* with Uthmani *pointing*. That combination corresponds
to **no authenticated edition of the muṣḥaf**. It is exactly the signature of Arabic
assembled by hand or by a model from mixed sources — which is precisely what brief §2.1
exists to prevent. Individually these are mostly not *errors of recitation*; collectively
they mean **no character on this site is currently traceable to an authenticated source**,
and there is no mechanism that would catch it if one were.

### 3.2 Two substantive errors in the scripture itself

These are not orthographic. These are wrong text under a citation.

---

**🔴 CRITICAL — `sulaiman-27-19`: the text of 46:15 is presented as 27:19 and attributed
to Sulaymān.**

```
SITE (cited 27:19, attributed to Sulaymān):
  رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ … وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ
  وَأَصْلِحْ لِي فِي ذُرِّيَّتِي إِنِّي تُبْتُ إِلَيْكَ وَإِنِّي مِنَ الْمُسْلِمِينَ

ACTUAL 27:19 (Sulaymān):
  … وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ

ACTUAL 46:15 (al-Aḥqāf — not a prophet's duʿāʾ):
  … وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَصْلِحْ لِي فِي ذُرِّيَّتِي
  إِنِّي تُبْتُ إِلَيْكَ وَإِنِّي مِنَ الْمُسْلِمِينَ
```

The two āyāt share an opening of ~14 identical words and then diverge. The site took
46:15's tail, kept 27:19's citation, and filed it under Sulaymān. **The English and
Turkish translations both follow 46:15**, so the error is consistent across all three
language fields — meaning it was introduced at authoring time, not by a later edit.

46:15 is not attributed to any prophet in the Qurʾān; it is the duʿāʾ of the believer
reaching forty. So this entry is wrong three ways: wrong text for the citation, wrong
citation for the text, wrong prophet for both.

---

**🔴 CRITICAL — `ayyub-38-41`: words inserted into the āyah.**

```
SITE (cited 38:41):   رَبِّ إِنِّي مَسَّنِيَ الشَّيْطَانُ بِنُصْبٍ وَعَذَابٍ
ACTUAL 38:41:  …وَاذْكُرْ عَبْدَنَا أَيُّوبَ إِذْ نَادَىٰ رَبَّهُ أَنِّي مَسَّنِيَ الشَّيْطَانُ بِنُصْبٍ وَعَذَابٍ
```

`رَبِّ` does not occur in the āyah, and `أَنِّي` has been changed to `إِنِّي`. Trimming
narrative preamble to isolate the duʿāʾ is correct editorial practice and the corpus
does it well elsewhere (16 entries are clean excerpts). But here the trim was
*backfilled with invented words* to make the fragment read as a standalone address.
That crosses from excerpting into composition.

---

### 3.3 Two lesser issues

- `ibrahim-2-129`, `ibrahim-14-37` — Uthmani-only forms (`يَتْلُوا` for `يَتْلُو`,
  `إِنِّيٓ` with maddah, `مِّنَ` with assimilation) inside otherwise-imlāʾī text.
  Same hybrid problem as §3.1, flagged separately only because they also fail the
  skeleton comparison.
- **No entry records that it is an excerpt.** 16 of 42 are partial āyāt. The schema has
  nowhere to say so, and the UI does not indicate it. A reader cannot tell whether they
  are seeing a complete āyah.

### 3.4 What this means

Findings §3.2 are the "unrecoverable by good design" failure the brief names first.
They are also *the argument for the whole build-time-fetch architecture*: both errors
are invisible to review — they read fluently, the citations look right, and the
translations agree with the corrupted text. Only a mechanical diff against an
authenticated source catches them. That check must be permanent and in CI, not a
one-time cleanup.

---

## 4. Design assessment

Asked for blunt; here it is.

**The visual language is "2020 Apple marketing page," and it is applied uniformly and
without reference to the content.** The stylesheet's own header comment says
`Premium Static UI (Apple-like)`. Concretely:

- **10 `backdrop-filter` glassmorphic panels** (`--blur: saturate(140%) blur(16px)`),
  translucent `rgba(255,255,255,.72)` surfaces layered over a `#f6f7fb` background.
- **Accent `#0a84ff`** — this is literally Apple's iOS system blue. It carries no
  relationship to the subject.
- **Two-stop drop shadows** (`0 22px 60px rgba(0,0,0,.12)`) and radii up to `22px` on
  effectively every surface. This is the `rounded-2xl shadow-xl` pattern the brief bans,
  expressed in vanilla CSS.
- **Type is `system-ui` for everything.** There is no display face, no body face, and —
  critically — **no Arabic face at all**. `.arabic` sets `direction`, size, and
  line-height but inherits `system-ui`, so vocalised Qurʾānic text renders in whatever
  the OS supplies: Segoe UI on Windows, Geeza Pro on macOS, Noto Naskh on Android. The
  single most important typographic surface on the site is unspecified.
- **Type scale is ad hoc:** `22 / 16 / 16 / 15 / 13 / 12`. `--h2` and `--h3` are the
  same value, so there are effectively two heading levels expressing three. There is no
  modular ratio. Spacing (`6 / 10 / 14 / 18 / 24 / 32`) is likewise hand-picked.

**Typographic hierarchy in practice:** near-flat. The Arabic (20px) is only 1.33× the
body text (15px) — well below the 1.4–1.6× the brief specifies, and far below what
vocalised Arabic needs. Meanwhile the heading is 22px, i.e. the scripture is set
*smaller than a section label*. The hierarchy inverts the content's actual importance.

**Arabic is set at `font-weight: 600`.** With no Arabic font specified, this triggers
**synthetic bolding** in most browsers — the renderer algorithmically thickens the
glyphs, which smears fatḥa/kasra/sukūn into the letterforms they sit on. On vocalised
Qurʾānic text this is the single most damaging line in the stylesheet.

`--arabic-line: 1.95` is close to acceptable (brief says 2.0–2.2) and is the one Arabic
typography decision that was made deliberately.

**Mobile:** `.grid-2` collapses to one column and the bottom nav is fixed, so the
layout does not break outright. But `--arabic: 20px` is not responsive — long vocalised
āyāt (21:87, 20:25–28) at 320px will wrap hard with no size adjustment, and the
fixed bottom nav plus sticky header eat vertical space on exactly the screens where
reading room is scarcest.

---

## 5. UX assessment — controls on first load

**≈45 interactive controls render before the user has read a single word of a duʿāʾ.**

| Region | Controls |
|---|---|
| Header | 3 theme segment buttons, 2 font-size buttons |
| Search bar | 1 search input, 1 clear button |
| Display toggles | 4 checkboxes: Arabic / Transliteration / English / Turkish |
| Primary nav | 5 tabs (Home, Prophets, Topics, Favorites, About) |
| Filter row | 3 `<select>` (prophet, topic, source), 1 clear-filters, 1 "reading mode" |
| Sort/view | 2 segment buttons, 1 sort, 1 view options |
| A–Z index | 7 letter buttons |
| Topic chips | 8 chips |
| Bottom nav | 5 items — **duplicating the 5 top tabs** |

**25 of these are labelled `placeholder` in their own `aria-label`.** The interface
advertises capability it does not have: `aria-label="Sort (placeholder)"`,
`aria-label="Reading mode (placeholder)"`, `aria-label="Share (placeholder)"`. A screen
reader user is told, out loud, that the control is a placeholder.

**Configuration masquerading as navigation** — these are settings, not ways to find a
duʿāʾ, and all belong behind a single Settings control per brief §5:

- the 4 display checkboxes (Arabic/translit/EN/TR visibility)
- the 2 font-size buttons
- the 3 theme segment buttons
- sort + view options

That is **9 controls removed from the reading path** with no loss of function.

**Genuine navigation** is only: search, prophet, topic, and the A–Z index — and even
there, prophet and topic exist *twice* (once as `<select>`, once as chips/index), and
the entire nav exists twice (top tabs + bottom bar). The home page presents neither of
the brief's "two doors" clearly; it presents about six half-doors.

**Onboarding modal** fires on first visit (`ONBOARDING_KEY`), adding a blocking layer
in front of an interface the user has not yet seen.

---

## 6. Accessibility

**Good:**
- Skip link to `#main` present.
- `:focus-visible` styling defined (2 rules).
- One `<h1>`; `aria-pressed` / `aria-current` used on toggles and nav.
- `<html lang="en">` set; `color-scheme: light dark` declared.
- Focus trap implemented for the modal.

**Problems:**

| Issue | Detail |
|---|---|
| **No `translate="no"` anywhere** | 0 occurrences in `index.html` or `app.js`. No `<meta name="google" content="notranslate">`. Chrome will re-translate the vetted English and Turkish translations, and will attempt the Arabic. Brief §2.4 violated outright. |
| **`lang="ar"` coverage is incomplete** | 4 occurrences in `index.html` (the static mockup), 2 in `app.js`. With 47 records × multiple Arabic nodes, most dynamically rendered Arabic ships with no `lang` at all — it inherits `lang="en"`. |
| **`dir="rtl"` same** | 4 static, 2 dynamic. `.arabic` sets `direction: rtl` in CSS, which handles rendering but **not** the semantic direction exposed to assistive tech. |
| **No `prefers-reduced-motion` block** | 0 occurrences, against `--t: 160ms` / `--t2: 240ms` transitions throughout. Brief quality bar violated. |
| **Contrast risk** | `--muted-2: rgba(11,15,23,.48)` on `#f6f7fb` ≈ **3.4:1** — below WCAG AA 4.5:1 for body text. Used for metadata. Compounded by translucent panels, where effective contrast varies with what is behind them. |
| **Synthetic-bold Arabic** | §4 — a legibility failure that affects the primary content. |
| **Placeholder labels announced** | 25 controls announce "(placeholder)" to screen readers. |
| **Bidi isolation** | `unicode-bidi: plaintext` is set on `.arabic`, which is reasonable, but no `<bdi>` around numerals embedded in Arabic runs. |

---

## 7. Recommendation

> **Rebuild the front end. Preserve, correct, and re-source the content layer.**

**The content is the valuable part, and it is 53 KB.** Specifically:

- The **Turkish translations** are the dataset's genuinely distinctive asset. Nothing
  comparable exists in the other reference sites in this space, and they must be
  carried forward in full — corrected and attributed, never dropped.
- The **`context` fields** are real editorial work and mostly sound; they need citations
  attached, not rewriting.
- The **topic tagging** is a workable first draft of the theme taxonomy.
- The **selection of duʿāʾ** (which āyāt count as a prophet's supplication, where to cut
  an excerpt) reflects judgement worth keeping — 16 of 42 excerpts are cut correctly.

**The code is 4,300 lines re-implementing routing, i18n, state persistence, and
templating by hand, in service of a site that is fundamentally 47 static documents.**
There is nothing to salvage architecturally, and every requirement in the brief that the
current stack cannot meet — static pre-rendering, schema validation in CI, content-hash
verification, per-page metadata and OG images, TypeScript strict, PWA — argues the same
way. Refactoring in place would mean building all of that infrastructure by hand,
which is how we got 90 KB of `app.js`.

**But — three things must survive the rebuild verbatim, and this is the constraint the
rebuild is designed around, not an afterthought:**

1. **Every Turkish translation.** All 47. Re-attributed, licence-recorded, but not
   dropped and not silently regenerated.
2. **Every existing URL.** `#view=...` hash routes must redirect to the new paths, not
   404 (brief §8).
3. **The editorial judgement in `context` and excerpt selection.**

### What the content layer needs before any UI work

1. **Re-fetch all 42 Qurʾānic texts** from a single declared edition (recommend
   `quran-uthmani` for provenance; `quran-simple` if the imlāʾī orthography the corpus
   already uses is preferred — but **declare one and hash-lock it**). Hand-typed Arabic
   is deleted, not corrected.
2. **Fix `sulaiman-27-19`** — decide whether the entry is Sulaymān 27:19 (replace text
   and both translations) or the āyah of al-Aḥqāf 46:15 (move out of the prophets
   section entirely). It cannot remain as it is for another day.
3. **Fix `ayyub-38-41`** — restore the actual āyah text; mark the excerpt boundary in
   data rather than inventing connective words.
4. **Replace all 47 paraphrase translations** with a licensed, attributed English
   translation (Pickthall and Yusuf Ali are public domain and available through the same
   API — confirmed reachable during this audit).
5. **Re-source the 47 Turkish translations** — establish provenance, or have them
   reviewed and attributed as original editorial translations for this project with a
   named reviewer. Either is acceptable; unattributed is not.
6. **Add grading to all 5 ḥadīth entries**, and flag them for manual review per §2.1.
7. **Decide the fate of the 47 `reflection` fields.** They are unsourced devotional
   advice. Per brief §2.2 they are cited, or deleted.
8. **Choose one transliteration scheme** and regenerate all 47 against it.
9. **Add the 3 missing prophets** — Yaʿqūb, Shuʿayb, Dāwūd.

### Appendix A verification (done as part of this audit)

All 60+ references in the brief's Appendix A were fetched and checked. **It is
substantially accurate.** Corrections:

- **Dāwūd 38:24** — contains *no quoted duʿāʾ*. The āyah narrates David's judgement
  about the ewes and then reports that he sought forgiveness and prostrated; his words
  of supplication are not quoted. Use as biographical context, not as a duʿāʾ entry.
- **Dāwūd 2:250** — is the duʿāʾ of Ṭālūt's army collectively ("those who crossed with
  him said"), among whom Dāwūd was present. Attributing it to Dāwūd personally
  overstates the text. File under the companion section or attribute collectively.
- **Yaʿqūb 12:18** — `فَصَبْرٌ جَمِيلٌ` is a statement of patience, not grammatically a
  supplication. Widely used as one; worth including, but label it accurately. 12:86 is
  a true duʿāʾ.
- **Maryam 19:18** — an istiʿādhah addressed to the one before her, not a duʿāʾ to
  Allah in form. Include with an accurate label.
- Everything else in Appendix A — including all of Ibrāhīm, Mūsā, Zakariyyā, Yūnus
  21:87, ʿĪsā, the Muḥammad ﷺ Qurʾānic set, and the entire companion section
  (18:10, 66:11, 3:35–36, 19:18, 7:126) — **verified correct as cited.**

The brief also under-counts in places: Ibrāhīm 14:38–39 and 26:88–89 continue duʿāʾ
sequences the brief cuts short, and Nūḥ 26:117–118 is a supplication not listed.

---

## 8. Summary of blocking findings

| # | Severity | Finding |
|---|---|---|
| 1 | 🔴 Critical | `sulaiman-27-19` presents 46:15's text under a 27:19 citation, attributed to Sulaymān; EN + TR translations follow the wrong āyah |
| 2 | 🔴 Critical | `ayyub-38-41` inserts `رَبِّ` and alters `أَنِّي`→`إِنِّي` — words not in the āyah |
| 3 | 🔴 Critical | No Arabic on the site is traceable to an authenticated source; hybrid orthography matches no edition; 29/42 diverge in tashkeel |
| 4 | 🔴 Critical | All 47 translations are unattributed paraphrases — unshippable under §2.3 |
| 5 | 🟠 High | 5 ḥadīth entries carry no grading |
| 6 | 🟠 High | 47 unsourced `reflection` fields presented as authoritative |
| 7 | 🟠 High | No `translate="no"`, no notranslate meta — browser will re-translate vetted text |
| 8 | 🟠 High | Arabic set at `font-weight: 600` with no Arabic font ⇒ synthetic bolding over diacritics |
| 9 | 🟡 Medium | `lang`/`dir` missing on most dynamically rendered Arabic |
| 10 | 🟡 Medium | ≈45 first-load controls, 25 self-labelled "placeholder" |
| 11 | 🟡 Medium | No `prefers-reduced-motion`; `--muted-2` fails AA at ~3.4:1 |
| 12 | 🟡 Medium | Transliteration follows no consistent scheme |
| 13 | 🟡 Medium | 16 excerpted āyāt not marked as excerpts in data or UI |

---

**Phase 1 complete. Checkpoint — awaiting go-ahead before Phase 2 (content architecture).**
