# DESIGN

**Phase 4 deliverable.** Written before any CSS, and self-audited against the
brief's §6.1 banned list at the end.

The reference points are the muṣḥaf, the critical edition, and the well-set
devotional book. Not the SaaS landing page. The page is mostly text and mostly
still; margins carry meaning.

---

## 1. Palette

Taken from manuscript materials rather than from a screen. Two pigments and a
paper, plus greys.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#E8E6DF` | `#191B1A` | Page. Light is a cool rag-paper grey-green, not cream. Dark is a warm near-black, never `#000`. |
| `--paper-raised` | `#F1EFE9` | `#212320` | Cards, the Arabic panel. One step *up* in light, one step up in dark. |
| `--ink` | `#1B1E1C` | `#DAD7CD` | Body text. Neither pure black nor pure white. |
| `--ink-soft` | `#4E534E` | `#9A9990` | Metadata, captions. |
| `--lapis` | `#2C4A6E` | `#8AA9CC` | Links, active state, focus. Lapis lazuli — the illumination blue. |
| `--rubric` | `#7E3B2E` | `#C08B7B` | **Source apparatus only.** Rubrication: the red a scribe used for headings and marginal references. |
| `--rule` | `#C9C6BC` | `#33352F` | Hairlines. |

**Why not the obvious choices.** The brief names warm cream `#F4F1EA` with a
terracotta `#D97757` accent as the single most common AI output, and it is
exactly what this brief summons. `--paper` here is deliberately pushed cool and
green (`#E8E6DF`, hue ~60° at low saturation) rather than warm and yellow, and
`--rubric` is a dark oxide red at 33% lightness — a manuscript rubric, not a
mid-tone terracotta accent. They are not interchangeable: put them side by side
and the difference is obvious.

Green was avoided as a primary colour despite the obvious association, because
"Islamic site ⇒ green" is the content-level equivalent of the same failure.

**Contrast.** `--ink` on `--paper` is 13.9:1. `--ink-soft` on `--paper` is
6.4:1. `--lapis` on `--paper` is 6.8:1. `--rubric` on `--paper` is 6.2:1. All
clear AA for body text; the first clears AAA.

### Dark mode is designed, not inverted

Light `--paper` is a *tinted* light; dark `--paper` is a warm near-black at
L≈10%, not the inverse. Contrast is deliberately reduced from 13.9:1 to 11.2:1
because full-strength white on black blooms, and blooming is what destroys thin
Arabic diacritics first. `--ink` in dark mode is a warm bone `#DAD7CD` for the
same reason. The two accents lighten and desaturate rather than staying put — a
lapis that works on paper is nearly invisible on near-black.

---

## 2. Type

| Role | Face | Licence | Why |
|---|---|---|---|
| Arabic | **Amiri** | OFL 1.1 | A Naskh revival of the Būlāq type, designed for exactly this: vocalised Qurʾānic text at length. Its diacritics stay distinct at reading sizes, which is the whole problem. |
| Body | **Source Serif 4** | OFL 1.1 | A text serif with a large x-height and open apertures, drawn for extended screen reading. Variable, so weight costs nothing extra. |
| Utility | **Source Sans 3** | OFL 1.1 | Citations, metadata, navigation. Pairs with the serif by construction — same family, same designer, same proportions. |

Self-hosted, subsetted to latin / latin-ext / arabic. Latin-ext is a separate
file so it only downloads for Turkish readers. All variable across 400–700.

`font-display: block` on Amiri, per the brief — a fallback flash on vocalised
Arabic is worse than a brief blank, because the fallback will render the
diacritics wrong and then reflow.

### Scale

A 1.25 (major third) modular scale on a 16px base, which gives a small enough
step to keep headings from shouting:

```
  0.64  0.8   1.0   1.25  1.563  1.953  2.441   × 16px
  10.2  12.8  16    20    25     31.2   39
```

Spacing is a separate 4px-based scale: `4 8 12 16 24 32 48 64 96`. Nothing
ad hoc; every value in the stylesheet comes from one of these two.

### Arabic typography

This is where the old site failed hardest, so it is specified in detail.

- **Size relationship: 1.5×.** Arabic body is `1.5rem` against a `1rem` Latin
  body. The brief's range is 1.4–1.6; 1.5 sits where Amiri's x-height matches
  Source Serif's optically. The old site ran 1.33× — and set the Arabic
  *smaller than a section heading*, inverting the hierarchy.
- **Line-height 2.1.** Verified by screenshot that no fatḥa is clipped at the
  top of its line box and no kasra at the bottom.
- **`font-weight: 400`, never more.** The old site set Arabic at 600 with no
  Arabic font specified, which triggers *synthetic bolding* — the renderer
  algorithmically thickens glyphs and smears the diacritics into the letters
  beneath. This is the single most damaging line in the old stylesheet.
- **`dir="rtl"` and `lang="ar"` on the Arabic node specifically**, never on the
  document. Numerals inside Arabic runs are wrapped in `<bdi>`.
- **No `text-align: justify`.** Ragged (rtl-ragged) is correct; justified
  Arabic produces the gaps everyone recognises and nobody wants.
- **`translate="no"`** on every scripture container, plus
  `<meta name="google" content="notranslate">`.

---

## 3. Signature element

**The source apparatus is set as a marginal rubric.**

