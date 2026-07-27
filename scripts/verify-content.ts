/**
 * CI guard: re-derives every duʿāʾ from the upstream edition and compares
 * against `content.lock.json`.
 *
 * This is the check that makes the whole content architecture load-bearing. The
 * Phase 1 audit found two entries whose Arabic had drifted from the āyah they
 * cited — one carrying a different verse entirely, one with words inserted at
 * an excerpt boundary — and both had survived review because they read
 * fluently and their citations looked right. No amount of care catches that.
 * A hash does.
 *
 * Exits non-zero on any mismatch, so `npm run content:verify` can gate merges.
 */

import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveAll } from "./fetch-content.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

type Lock = {
  edition: string;
  entries: Record<string, { ref: string; sha256: string; words: number; excerpt: boolean }>;
};

const lock: Lock = JSON.parse(await readFile(resolve(ROOT, "content.lock.json"), "utf8"));

console.error(`Verifying against content.lock.json (edition "${lock.edition}")…\n`);
const resolved = await resolveAll();

const problems: string[] = [];

for (const r of resolved) {
  const entry = lock.entries[r.id];
  if (!entry) {
    problems.push(`NEW      ${r.id} — not in lock file. Run \`npm run content:fetch\`.`);
    continue;
  }
  if (entry.sha256 !== r.sha256) {
    problems.push(
      `MISMATCH ${r.id} (${r.ref})\n` +
        `           locked  ${entry.sha256}\n` +
        `           derived ${r.sha256}\n` +
        `           The Arabic has changed. If this was intentional, re-run\n` +
        `           \`npm run content:fetch\` and review the diff carefully.`,
    );
  }
  if (entry.ref !== r.ref) {
    problems.push(`REF      ${r.id} — locked as ${entry.ref}, now ${r.ref}`);
  }
}

for (const id of Object.keys(lock.entries)) {
  if (!resolved.some((r) => r.id === id)) {
    problems.push(`REMOVED  ${id} — in lock file but no longer in content/duas.ts`);
  }
}

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  ${p}\n`);
  process.exit(1);
}

console.error(`\n✓ all ${resolved.length} entries match content.lock.json`);
