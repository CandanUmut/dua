/**
 * Fails the build if reader-facing text contains developer language or
 * placeholder copy.
 *
 * Written after the reading page was found saying "Uthmani, verified by
 * checksum", "Hand-entered — no ḥadīth edition exists to fetch", and, on 27
 * pages, "The occasion of this supplication has not yet been written". All of
 * it was true; none of it was for a reader. This scans what a reader actually
 * sees — the built HTML, with scripts, styles and attributes removed — rather
 * than the templates, so a string cannot slip through by arriving from data.
 *
 * Run after `npm run build`.
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");

const BANNED: [RegExp, string][] = [
  [/\bchecksum\b/i, "developer term"],
  [/\bhash(?:-locked|ed)?\b/i, "developer term"],
  [/\bpipeline\b/i, "developer term"],
  [/\bhand-entered\b/i, "developer term"],
  [/\bschema\b/i, "developer term"],
  [/\bfetch(?:ed|ing)?\b/i, "developer term"],
  [/\bbuild (?:step|fails?|failed|time)\b|\bthe site is built\b/i, "developer term"],
  [/\bplaceholder\b/i, "placeholder copy"],
  [/\bnot yet (?:been )?written\b/i, "placeholder copy"],
  [/\bTODO\b|\bFIXME\b|lorem ipsum/i, "placeholder copy"],
  [/\bundefined\b|\bnull\b|\[object Object\]|NaN/, "rendering bug"],
  [/\{[a-z]+\}/, "unfilled template variable"],
];

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const visible = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    // Quoted commentary is a published translation; leave its wording alone.
    .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ");

const problems: string[] = [];
const files = await walk(DIST);
for (const f of files) {
  const text = visible(await readFile(f, "utf8"));
  for (const [re, why] of BANNED) {
    const m = re.exec(text);
    if (m) {
      const at = Math.max(0, m.index - 40);
      problems.push(`${relative(DIST, f)}: ${why} “${m[0]}” — …${text.slice(at, m.index + 50).trim()}…`);
    }
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} reader-facing copy problem(s):\n`);
  for (const p of problems.slice(0, 40)) console.error(`  ${p}`);
  process.exit(1);
}
console.error(`✓ ${files.length} pages: no developer language or placeholder copy`);
