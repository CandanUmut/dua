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

for (const d of duas) {
  for (const lang of ["en", "tr"] as const) {
    if (!d.translations.some((t) => t.lang === lang)) {
      problems.push(`${d.id}: no ${lang} translation`);
    }
  }
  // Only `attributed` entries are allowed to have no Arabic.
  if (!d.arabic && d.source.type !== "attributed") {
    problems.push(`${d.id}: no Arabic`);
  }
  if (!d.context.summary.trim()) problems.push(`${d.id}: empty context`);
  if (d.context.references.length === 0) problems.push(`${d.id}: context has no citation`);
  for (const t of d.translations) {
    if (!t.translator.trim()) problems.push(`${d.id}: ${t.lang} translation has no translator`);
    if (!t.licence.trim()) problems.push(`${d.id}: ${t.lang} translation has no licence`);
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} coverage problem(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.error(`✓ all ${duas.length} entries have English, Turkish, a citation and attribution`);
