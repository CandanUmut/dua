/**
 * Fails the build if a run of Arabic words is typed directly into a page
 * template.
 *
 * Written after the home-page epigraph was added by typing the āyah straight
 * into `index.astro`. Every other route into this repository is guarded —
 * `content/duas.ts` holds references rather than text, `content:verify`
 * re-derives and hashes every character — but nothing stopped scripture being
 * written directly into a `.astro` file, and "it is only a four-word framing
 * line on the home page" is not an exemption. Scripture used as chrome is still
 * scripture.
 *
 * ## Where the line is drawn, and why it is imperfect
 *
 * The check is: **two or more consecutive Arabic words in an `.astro` file**.
 *
 * A single Arabic word in a template is almost always legitimate — the ﷺ glyph
 * in a sentence, a normalisation character class, a one-word example on the
 * search page showing that diacritics are optional. Requiring those to be
 * fetched would be theatre.
 *
 * Two or more consecutive words is a phrase, and a phrase in this domain is
 * almost always a quotation. That is the thing worth stopping.
 *
 * This is a heuristic, not a proof. It would not catch a single-word quotation,
 * and it does not scan `.ts` files, where the honorific table legitimately holds
 * multi-word Arabic labels — those are data about how to address a prophet, not
 * revealed text. The real guarantee for scripture remains `content.lock.json`
 * and `content:verify`; this is a second fence around the one gap those did not
 * cover.
 *
 * Escape hatch: put `arabic-ok` in a comment on the line if a multi-word run is
 * genuinely not a quotation.
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** A token containing at least one Arabic letter. */
const HAS_ARABIC_LETTER = /[ؠ-يٱ-ۓۺ-ۿ]/u;

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.name.endsWith(".astro")) out.push(full);
  }
  return out;
}

const problems: string[] = [];

for (const file of await walk(resolve(ROOT, "src"))) {
  const src = await readFile(file, "utf8");
  src.split("\n").forEach((line, i) => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith("*") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("<!--") ||
      line.includes("arabic-ok")
    ) {
      return;
    }

    // Longest run of Arabic words separated only by spaces. Splitting on any
    // non-Arabic, non-space character means markup and code between two Arabic
    // tokens breaks the run, which is what we want — `{a} · {b}` is not a quote.
    let longest = 0;
    for (const chunk of line.split(/[^؀-ۿ\s]+/u)) {
      const words = chunk.trim().split(/\s+/).filter((w) => HAS_ARABIC_LETTER.test(w));
      longest = Math.max(longest, words.length);
    }
    if (longest >= 2) {
      problems.push(`${relative(ROOT, file)}:${i + 1}  ${trimmed.slice(0, 90)}`);
    }
  });
}

if (problems.length) {
  console.error(`✗ Arabic phrase typed directly into ${problems.length} template line(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    `\nScripture is fetched and hash-locked, never typed — including in page\n` +
      `chrome. Declare it in scripts/fetch-quotes.ts and read it from\n` +
      `content/generated/quotes.json. If the run genuinely is not a quotation,\n` +
      `add "arabic-ok" in a comment on the line.`,
  );
  process.exit(1);
}

console.error("✓ no Arabic phrases typed into templates");
