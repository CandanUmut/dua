/**
 * Fails the build if any entry is missing a translation, Arabic where it should
 * have some, or a citation.
 *
 * This exists because the gaps it checks for were all real and all invisible:
 * the five ḥadīth entries shipped with no English at all, and 26 entries had no
 * Turkish, because nothing asserted that they must.
 */

import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Dua } from "../content/schema.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { duas } = JSON.parse(
  await readFile(resolve(ROOT, "content/generated/site.json"), "utf8"),
) as { duas: Dua[] };

const problems: string[] = [];
/**
 * Not fatal. An entry without a written occasion still has its Arabic, both
 * translations and (for Qurʾānic entries) the Jalālayn commentary. This used
 * to be a hard failure, which was satisfied by a "not yet written" placeholder
 * printed to readers — the check passed and the page looked unfinished. The
 * gap is now reported here instead of on the page.
 */
const missingOccasion: string[] = [];

for (const d of duas) {
  for (const lang of ["en", "tr"] as const) {
    const found = d.translations.filter((t) => t.lang === lang);
    if (found.length === 0) problems.push(`${d.id}: no ${lang} translation`);
    // Exactly one. Two renderings of the same scripture side by side ask the
    // reader to adjudicate between them, which is not their job.
    if (found.length > 1) {
      problems.push(
        `${d.id}: ${found.length} ${lang} translations (${found.map((t) => t.translator).join(", ")})`,
      );
    }
  }
  // Only `attributed` entries are allowed to have no Arabic.
  if (!d.arabic && d.source.type !== "attributed") {
    problems.push(`${d.id}: no Arabic`);
  }
  const occ = d.context.summary;
  if (!occ.en.trim()) missingOccasion.push(d.id);
  // Turkish parity is not optional: a Turkish page must never fall back to an
  // English occasion or reflection.
  if (occ.en.trim() && !occ.tr.trim()) problems.push(`${d.id}: occasion has no Turkish`);
  if (d.reflection && !d.reflection.text.tr.trim()) problems.push(`${d.id}: reflection has no Turkish`);
  for (const lang of ["en", "tr"] as const) {
    if (d.situations[lang].length !== d.situations.en.length) problems.push(`${d.id}: situations ${lang} count differs`);
  }
  if (d.context.references.length === 0) problems.push(`${d.id}: context has no citation`);
  for (const t of d.translations) {
    if (!t.translator.trim()) problems.push(`${d.id}: ${t.lang} translation has no translator`);
    if (!t.licence.trim()) problems.push(`${d.id}: ${t.lang} translation has no licence`);
  }
}

if (missingOccasion.length) {
  console.error(`! ${missingOccasion.length} entries have no written occasion yet (section hidden on the page):`);
  for (const id of missingOccasion) console.error(`  ${id}`);
}

if (problems.length) {
  console.error(`✗ ${problems.length} coverage problem(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.error(`✓ all ${duas.length} entries have English, Turkish, a citation and attribution`);
