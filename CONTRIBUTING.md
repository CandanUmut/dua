# Contributing

The rule that matters most: **never type Arabic scripture into this
repository.** Everything else follows from it.

## Setup

```bash
npm install
npm run content:all     # fetch Arabic, migrate Turkish, build + validate
npm run dev
```

## Adding a Qurʾānic duʿāʾ

You add a *reference*, not a text.

**1. Find the word boundaries.** If the supplication sits inside a longer āyah,
you need to know where it starts and ends:

```bash
npx tsx scripts/inspect-ayah.ts 21:87
```

That prints each word of the fetched Uthmani text with its index, alongside a
Pickthall gloss. Read the gloss, find where the narrative framing ends and the
supplication begins, and note the index. **Choose the boundary by reading this
output — never by recalling the āyah.**

**2. Add the entry** to `content/duas.ts`:

```ts
{
  id: "yunus-la-ilaha-illa-anta",
  speaker: "yunus",
  title: { en: "The call from the depths", tr: "Karanlıkların içinden gelen çağrı" },
  ayat: a(21, 87),
  excerpt: { fromWord: 14, toWord: 23, note: CUT.preamble },
  themes: ["distress", "forgiveness"],
  situations: { en: ["at the lowest point"], tr: ["en dip noktada"] },
}
```

`excerpt` is a half-open range `[fromWord, toWord)`. Omit it when the duʿāʾ is
the whole passage.

**3. Rebuild:**

```bash
npm run content:all
```

This fetches the Arabic, records a SHA-256 in `content.lock.json`, generates the
transliteration, and validates everything against the schema. Commit the
generated files along with your change.

### Why it works this way

An audit of the previous version of this site found two entries where the Arabic
had drifted from the verse it cited. One carried the text of a completely
different āyah. The other had words *inserted* at an excerpt boundary, to make a
trimmed fragment read as a standalone address.

Both had citations that looked right. Both read fluently. Both had translations
that agreed with the corrupted text, because the error was introduced when the
entry was written. No amount of careful review catches that — reviewers read for
sense, and it made sense.

Storing references and word indices instead of text makes the whole class of
error unrepresentable. There is no field you *could* put a wrong word into.

## Adding a ḥadīth duʿāʾ

The ḥadīth now follow the same rule as the Qurʾān: **no Arabic is typed.** The
text comes from the open hadith-api edition (Unlicense) by collection and
number, and is hash-locked in `hadith.lock.json`.

1. Find the narration and choose the supplication's word range by reading:

   ```sh
   npx tsx scripts/inspect-hadith.ts bukhari:6306 muslim:1334
   ```

   The number after the colon is the dataset's own record number. For Bukhārī
   and the Sunan it equals the standard number; for Muslim it does not — the
   tool prints the standard (ʿAbd al-Bāqī) number beside it.

