/**
 * Smoke test: every page, both languages, on a phone, in a real browser.
 *
 *   npm run build && npm run test:smoke
 *
 * Serves dist/ at /dua/ and checks, for every page in the sitemap plus the
 * private pages:
 *   - no script errors;
 *   - no horizontal scroll at 390px;
 *   - tap targets in the tab bar and action rows are at least 44px;
 *   - <html lang> matches the route;
 *   - a Turkish page shows no English interface text (English translations,
 *     quoted commentary and proper names excepted).
 * Then the features a daily reader relies on: save, lists, the reader and
 * memorisation, Today, the share image, backup.
 *
 * Plain Playwright, no test runner. Exits non-zero on any failure.
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".xml": "application/xml" };

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!path.startsWith("/dua/")) { res.writeHead(404); return res.end(); }
  let file = join(DIST, path.slice(4));
  try { if ((await stat(file)).isDirectory()) file = join(file, "index.html"); } catch {}
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(await readFile(join(DIST, "404.html")).catch(() => ""));
  }
});
await new Promise((r) => server.listen(0, r));
const ORIGIN = `http://127.0.0.1:${server.address().port}`;

const sitemap = await readFile(join(DIST, "sitemap.xml"), "utf8");
const pages = [...sitemap.matchAll(/<loc>https:\/\/candanumut\.github\.io(\/dua\/[^<]*)<\/loc>/g)].map((m) => m[1]);
pages.push("/dua/mine/", "/dua/tr/mine/", "/dua/read/?prophet=musa", "/dua/tr/read/?moment=sleep");

const failures = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);

// CHROMIUM_PATH lets a machine with a different pre-installed browser run it.
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ ...devices["iPhone 13"], serviceWorkers: "block" });
const page = await ctx.newPage();
let errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
page.on("dialog", (d) => d.accept("Morning"));

for (const p of pages) {
  errors = [];
  const res = await page.goto(ORIGIN + p, { waitUntil: "load" });
  if (!res || res.status() !== 200) { fail(p, `HTTP ${res && res.status()}`); continue; }
  await page.waitForTimeout(60);
  const r = await page.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const small = [...document.querySelectorAll(".tabs a, .actions .btn, .icon-btn, .chip")]
      .filter((el) => el.offsetParent !== null)
      .map((el) => ({ el, h: el.getBoundingClientRect().height }))
      .filter((x) => x.h > 0 && x.h < 43.5)
      .map((x) => `${x.el.className}:${Math.round(x.h)}`);
    let english = 0, sample = "";
    if (document.documentElement.lang === "tr") {
      const clone = document.body.cloneNode(true);
      clone.querySelectorAll('[lang="en"], [lang="ar"], [data-lang="en"], script, style, .tafsir, .translit, details').forEach((e) => e.remove());
      const text = clone.innerText;
      const hits = text.match(/\b(the|and|with|when|your|you|this|from|Save|Share|Listen|Read|Search)\b/g) || [];
      english = hits.length;
      sample = hits.slice(0, 6).join(",");
    }
    return { W, sw: document.documentElement.scrollWidth, lang: document.documentElement.lang, small, english, sample };
  });
  if (errors.length) fail(p, `script error: ${errors[0]}`);
  if (r.sw > r.W + 1) fail(p, `horizontal scroll (${r.sw} > ${r.W})`);
  if (r.small.length) fail(p, `tap targets under 44px: ${r.small.slice(0, 3).join(" ")}`);
  const wantLang = p.startsWith("/dua/tr/") ? "tr" : "en";
  if (r.lang !== wantLang) fail(p, `<html lang="${r.lang}">, expected ${wantLang}`);
  if (r.english > 2) fail(p, `English on a Turkish page (${r.english}: ${r.sample})`);
}

/* ------------------------------ features ------------------------------ */

async function step(name, fn) {
  errors = [];
  try { await fn(); } catch (e) { fail(`feature: ${name}`, e.message.split("\n")[0]); }
  if (errors.length) fail(`feature: ${name}`, `script error: ${errors[0]}`);
}

