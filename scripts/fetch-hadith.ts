/**
 * Resolves every ḥadīth seed in `content/hadith.ts` into Arabic from the
 * hadith-api dataset and writes:
 *
 *   content/generated/hadith.json   the derived supplication text, per entry
 *   hadith.lock.json                a SHA-256 per entry
 *
 *   npx tsx scripts/fetch-hadith.ts           fetch and write
 *   npx tsx scripts/fetch-hadith.ts --verify  re-derive and compare; CI runs this
 *
 * Checks that fail the run, each of which caught a real error in the old
 * hand-typed corpus or the dataset:
 *   - the record's standard number must equal the number the seed cites;
 *   - the text must not contain U+FFFD (the dataset's copy of Bukhārī 834
 *     does, mid-word);
 *   - for the Sunan, al-Albānī's grade must be ṣaḥīḥ or ḥasan.
 */

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { HADITH_SEEDS, type HadithSeed } from "../content/hadith.js";
import { BOOKS, HADITH_SOURCE, fetchHadith, slice, tokenise } from "./hadith-api.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

export type ResolvedHadith = {
  id: string;
  book: string;
  collection: string;
  collectionTr: string;
  number: string;
  url: string;
  text: string;
  sha256: string;
  grading: string;
  gradedBy: string;
  /** All gradings the dataset records, for the source notes. */
  grades: { name: string; grade: string }[];
};

const GRADE: Record<string, string> = {
  sahih: "ṣaḥīḥ",
  hasan: "ḥasan",
  "hasan sahih": "ḥasan ṣaḥīḥ",
};

async function resolveOne(seed: HadithSeed): Promise<ResolvedHadith> {
  const { book, datasetNumber, number, variant } = seed.ref;
  const rec = await fetchHadith(book, datasetNumber);

  const standard = Math.floor(rec.arabicnumber);
  if (standard !== number) {
    throw new Error(
      `${seed.id}: dataset record ${book}:${datasetNumber} is standard no. ${rec.arabicnumber}, ` +
        `but the seed cites ${number}.`,
    );
  }
  const words = tokenise(rec.text);
  const { fromWord, toWord } = seed.excerpt;
  if (fromWord >= toWord || toWord > words.length) {
    throw new Error(`${seed.id}: excerpt [${fromWord}, ${toWord}) out of range (${words.length} words)`);
  }
  const text = slice(words, fromWord, toWord);
  if (text.includes("�")) {
    throw new Error(`${seed.id}: the source text contains a corrupted character (U+FFFD)`);
  }

  let grading = "ṣaḥīḥ";
  let gradedBy = book === "bukhari" ? "al-Bukhārī" : "Muslim";
  if (book !== "bukhari" && book !== "muslim") {
    const albani = rec.grades.find((g) => g.name === "Al-Albani");
    const g = albani && GRADE[albani.grade.trim().toLowerCase()];
    if (!g) {
      throw new Error(`${seed.id}: al-Albānī's grade is "${albani?.grade ?? "missing"}" — not ṣaḥīḥ or ḥasan`);
    }
    grading = g;
    gradedBy = "al-Albānī";
  }

  const letter = variant ? String.fromCharCode(96 + variant) : "";
  const b = BOOKS[book];
  return {
    id: seed.id,
    book,
    collection: b.en,
    collectionTr: b.tr,
    number: String(number),
    url: `https://sunnah.com/${b.sunnah}:${number}${letter}`,
    text,
    sha256: sha256(text),
    grading,
    gradedBy,
    grades: rec.grades,
  };
}

export async function resolveAllHadith(): Promise<ResolvedHadith[]> {
  const out: ResolvedHadith[] = [];
  for (const seed of HADITH_SEEDS) {
    process.stderr.write(`  ${seed.id.padEnd(56)} ${seed.ref.book}:${seed.ref.number}\n`);
    out.push(await resolveOne(seed));
  }
  return out;
}

const LOCK = resolve(ROOT, "hadith.lock.json");

async function main() {
  const verify = process.argv.includes("--verify");
  console.error(`${verify ? "Verifying" : "Fetching"} ${HADITH_SEEDS.length} ḥadīth from ${HADITH_SOURCE}…\n`);
  const resolved = await resolveAllHadith();

  if (verify) {
    const lock = JSON.parse(await readFile(LOCK, "utf8"));
    const problems: string[] = [];
    for (const r of resolved) {
      const e = lock.entries[r.id];
      if (!e) problems.push(`NEW      ${r.id} — run scripts/fetch-hadith.ts`);
      else if (e.sha256 !== r.sha256) problems.push(`MISMATCH ${r.id} (${r.book}:${r.number})`);
    }
    for (const id of Object.keys(lock.entries)) {
      if (!resolved.some((r) => r.id === id)) problems.push(`REMOVED  ${id}`);
    }
    if (problems.length) {
      console.error(`\n✗ ${problems.length} problem(s):\n`);
      for (const p of problems) console.error(`  ${p}`);
      process.exit(1);
    }
    console.error(`\n✓ all ${resolved.length} ḥadīth match hadith.lock.json`);
    return;
  }

  await writeFile(
    resolve(ROOT, "content/generated/hadith.json"),
    JSON.stringify(resolved, null, 2) + "\n",
  );
  await writeFile(
    LOCK,
    JSON.stringify(
      {
        source: HADITH_SOURCE,
        note:
          "SHA-256 of each ḥadīth supplication as sliced from the dataset. Regenerate with " +
          "`npx tsx scripts/fetch-hadith.ts`. Never edit Arabic by hand.",
        entries: Object.fromEntries(
          resolved.map((r) => [r.id, { ref: `${r.book}:${r.number}`, sha256: r.sha256 }]),
        ),
      },
      null,
      2,
    ) + "\n",
  );
  console.error(`\n✓ ${resolved.length} ḥadīth resolved`);
  console.error(`✓ content/generated/hadith.json`);
  console.error(`✓ hadith.lock.json`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
