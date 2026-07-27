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

This is the one exception, because no API serves graded, versioned ḥadīth text.
So the bar is higher rather than lower. In `content/hadith.ts` you must supply:

- `collection` and `number`, as that collection numbers it
- `grading` — ṣaḥīḥ, ḥasan, ḥasan ṣaḥīḥ
- `gradedBy` — who gave that grading

The schema **rejects** a ḥadīth source missing any of these. An ungraded ḥadīth
does not ship.

Copy the Arabic from a reliable digital edition. Do not retype it, do not
"clean it up", and do not correct what looks like a typo — open an issue
instead.

## Adding context or a reflection

These are different things and the distinction is load-bearing.

**`context`** is *when and why it was said*. It is transmitted knowledge and it
**requires a citation** — a tafsīr or sīrah work, named, with a locus. If you
cannot cite it, do not write it.

**`reflection`** is this project's own thought on applying the duʿāʾ. It renders
in a visually distinct register and is labelled as an editorial note. It may
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
- Turkish is this project's own, CC BY-SA 4.0.

If you add a translation in a new language, check its licence before you commit
it. If the licence is unclear, do not ship it.

## What CI enforces

```bash
npm run typecheck        # tsc --noEmit, strict
npm run content:verify   # re-derives all Arabic, fails on any drift
npx tsx scripts/migrate-legacy.ts   # fails loudly if Turkish would be dropped
npm run build
```

`content:verify` is the important one. It re-fetches every āyah and compares
against `content.lock.json`. If you hand-edit Arabic anywhere, the build breaks —
which is the point.

## Reporting an error

If you find a mistake in the Arabic, a reference, a translation, or a context,
please [open an issue](https://github.com/CandanUmut/dua/issues/new). Errors in
the text itself are the highest priority and will be fixed before anything else.

You do not need to know how to fix it. Telling us what is wrong is enough.
