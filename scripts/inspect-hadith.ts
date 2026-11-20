/**
 * Developer tool for choosing a ḥadīth excerpt — the counterpart of
 * `inspect-ayah.ts`. Prints the fetched narration word by word with its index,
 * plus the record's standard number and gradings, so the supplication's
 * `fromWord` / `toWord` are picked by reading, never by typing Arabic.
 *
 *   npx tsx scripts/inspect-hadith.ts bukhari:6306 muslim:1334
 *
 * The number after the colon is the dataset's `hadithnumber`. For Bukhārī and
 * the Sunan it equals the standard number; for Muslim it does not — the tool
 * prints the standard (ʿAbd al-Bāqī) number alongside so the two can be
 * matched.
 */

import { fetchHadith, tokenise, type Book } from "./hadith-api.js";

const specs = process.argv.slice(2);
if (!specs.length) {
  console.error("usage: tsx scripts/inspect-hadith.ts <book>:<datasetNumber> …");
  process.exit(1);
}

for (const spec of specs) {
  const [book, n] = spec.split(":");
  const rec = await fetchHadith(book as Book, Number(n));
  const words = tokenise(rec.text);
  console.log(`\n=== ${spec}  standard no. ${rec.arabicnumber}  (${words.length} words)`);
  for (const g of rec.grades) console.log(`    grade: ${g.name} — ${g.grade}`);
  console.log(words.map((w, i) => `${i}:${w}`).join("  "));
}