const DUA = "/dua/duas/yunus-la-ilaha-illa-anta/";

await step("save", async () => {
  await page.goto(ORIGIN + DUA);
  await page.click("[data-act=save]");
  if ((await page.getAttribute("[data-act=save]", "aria-pressed")) !== "true") throw new Error("not pressed after save");
  await page.goto(ORIGIN + "/dua/mine/");
  await page.waitForSelector(".list-box li a");
  if (!(await page.textContent(".list-box")).includes("The call from the depths")) throw new Error("saved entry not on Mine");
});

await step("lists", async () => {
  await page.goto(ORIGIN + DUA);
  await page.click("[data-act=list]");
  await page.click("[data-new-list]"); // dialog handler answers "Morning"
  const lists = await page.evaluate(() => JSON.parse(localStorage.getItem("dua.lists") || "[]"));
  if (!lists.length || lists[0].name !== "Morning" || !lists[0].items.includes("yunus-la-ilaha-illa-anta")) throw new Error("list not created with item");
});

await step("today", async () => {
  await page.goto(ORIGIN + "/dua/?lang=en");
  await page.waitForFunction(() => document.querySelector("[data-today-date]").textContent.trim().length > 3);
  const ar = await page.textContent('[data-today] [data-f="ar"]');
  if (!ar || ar.length < 3) throw new Error("no Arabic in today card");
  if (!(await page.isVisible("[data-continue]"))) throw new Error("continue-reading missing after visiting a duʿāʾ");
});

await step("reader + memorise", async () => {
  await page.goto(ORIGIN + "/dua/read/?prophet=musa");
  await page.waitForSelector('[data-f="ar"] .w');
  const pos1 = await page.textContent("[data-pos]");
  await page.click("[data-next]");
  const pos2 = await page.textContent("[data-pos]");
  if (pos1 === pos2) throw new Error("next did not advance");
  await page.click("[data-memo]");
  const hidden = await page.$$eval(".w.hidden", (x) => x.length);
  if (!hidden) throw new Error("memorise did not hide words");
  await page.click(".w.hidden");
  const after = await page.$$eval(".w.hidden", (x) => x.length);
  if (after !== hidden - 1) throw new Error("tapping did not reveal a word");
});

await step("share image", async () => {
  await page.goto(ORIGIN + DUA);
  const size = await page.evaluate(async () => {
    const { byId } = await window.DuaApp.cards();
    const blob = await window.DuaApp.makeImage(byId.get("muhammad-istikhara"));
    return blob ? blob.size : 0;
  });
  if (size < 20000) throw new Error(`image too small (${size} bytes)`);
});

await step("backup round trip", async () => {
  await page.goto(ORIGIN + "/dua/mine/");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-mine-export]")]);
  const file = await dl.path();
  const data = JSON.parse(await readFile(file, "utf8"));
  if (!data.saved.includes("yunus-la-ilaha-illa-anta")) throw new Error("backup missing saved entry");
  await page.evaluate(() => { localStorage.removeItem("dua.bookmarks"); localStorage.removeItem("dua.lists"); });
  await page.setInputFiles("[data-mine-import]", file);
  await page.waitForTimeout(200);
  const back = await page.evaluate(() => JSON.parse(localStorage.getItem("dua.bookmarks") || "[]"));
  if (!back.includes("yunus-la-ilaha-illa-anta")) throw new Error("restore did not bring the entry back");
});

await step("calendar reminder", async () => {
  await page.goto(ORIGIN + "/dua/tr/mine/");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("[data-mine-ics]")]);
  const ics = await readFile(await dl.path(), "utf8");
  if (!/RRULE:FREQ=DAILY/.test(ics) || !/SUMMARY:Günün duası/.test(ics)) throw new Error("ics missing daily rule or Turkish title");
});

await browser.close();
server.close();

if (failures.length) {
  console.error(`✗ ${failures.length} failure(s) across ${pages.length} pages:\n`);
  for (const f of failures.slice(0, 60)) console.error(`  ${f}`);
  process.exit(1);
}
console.error(`✓ ${pages.length} pages and 7 features pass on a phone viewport`);