2. Add a seed to `content/hadith.ts` with `ref` (book, dataset number,
   standard number, and `variant` for Muslim's a/b sub-narrations), the
   `excerpt` range, titles, translations, the `context` (what the narration
   itself says, in both languages), themes, situations, and `moments` only if
   the narration ties the words to a moment.

3. `npx tsx scripts/fetch-hadith.ts`, then `npm run content:build`.

The fetch fails if the record's standard number is not the one you cited, if
the text contains a corrupted character, or — for the Sunan — if al-Albānī's
grade is weaker than ḥasan. Bukhārī and Muslim are ṣaḥīḥ by inclusion.

Translations here are the project's own. They render as "not yet reviewed"
until someone has checked them against the Arabic and set `reviewed: { en:
true, tr: true }` on the seed.

## Adding a passage from outside the Qurʾān and Sunnah

*There are currently none; see the note in `content/attributed.ts` for why the
one Psalm was removed. The rules below stand for any future entry, and
rendering for this type would need to be restored first.*

A few prophets the Qurʾān names have no supplication quoted in it. Where one is
attributed to such a prophet in another scripture, it can go in
`content/attributed.ts` — under strict conditions:

- It must be a **supplication in form**, not narrative about one.
- It must be **traditionally attributed** to that prophet.
- It must contain **nothing contradicting Islamic belief about God**. Passages
  touching divine sonship, intercession, or the divine name as a proper noun
  are not selected. This is a duʿāʾ reference, not an edition of the Psalms.
- The text is **fetched, never typed** — `scripts/fetch-attributed.ts` pulls it
  from the World English Bible (public domain) and hash-locks it, exactly as the
  Arabic is.
- It carries a `note` stating its status, which the page shows prominently.

These entries get their own `source.type`, their own visual treatment, and a
notice saying they are outside the Qurʾān and Sunnah, carry no chain of
transmission, and are not revelation. They are never mixed into Qurʾānic
entries. If you cannot meet every condition above, do not add the entry.

## Adding context or a reflection

These are different things and the distinction is load-bearing.

**`context`** is *when and why it was said*. It is transmitted knowledge and it
**requires a citation** — a tafsīr or sīrah work, named, with a locus. If you
cannot cite it, do not write it. For Qurʾānic entries it lives in
`content/editorial.ts`, in English and Turkish, and says only what the
surrounding āyāt or Tafsīr al-Jalālayn say — covering the entry's whole range,
not its first āyah. Imprecations are described plainly, not softened. Every Qurʾānic entry also carries Tafsīr
al-Jalālayn, fetched and attributed by `scripts/fetch-tafsir.ts`.

If you add another commentary, **check it is actually that commentary.** An
earlier attempt to add al-Wāḥidī's Asbāb al-Nuzūl found the aggregator serving
identical text under three different scholars' names. `assertDistinct` in the
fetcher guards against this; do not remove it, and do not ship a source that
trips it.

**`reflection`** is this project's own thought on applying the duʿāʾ. It renders
in a visually distinct register, labelled "Editorial note — not a transmitted
narration". It carries no byline: it makes no factual claim, so naming a person
on each one adds nothing a reader can act on. It may
**not** make a factual claim about reward, virtue, or occasion. "Use this when
you cannot find your own words" is a reflection. "Reciting this seventy times
removes debt" is a claim, and needs a graded narration or it does not ship.

There are no *faḍāʾil* on this site. If you are about to write one and do not
have a citation in front of you, that is the moment to stop.

## Translations

Every translation names a translator and a licence. Unattributed text does not
ship, regardless of quality — the previous corpus had 47 unattributed
paraphrases and none of them were usable.

- English is Pickthall (public domain), fetched with the Arabic.
- Turkish is Elmalılı Hamdi Yazır (d. 1942, public domain), also fetched.

Both are fetched **per-āyah**, which matters: authoring a translation by hand
against a multi-āyah entry is how the earlier Turkish came to cover only the
first āyah of 20:25–28 while the Arabic covered all four. If you add a language,
fetch it the same way.

**One translation per language, per entry.** `scripts/check-coverage.ts` fails
the build on a second one. Two renderings of the same scripture side by side ask
the reader to adjudicate between them, which is not their job.

Precedence, highest first:

1. An established, attributed, public-domain translation fetched per-āyah.
2. This project's own, attributed to its translator — what the ḥadīth entries
   use, since nothing exists to fetch for them.
3. An unreviewed draft, marked `draft: true`, which renders an explicit label.

Choosing does not mean discarding: translations that are not displayed stay in
`data/prayers.json` and the migration file, and `migrate-legacy.ts` fails the
build if one goes missing from the repository.

If you add a translation in a new language, check its licence before you commit
it. If the licence is unclear, do not ship it.

## What CI enforces

```bash
npm run typecheck        # tsc --noEmit, strict
npm run content:verify   # re-derives the Qurʾānic and ḥadīth Arabic; fails on drift
npx tsx scripts/migrate-legacy.ts   # fails loudly if legacy Turkish would be lost
npx tsx scripts/check-coverage.ts   # both languages for every occasion and reflection
npm run check:arabic     # no Arabic phrases typed into templates
npm run build
npm run check:copy       # no developer language or placeholder text on any page
npm run test:smoke       # every page, both languages, on a phone, plus the features
```

`npm run check` runs all of the local ones in order. The smoke test needs a
Chromium; if the one Playwright expects is not installed, set
`CHROMIUM_PATH` to a browser binary.

## Reviewing the content

`.claude/agents/critic.md` defines an independent critic — content first,
then design and usability — that reports scored findings without editing
anything. Run it after any content or design change.

## Reporting an error

If you find a mistake in the Arabic, a reference, a translation, or a context,
please [open an issue](https://github.com/CandanUmut/dua/issues/new). Errors in
the text itself are the highest priority and will be fixed before anything else.

You do not need to know how to fix it. Telling us what is wrong is enough.
