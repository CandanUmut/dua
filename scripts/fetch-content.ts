/**
 * Resolves every duʿāʾ reference in `content/duas.ts` into Arabic text from an
 * authenticated source, and writes:
 *
 *   content/generated/arabic.json   the derived text, per duʿāʾ
 *   content.lock.json               a SHA-256 per entry
 *
 * Run `npm run content:fetch` to (re)generate. `npm run content:verify`
 * re-derives and compares against the lock without writing, and is what CI
 * runs: if anyone edits Arabic by hand, the hashes diverge and the build fails.
 *
 * The excerpt slice happens here rather than in the data because a word range
 * is only meaningful against a specific edition's tokenisation. Committing the
 * *resolved* text alongside the range means a future edition change is caught
 * as a hash mismatch rather than silently re-cutting every excerpt somewhere
 * slightly different.
 */

import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { DUA_SEEDS, type DuaSeed } from "../content/duas.js";
import {
  ARABIC_EDITION,
  EN_EDITIONS,
  fetchAyat,
  formatRef,
} from "./quran-api.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

export type ResolvedDua = {
  id: string;
  ref: string;
  edition: string;
  script: "uthmani";
  text: string;
  sha256: string;
  wordCount: number;
  isExcerpt: boolean;
  excerptNote?: string;
  /** Full āyah text, so the UI can offer "show the whole āyah". */
  fullText: string;
  surahName: string;
  surahNameEn: string;
  translations: Record<string, string>;
};

export const sha256 = (s: string): string =>
  createHash("sha256").update(s, "utf8").digest("hex");

export async function resolveDua(seed: DuaSeed): Promise<ResolvedDua> {
  const { joined, surahName, surahNameEn } = await fetchAyat(seed.ayat, ARABIC_EDITION);
  const words = joined.split(" ");

  let text = joined;
  if (seed.excerpt) {
    const { fromWord, toWord } = seed.excerpt;
    if (fromWord >= toWord || toWord > words.length) {
      throw new Error(
        `${seed.id}: excerpt [${fromWord}, ${toWord}) is out of range for ` +
          `${formatRef(seed.ayat)} which has ${words.length} words. ` +
          `Re-check with: npx tsx scripts/inspect-ayah.ts ${formatRef(seed.ayat)}`,
      );
    }
    text = words.slice(fromWord, toWord).join(" ");
  }

  const translations: Record<string, string> = {};
  for (const ed of EN_EDITIONS) {
    const { joined: t } = await fetchAyat(seed.ayat, ed);
    translations[ed] = t;
  }

  return {
    id: seed.id,
    ref: formatRef(seed.ayat),
    edition: ARABIC_EDITION,
    script: "uthmani",
    text,
    sha256: sha256(text),
    wordCount: text.split(" ").length,
    isExcerpt: Boolean(seed.excerpt),
    excerptNote: seed.excerpt?.note,
    fullText: joined,
    surahName,
    surahNameEn,
    translations,
  };
}

export async function resolveAll(): Promise<ResolvedDua[]> {
  const out: ResolvedDua[] = [];
  for (const seed of DUA_SEEDS) {
    process.stderr.write(`  ${seed.id.padEnd(46)} ${formatRef(seed.ayat)}\n`);
    out.push(await resolveDua(seed));
  }
  return out;
}

async function main() {
  console.error(`Fetching ${DUA_SEEDS.length} duʿāʾ from edition "${ARABIC_EDITION}"…\n`);
  const resolved = await resolveAll();

  await mkdir(resolve(ROOT, "content/generated"), { recursive: true });
  await writeFile(
    resolve(ROOT, "content/generated/arabic.json"),
    JSON.stringify(resolved, null, 2) + "\n",
  );

  const lock = {
    source: "https://api.alquran.cloud/v1",
    script: "uthmani" as const,
    edition: ARABIC_EDITION,
    generatedAt: new Date().toISOString(),
    note:
      "SHA-256 of the resolved Arabic per duʿāʾ. Regenerate with `npm run content:fetch`. " +
      "Never edit Arabic by hand — `npm run content:verify` will fail.",
    entries: Object.fromEntries(
      resolved.map((r) => [
        r.id,
        { ref: r.ref, edition: r.edition, sha256: r.sha256, words: r.wordCount, excerpt: r.isExcerpt },
      ]),
    ),
  };
  await writeFile(resolve(ROOT, "content.lock.json"), JSON.stringify(lock, null, 2) + "\n");

  const excerpts = resolved.filter((r) => r.isExcerpt).length;
  console.error(
    `\n✓ ${resolved.length} duʿāʾ resolved (${excerpts} excerpts, ${resolved.length - excerpts} whole passages)`,
  );
  console.error(`✓ content/generated/arabic.json`);
  console.error(`✓ content.lock.json`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