On wide screens the citation — sūrah name, āyah reference, translator, grading,
and the excerpt disclosure — sits in a left margin column beside the text,
set in Source Sans at 0.8rem in `--rubric`, aligned to the top of the passage
it refers to. It does not sit under the text in a box. It sits *next to* it, in
the margin, the way a critical edition or an annotated muṣḥaf puts its
apparatus.

Below 900px the margin folds under the passage as a rule-topped block, keeping
the same type and colour so the relationship survives the fold.

**Why this one.** Three candidates were considered:

1. *The Arabic/translation spatial relationship* — setting them as facing
   columns. Rejected: it breaks completely on mobile, which is most traffic,
   and the fallback is just a stack.
2. *The prophetic timeline as the primary navigation* — a drawn vertical
   sequence. Rejected as the signature (kept as an ornament on `/prophets`):
   it is a beautiful object that most visitors, arriving mid-crisis via search,
   will never see.
3. *The marginal rubric* — chosen. It is visible on every duʿāʾ page, which is
   where visitors actually land; it directly serves the brief's central concern
   that every claim carries a citation, by making the citation architectural
   rather than an afterthought; and it is the one thing here that no
   template produces, because templates put metadata under content in a card.

Boldness is spent here. Everything else stays quiet.

---

## 4. Two directions, and the recommendation

**Direction A — "the reading edition" (restrained).** What is described above.
Paper, ink, one blue, one red, generous margins, no ornament except the
marginal rule. Rules are hairlines; nothing has a shadow; nothing has a radius
above 2px. The prophet index is a plain ordered list with dates ranged right.

**Direction B — "the illuminated edition" (braver).** Everything in A, plus:
the prophet index becomes a drawn vertical timeline with the duʿāʾ hanging off
it as branch points; theme pages open with a large set piece in Amiri; the
duʿāʾ page carries a hairline geometric rule — a single line, derived from the
proportions of the page grid, not a downloaded Islamic-pattern SVG.

**Recommendation: A, with the timeline from B on `/prophets` only.**

B's set pieces put Arabic type in a decorative role, and the moment scripture
is decoration rather than text the brief's §2.5 is in danger even where no rule
is literally broken. The timeline survives because it is genuinely
navigational — it *is* the index, drawn — rather than ornament laid over
content. That is the whole difference.

---

## 5. Self-audit against §6.1

Checked before writing any CSS. The banned list, item by item:

| Banned | Status |
|---|---|
| Cream `#F4F1EA` + serif + terracotta `#D97757` | **Avoided deliberately.** Paper pushed cool/green; rubric is a dark oxide red, not a mid-tone terracotta. This was the specific trap and it is why the palette is sourced from pigments. |
| Near-black + acid green/vermilion accent | Not used. |
| Purple→blue gradients | No gradient anywhere in the system. |
| Hero: centred headline + gradient blur + two buttons | Home page is a title, one sentence, and two links. No hero, no blur, no buttons. |
| Three-card feature grid | Not present. Nothing on the site explains its own benefits. |
| Emoji in headings or as bullets | None. |
| `rounded-2xl shadow-xl` everywhere | Max radius 2px; **zero box-shadows in the stylesheet.** Separation is by rule and space. |
| Sparkles, geometric-pattern SVG backgrounds, mosque silhouettes, lanterns | None. The only ornament is a hairline rule. |
| `01 / 02 / 03` markers | Only on `/prophets`, where the sequence *is* chronological and the numbering is the content. |
| Scroll-triggered fade-ins | None. No scroll listeners. `prefers-reduced-motion` respected; the only transition is a 120ms colour change on hover. |
| Inter + default Tailwind spacing as the whole system | No Tailwind, no Inter. Custom modular scale, three self-hosted faces. |

**Changed as a result of writing this section:** the first palette draft had
`--paper: #F2EEE6`, which on inspection was within a couple of percent of the
banned cream. It was pushed to `#E8E6DF` — cooler, greener, and a step darker.
The first type draft also paired the serif with Inter for utility; that was
replaced with Source Sans 3, since Inter is named in the brief as a tell.

---

## 6. Reading path

The duʿāʾ page reads top to bottom exactly as the brief specifies: **the words
→ how to say them → what they mean → why they were said → where they're from →
what's near them.**

```
  Prophet · situation                     ← who and when, one line
  ────────────────────────────────
  ARABIC              1.5rem / 2.1        ← translate="no", lang=ar, dir=rtl
  transliteration     0.8rem, --ink-soft  ← optional, setting-controlled
  translation         1rem, 62ch measure
  ────────────────────────────────
  Context — when and why he said this
  ────────────────────────────────
  Copy · Bookmark                         ← two quiet links, not a toolbar
  Related duʿāʾ
```

with the source apparatus in the left margin, beside the Arabic.

Default state shows **Arabic + translation + transliteration**. Transliteration
is on by default because a large share of the audience cannot read Arabic
script and would otherwise have no way to say the words at all — which is the
site's purpose. It is a setting either way.

---

## 7. Two doors

Home presents exactly two choices, phrased as the brief frames them:

- **By need** — the themes. Listed first, because someone arriving in
  difficulty does not know which prophet they want.
- **By prophet** — the index, in prophetic order.

Search is present in the header but visually secondary. **Everything else**
— script, transliteration on/off, translation choice, honorific form, type
size, theme — lives in Settings behind one control, persisted to
`localStorage`, and never blocks the reading path. The old site put nine such
controls in the navigation.
