/**
 * Writes dist/sitemap.xml after the site is built: every page, so search
 * engines can find each duʿāʾ, not only the home page.
 *
 * Saved (bookmarks) is left out — it is empty until a reader saves something
 * on their own device — and so is the 404 page.
 */

import { readdir, writeFile } from "node:fs/promises";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");
const SITE = "https://candanumut.github.io/dua";
const SKIP = new Set(["/bookmarks/"]);

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const pages = (await walk(DIST))
  .map((f) => "/" + relative(DIST, f).split("\\").join("/"))
  .filter((u) => u.endsWith("/index.html"))
  .map((u) => u.slice(0, -"index.html".length))
  .filter((u) => !SKIP.has(u))
  .sort();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join("\n")}
</urlset>
`;

await writeFile(resolve(DIST, "sitemap.xml"), xml);
console.log(`✓ sitemap.xml lists ${pages.length} pages`);
