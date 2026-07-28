/**
 * Fetches the attributed (non-Qurʾānic) passages from the World English Bible,
 * which is public domain, and hash-locks them exactly as the Arabic is.
 *
 * The rule is the same everywhere in this repository: scripture is fetched and
 * checksummed, never written from memory.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { ATTRIBUTED_SEEDS } from "../content/attributed.js";
import { sha256 } from "./fetch-content.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function get(url: string): Promise<any> {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      if (i === 3) throw e;
      await new Promise((s) => setTimeout(s, 2 ** i * 1000));
    }
  }
}

const out = [];
for (const seed of ATTRIBUTED_SEEDS) {
  const j = await get(`https://bible-api.com/${seed.query}?translation=web`);
  const text = String(j.text).replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim();
  out.push({
    id: seed.id,
    text,
    sha256: sha256(text),
    reference: j.reference,
    translation: j.translation_name,
    translationId: j.translation_id,
  });
  console.error(`  ${seed.id.padEnd(34)} ${j.reference}`);
}

await mkdir(resolve(ROOT, "content/generated"), { recursive: true });
await writeFile(
  resolve(ROOT, "content/generated/attributed.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.error(`\n✓ ${out.length} attributed passage(s) → content/generated/attributed.json`);
