# ROADMAP

Where the site is, what holds it back from being a daily companion, and the
order to fix it in. Written after reading the code and using the built site on
a phone in both languages.

The principle that got the site this far stays fixed: **no text reaches a
reader without a source, and nothing pretends to be more than it is.** Every
item below is chosen so it can be built without bending that.

---

## Where it stands

What is genuinely strong, and rare among duʿāʾ sites:

- The Qurʾānic Arabic is fetched and hash-locked. It cannot drift.
- Excerpts are shown inside their āyah, so a reader can tell part from whole.
- Established translations, named and public domain; classical tafsīr on 57 of 63.
- Fast, offline, private. No account, no tracking.

What stops it from feeling like a finished, professional product:

| # | Problem | Who notices |
|---|---|---|
| 1 | **The Turkish experience is half-built.** The interface switches, but all 63 occasion texts, all 30 reflections, the About page and the form notes are English-only. Google only ever sees the English, because Turkish is swapped in by script. | Every Turkish reader |
| 2 | **The home page is a statement, not a tool.** On a phone the first screen is a headline. A daily user wants today's duʿāʾ, their own list, and where they left off. | Daily users |
| 3 | **Navigation takes a fifth of the screen.** Six links wrap to two rows on mobile. | Everyone on a phone |
| 4 | **Saved duʿāʾ can silently disappear.** Bookmarks live only in `localStorage`. Safari deletes that after 7 days without a visit for sites not added to the home screen. There is no export. | Anyone who relies on Saved |
| 5 | **The collection is thin for daily use.** 5 entries from the Sunnah. The supplications people say every day (morning and evening, sleep, travel, eating, after ṣalāh) are mostly absent. | Daily users |
| 6 | **No way to hear it.** The transliteration helps, but people learn pronunciation by listening. | Learners, children, converts |
| 7 | **The design is careful but anonymous.** It reads as a well-set document, not as *this* site. Nothing would make someone recognise a screenshot of it. | First-time visitors |
| 8 | **Small seams.** Sūrah names come from the API in a different transliteration than the site's own ("Al-A'raaf" beside "Sūrat"). 27 entries have no written occasion. The ḥadīth reference numbers are unverified. | Careful readers |

---

## Done in this change

- Translator names are no longer printed above every translation. They are
  credited once, in each page's source notes. The project's own translations
  appear as "project translation" with no personal name, and the About page
  now has a **Credits** section naming the maintainer and translator.
- The first "situation" (e.g. *borç altındayken*) is no longer shown under the
  title. The situations remain lower on the page, relabelled from **"Said
  when"**, which wrongly implied the Prophet said it in that situation, to
  **"You might turn to it" / "Okunabileceği hâller"**.
