/**
 * Carries the existing editorial content out of `data/prayers.json` and into
 * the new structure, and reports anything that would be lost.
 *
 * The Turkish translations are the point of this script. It lifts all 47
 * verbatim, keyed by the new duʿāʾ id, and *fails loudly* about any legacy
 * entry that has no home in `content/duas.ts`. Losing one silently is the
 * failure mode this exists to prevent.
 *
 * Note what "preserved" means now. The Qurʾānic entries display Elmalılı Hamdi
 * Yazır, because it is published, attributed, public-domain work and — being
 * fetched per-āyah — always covers the same extent as the Arabic beside it. The
 * project's own Turkish is not shown on those pages, but it is not gone: it
 * lives here and in `data/prayers.json`, and this script still fails the build
 * if any of it goes missing from the repository. The five ḥadīth entries, which
 * have no edition to fetch, display it.
 *
 * The English is deliberately NOT migrated. Every legacy entry is marked
 * `"translation_note": "Paraphrase"` with no translator recorded, and unsourced
 * paraphrase cannot ship under brief §2.3. Public-domain Pickthall and Yusuf
 * Ali come from the same fetch pipeline as the Arabic, fully attributed.
 *
 * `context` and `reflection` come across, but marked `needs-review`: the
 * context needs a tafsīr citation attached before it can ship, and the
 * reflection needs to be re-rendered as clearly-attributed editorial voice
 * rather than sitting at the same visual weight as sourced material.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { DUA_SEEDS } from "../content/duas.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

type Legacy = {
  id: string;
  prophet: { ar: string; en: string; tr: string };
  source: { type: string; reference: string };
  arabic: string;
  transliteration: string;
  english: string;
  turkish: string;
  topics: string[];
  context: string;
  reflection: string;
  sources: string[];
};

const legacy: Legacy[] = JSON.parse(
  await readFile(resolve(ROOT, "data/prayers.json"), "utf8"),
);

const byLegacyId = new Map(legacy.map((l) => [l.id, l]));
const claimed = new Set<string>();

type Migrated = {
  id: string;
  legacyId: string;
  legacyRef: string;
  turkish: string;
  transliteration: string;
  context: string;
  reflection: string;
  topics: string[];
  status: "needs-review";
};

const migrated: Migrated[] = [];

for (const seed of DUA_SEEDS) {
  if (!seed.legacyId) continue;
  const l = byLegacyId.get(seed.legacyId);
  if (!l) {
    console.error(`✗ ${seed.id} references legacyId "${seed.legacyId}" which does not exist`);
    process.exitCode = 1;
    continue;
  }
  claimed.add(l.id);
  migrated.push({
    id: seed.id,
    legacyId: l.id,
    legacyRef: l.source.reference,
    turkish: l.turkish,
    transliteration: l.transliteration,
    context: l.context,
    reflection: l.reflection,
    topics: l.topics,
    status: "needs-review",
  });
}

const orphaned = legacy.filter((l) => !claimed.has(l.id));

await mkdir(resolve(ROOT, "content/generated"), { recursive: true });
await writeFile(
  resolve(ROOT, "content/generated/legacy-migration.json"),
  JSON.stringify(
    {
      note:
        "Editorial content lifted from data/prayers.json. Turkish is verbatim and must " +
        "not be regenerated. English paraphrases are deliberately excluded — see the " +
        "header of scripts/migrate-legacy.ts.",
      migrated,
      orphaned: orphaned.map((o) => ({
        legacyId: o.id,
        ref: o.source.reference,
        type: o.source.type,
        prophet: o.prophet.en,
        turkish: o.turkish,
        transliteration: o.transliteration,
        context: o.context,
        reflection: o.reflection,
      })),
    },
    null,
    2,
  ) + "\n",
);

console.error(`Legacy entries:      ${legacy.length}`);
console.error(`Migrated (mapped):   ${migrated.length}`);
console.error(`Not yet mapped:      ${orphaned.length}`);
if (orphaned.length > 0) {
  console.error(`\nThese legacy entries have no counterpart in content/duas.ts yet.`);
  console.error(`Their Turkish is preserved in content/generated/legacy-migration.json`);
  console.error(`and none of it is lost — but each needs a decision:\n`);
  for (const o of orphaned) {
    console.error(`  ${o.id.padEnd(26)} ${o.source.type.padEnd(7)} ${o.source.reference.padEnd(9)} ${o.prophet.en}`);
  }
}
