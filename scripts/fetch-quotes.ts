/**
 * Fetches the short Qurʾānic quotations used in the site's own chrome — the
 * home page epigraph, and anything like it added later.
 *
 * This exists because of a mistake worth recording: the epigraph was first
 * written by typing the Arabic straight into the page template. That is exactly
 * the thing this repository forbids everywhere else, and the fact that it was
 * "only" a four-word framing line on the home page rather than a duʿāʾ entry is
 * not a reason for it to be exempt. Scripture used as chrome is still scripture.
 *
 * So chrome quotations go through the same pipeline as everything else:
 * declared as a reference plus a word range, fetched from `quran-uthmani`, and
 * hash-locked. `scripts/check-no-typed-arabic.ts` now fails the build if Arabic
 * appears in a page template at all.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { ARABIC_EDITION, fetchAyat } from "./quran-api.js";
import { sha256 } from "./fetch-content.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

type QuoteSeed = {
  id: string;
  surah: number;
  ayah: number;
  /** Half-open [fromWord, toWord) into the fetched āyah. */
  fromWord: number;
  toWord: number;
  ref: string;
};

const QUOTES: QuoteSeed[] = [
  {
    // "Call upon Me, and I will answer you." The clause that grounds the whole
    // site: duʿāʾ is asked for because it is answered, not because nothing else
    // is left.
    id: "call-upon-me",
    surah: 40,
    ayah: 60,
    fromWord: 2,
    toWord: 5,
    ref: "40:60",
  },
];

const out = [];
for (const q of QUOTES) {
  const { joined } = await fetchAyat([{ surah: q.surah, ayah: q.ayah }], ARABIC_EDITION);
  const words = joined.split(" ");
  if (q.toWord > words.length) {
    throw new Error(`${q.id}: range [${q.fromWord}, ${q.toWord}) exceeds ${words.length} words`);
  }
  const text = words.slice(q.fromWord, q.toWord).join(" ");
  out.push({ id: q.id, ref: q.ref, text, sha256: sha256(text) });
  console.error(`  ${q.id.padEnd(20)} ${q.ref}  ${text}`);
}

await mkdir(resolve(ROOT, "content/generated"), { recursive: true });
await writeFile(
  resolve(ROOT, "content/generated/quotes.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.error(`\n✓ ${out.length} chrome quotation(s) → content/generated/quotes.json`);