- Developer language removed from what readers see ("verified by checksum",
  "Hand-entered — no ḥadīth edition exists to fetch", "framing dimmed", the
  footer's build description). The About page still explains all of it.
- The 27 pages that printed "the occasion has not yet been written" now omit
  that section. The gap is reported by `scripts/check-coverage.ts` instead.
- The About page and README said each ḥadīth page discloses that its reference
  number is unverified. None did. Now they do.
- Bookmark and copy buttons follow the interface language; the editorial-note
  byline no longer renders "NARRATİON" under Turkish casing.

---

## Phase 1 — Finish what is there (1–2 weeks)

Nothing new; make every existing page complete in both languages.

1. **Turkish content parity.** Add `tr` to `context.summary`, `reflection` and
   the form notes in the schema, make it required by `check-coverage.ts`, and
   translate the 63 + 30 texts. You are the right person for this; it is the
   single highest-value task on this list for your audience.
2. **Real Turkish pages.** Build `/tr/…` routes with Astro's i18n routing
   instead of swapping text by script, with `hreflang` between the pair. This
   is what lets "peygamberlerin duaları", "Yunus duası" and "borçtan kurtulma
   duası" find the site in Google Türkiye. Today they cannot.
3. **Write the 27 missing occasions**, each citing its tafsīr, so no Qurʾānic
   page lacks one. `npx tsx scripts/check-coverage.ts` lists them.
4. **Sūrah names in the site's own transliteration**: a 114-entry table in
   `content/` rather than the API's spelling.
5. **Verify the five ḥadīth references** against sunnah.com / a printed
   edition, then remove the notice. Ask one qualified person to review the
   English and Turkish ḥadīth translations and record them in `reviewedBy`.
6. **A custom domain.** `candanumut.github.io/dua` reads as a personal
   project. A short domain is the cheapest professionalism there is (~$12/yr,
   GitHub Pages supports it directly).

## Phase 2 — Make it a daily companion (2–4 weeks)

All of this stays static and private. No server, no account.

1. **Home becomes "Today".**
   - *Duʿāʾ of the day*, picked from the date (same for everyone, no server).
   - *Continue*: the last page opened.
   - *My lists*, below.
   - The current statement moves to About.
2. **Bottom tab bar on mobile**: Today · By need · Prophets · Search · Mine.
   Settings goes into "Mine".
3. **My lists.** Personal, ordered collections, e.g. "Morning" or "For my
   parents", that open in reading mode. This is the main feature that makes
   someone return every day, and it builds directly on bookmarks.
4. **Reading mode.** Full screen, large Arabic, swipe to the next duʿāʾ in a
   list, prophet or theme. Screen kept awake while reading.
5. **Memorisation mode.** Hide the Arabic word by word and reveal it on tap;
   show the first letter of each word as a prompt. Simple, effective, and no
   other site with sourced text does it well.
6. **Do not lose people's data.** Call `navigator.storage.persist()`. Add
   export and import of lists, saved items and settings as a small file. Show a
   one-time hint to add the site to the home screen, which is also what stops
   Safari's 7-day deletion.
7. **Share as an image.** A card with the Arabic, translation and citation,
   drawn on a canvas in the browser, sized for WhatsApp/Instagram stories.
   This is how the site will actually spread in Turkey, and it keeps the
   citation attached to the text, which the copy button already insists on.

## Phase 3 — Grow the collection, keep the standard (ongoing)

1. **Daily Sunnah supplications**: morning/evening, before sleep, on waking,
   travel, eating, entering the home, after ṣalāh, istikhāra, distress. Start
   with the ones in Bukhārī and Muslim.
2. **Bring ḥadīth into the same pipeline as the Qurʾān.** Fetch the Arabic from
   a published, openly licensed ḥadīth dataset, hash-lock it in
   `content.lock.json`, and record the sunnah.com reference. Check the
   dataset's licence and accuracy before adopting it. If none is good enough,
   keep hand entry but require a second person's check on each entry.
3. **Recitation audio for Qurʾānic entries**, per āyah, from a well-known
   reciter via a public per-āyah audio source. Stream on demand and cache only
   what has been played, so offline size does not balloon from 5 MB to 500.
   No audio for ḥadīth unless it is a real recording of a qualified reader.

## Phase 4 — A design that is recognisably this site (2–3 weeks, prototype first)

Keep the foundation in `DESIGN.md`: the marginal apparatus, the type and the
palette are right. What is missing is a **signature someone can recognise**:

- **A mark and wordmark** that work at 26px and on a share card. The current
  icon is a generic list glyph.
- **One ornament system, drawn as SVG**: a thin geometric frame inspired by
  *tezhip* and *serlevha*, used only around the Arabic on the duʿāʾ page and
  on share cards. Ornament stays rare, so it stays meaningful.
- **The Arabic as the hero.** A raised page panel with the frame, larger on
  the duʿāʾ page, before the title rather than after it on mobile.
- **A Turkish name that stands alone** (e.g. *Peygamberlerin Duaları*) as a
  first-class brand, not a translation of the English one.

"Unique" is a judgement call, so this phase starts with two or three static
mockups of the duʿāʾ page and the Today screen to choose between, before any
CSS is changed.

## Phase 5 — Reach (after Phases 1–2)

1. **Reminders.** A browser cannot reliably schedule a daily notification
   without a server. There are two honest options:
   - (a) Wrap the site with Capacitor for the App Store and Play Store and use
     local notifications. No server, and it also gives store presence.
   - (b) Web Push from a small backend (e.g. a Supabase cron function), which
     works for home-screen installs on iOS 16.4+ and Android.

   (a) fits the privacy promise better. Either way it is opt-in.
2. **Feedback without a GitHub account.** Most readers will never open an
   issue. A simple form, or a mailto: with the page and reference
   pre-filled.
3. **Measurement, if wanted.** Today the site promises no analytics. If growth
   needs numbers, a cookieless, aggregate counter can be added, but the About
   page must then say so. Not adding one is also a fine answer.

## Engineering, alongside every phase

- **Playwright smoke test in CI**: every page renders, Arabic is present, no
  `undefined`, and both languages switch. Playwright is already a dependency.
- **A UI-copy lint**: fail the build if reader-facing templates contain
  developer words (checksum, fetch, hand-entered, pipeline). This is the check
  that would have caught most of what was fixed in this change.
- **i18n completeness check**: every `data-i18n` key and every content field
  has a Turkish value.
- **axe accessibility check and a Lighthouse budget** (performance ≥ 95,
  CLS < 0.1) on the three main templates.

## What not to build

- **Streaks, points or badges for worship.** They turn a duʿāʾ into a chore to
  keep a number up. A private "recently read" list gives the same continuity
  without it.
- **Claims of reward for a count of recitations** without a graded narration.
- **Machine-translated scripture or commentary shown as if reviewed.** AI can
  help draft the Turkish occasions in Phase 1, but each one ships only after
  you have checked it.
- **Accounts or sync** until export/import has shown people actually want
  their data on more than one device.

---

## Suggested order, if time is short

1. Turkish content parity and `/tr/` routes (Phase 1.1–1.2)
2. Today home and bottom tab bar (Phase 2.1–2.2)
3. My lists, plus persist/export (Phase 2.3, 2.6)
4. Share as image (Phase 2.7)
5. Daily Sunnah supplications (Phase 3.1)
6. Design prototypes (Phase 4)

Items 1–4 alone would change the site from a good reference into something
people open every morning.
