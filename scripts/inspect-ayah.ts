/**
 * Developer tool for choosing excerpt boundaries.
 *
 * Prints the fetched Uthmani text of one or more āyāt word-by-word with its
 * index, alongside a Pickthall gloss, so that an editor can pick the
 * `fromWord` / `toWord` of an excerpt by reading rather than by typing Arabic.
 *
 *   npx tsx scripts/inspect-ayah.ts 21:87
 *   npx tsx scripts/inspect-ayah.ts 20:25-28
 */

import { fetchAyat, ARABIC_EDITION, type AyahRef } from "./quran-api.js";

function parseRef(spec: string): AyahRef[] {
  const m = /^(\d+):(\d+)(?:-(\d+))?$/.exec(spec.trim());
  if (!m) throw new Error(`Bad reference: ${spec} (expected "21:87" or "20:25-28")`);
  const surah = Number(m[1]);
  const from = Number(m[2]);
  const to = m[3] ? Number(m[3]) : from;
  const refs: AyahRef[] = [];
  for (let a = from; a <= to; a++) refs.push({ surah, ayah: a });
  return refs;
}

const argv = process.argv.slice(2);
const compact = argv.includes("--compact");
const specs = argv.filter((a) => !a.startsWith("--"));

if (specs.length === 0) {
  console.error("usage: tsx scripts/inspect-ayah.ts [--compact] <ref> [<ref> ...]");
  process.exit(1);
}

for (const spec of specs) {
  const refs = parseRef(spec);
  const { joined } = await fetchAyat(refs, ARABIC_EDITION);
  const { joined: gloss } = await fetchAyat(refs, "en.pickthall");
  const words = joined.split(" ");

  if (compact) {
    console.log(`\n### ${spec}  (${words.length} words)`);
    console.log(`    ${gloss}`);
    console.log("    " + words.map((w, i) => `${i}·${w}`).join("  "));
    continue;
  }

  console.log(`\n${"=".repeat(72)}\n${spec}  (${words.length} words)\n${"=".repeat(72)}`);
  console.log(gloss);
  console.log("-".repeat(72));
  for (let i = 0; i < words.length; i++) {
    console.log(`${String(i).padStart(3)}  ${words[i]}`);
  }
}
