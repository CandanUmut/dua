/**
 * The site's ornament as CSS variables, generated from src/lib/geometry.ts at
 * build time: one small cached file instead of drawings repeated per page.
 */
import { band, lattice, starMask, strip } from "../lib/geometry";

const LIGHT = { lattice: lattice("rgba(126,95,40,0.075)"), band: band("#8a6a2f", "#f4f2ec"), strip: strip("#c9ad73", "#1d3150") };
const DARK = { lattice: lattice("rgba(196,167,108,0.05)"), band: band("#b89a5e", "#1f221f"), strip: strip("#b89a5e", "#0d1626") };
const vars = (o: typeof LIGHT) => `--lattice:${o.lattice};--band:${o.band};--strip:${o.strip};--star:${starMask};`;

export function GET() {
  const css =
    `:root{${vars(LIGHT)}}\n` +
    `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${vars(DARK)}}}\n` +
    `:root[data-theme="dark"]{${vars(DARK)}}\n`;
  return new Response(css, { headers: { "Content-Type": "text/css" } });
}
