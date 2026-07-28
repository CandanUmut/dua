/**
 * Fetches English tafsīr for every Qurʾānic entry, so the occasion is carried
 * by a named classical source rather than by an uncited paraphrase.
 *
 * **Tafsīr al-Jalālayn** (al-Maḥallī d. 1459, al-Suyūṭī d. 1505) — a concise
 * word-level gloss covering every āyah. One work, and only one.
 *
 * ## Why Asbāb al-Nuzūl is not here
 *
 * It was, briefly. Al-Wāḥidī's occasions of revelation are exactly what the
 * `context` layer wants, and the aggregator exposes a slug for it. But the text
 * that slug returns is byte-identical to what `en-al-qushairi-tafsir` returns,
 * and near-identical to `en-kashf-al-asrar-tafsir` — and reads in an
 * unmistakably Sufi register ("Abraham asked two things from the Real") that is
 * nothing like al-Wāḥidī. At least two of those three labels are wrong, and
 * there is no way to tell from here which one is right.
 *
 * Shipping it would have attributed Sufi commentary to al-Wāḥidī on thirteen
 * pages — the same class of error as the mis-cited āyah the Phase 1 audit
 * found, and just as invisible, because the prose is perfectly good prose. So
 * it is dropped rather than guessed at. `assertDistinct` below now fails the
 * fetch if any two sources ever return the same text again.
 *
 * **On licensing.** The Arabic original is centuries out of copyright. The
 * English translation, by Feras Hamza, was produced for the Royal Aal al-Bayt
 * Institute for Islamic Thought and published freely at altafsir.com. That is
 * *not* a clean public-domain dedication and not an SPDX licence — it is a
 * permission to distribute that the wider ecosystem (quran.com among others)
 * relies on. It is attributed in full on every page that shows it. If that
 * permission is ever a problem for this project, deleting this one file and the
 * `tafsir` field removes it cleanly.
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { DUA_SEEDS } from "../content/duas.js";
import { formatRef } from "./quran-api.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = resolve(ROOT, "scripts/.cache/tafsir.json");
const CDN = "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir";

export const TAFSIRS = {
  jalalayn: {
    slug: "en-al-jalalayn",
    work: "Tafsīr al-Jalālayn",
    author: "al-Maḥallī and al-Suyūṭī",
    translator: "Feras Hamza",
    licence: "Royal Aal al-Bayt Institute — freely distributed, attribution required",
    url: "https://www.altafsir.com",
  },
} as const;

type Cache = Record<string, string>;
let cache: Cache = {};
try {
  cache = JSON.parse(await readFile(CACHE, "utf8")) as Cache;
} catch {
  cache = {};
}

async function fetchOne(slug: string, surah: number, ayah: number): Promise<string> {
  const key = `${slug}|${surah}:${ayah}`;
  if (key in cache) return cache[key];
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(`${CDN}/${slug}/${surah}/${ayah}.json`, {
        signal: AbortSignal.timeout(30_000),
      });
      if (r.status === 404) {
        cache[key] = "";
        return "";
      }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = (await r.json()) as { text?: string };
      cache[key] = clean(j.text ?? "");
      return cache[key];
    } catch (e) {
      if (i === 3) throw e;
      await new Promise((s) => setTimeout(s, 2 ** i * 1000));
    }
  }
  return "";
}

/** Strip the HTML the source embeds, and normalise whitespace. */
function clean(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Guards against the mislabelling described above: if two commentary slugs ever
 * return the same text for the same āyah, at least one of them is wrong about
 * whose work it is serving, and neither can be trusted.
 */
async function assertDistinct(surah: number, ayah: number): Promise<void> {
  const others = ["en-al-qushairi-tafsir", "en-kashf-al-asrar-tafsir", "en-tafsir-ibn-abbas"];
  const mine = await fetchOne(TAFSIRS.jalalayn.slug, surah, ayah);
  if (!mine) return;
  for (const slug of others) {
    const t = await fetchOne(slug, surah, ayah);
    if (t && t === mine) {
      throw new Error(
        `${surah}:${ayah}: "${TAFSIRS.jalalayn.slug}" returns text identical to "${slug}". ` +
          `One of these labels is wrong about whose commentary it is. Do not ship either.`,
      );
    }
  }
}

const out: Record<string, { jalalayn: string; ref: string }> = {};

for (const seed of DUA_SEEDS) {
  const { surah, ayah } = seed.ayat[0];
  const jalalayn = await fetchOne(TAFSIRS.jalalayn.slug, surah, ayah);
  out[seed.id] = { jalalayn, ref: formatRef(seed.ayat) };
  process.stderr.write(`  ${seed.id.padEnd(44)} ${String(jalalayn.length).padStart(5)} chars\n`);
}

// Spot-check distinctness on a sample rather than every āyah — the failure
// mode is a whole mislabelled corpus, not one stray verse.
for (const seed of DUA_SEEDS.slice(0, 8)) {
  await assertDistinct(seed.ayat[0].surah, seed.ayat[0].ayah);
}

await mkdir(dirname(CACHE), { recursive: true });
await writeFile(CACHE, JSON.stringify(cache));
await mkdir(resolve(ROOT, "content/generated"), { recursive: true });
await writeFile(
  resolve(ROOT, "content/generated/tafsir.json"),
  JSON.stringify({ sources: TAFSIRS, entries: out }, null, 2) + "\n",
);

const withJ = Object.values(out).filter((e) => e.jalalayn.length > 40).length;
console.error(`\n✓ al-Jalālayn for ${withJ}/${Object.keys(out).length} entries, distinctness checked`);
console.error(`✓ content/generated/tafsir.json`);
