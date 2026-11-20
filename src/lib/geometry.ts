/**
 * The site's ornament, drawn from first principles rather than clip-art.
 *
 * Everything decorative on the site is one of three constructions from the
 * Islamic geometric tradition, generated here as SVG:
 *
 *  - the star polygon {n/k} — n points on a circle, each joined to the k-th
 *    next. {8/3} is the eight-pointed star of the rubʿ al-ḥizb; {12/5} the
 *    twelve-fold rosette at the centre of so many domes;
 *  - the khatam lattice — eight-pointed stars on a square grid, the commonest
 *    field pattern of tilework and illumination;
 *  - the band — a chain of small stars between two rules, the border of a
 *    muṣḥaf page (tezhip), used here as a CSS border-image.
 *
 * Colours are passed in, so the same drawing serves light and dark.
 */

const f = (n: number) => +n.toFixed(2);

/** Points of the star polygon {n/k}, as an SVG path. */
export function starPath(n: number, k: number, r: number, cx = 0, cy = 0, rot = -Math.PI / 2): string {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = rot + (i * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  // Walk i → i+k → i+2k … ; when n and k share a factor this makes several
  // closed loops ({8/2} is two squares), so draw each one.
  const seen = new Set<number>();
  let d = "";
  for (let s = 0; s < n; s++) {
    if (seen.has(s)) continue;
    let i = s;
    d += `M${f(pts[i][0])} ${f(pts[i][1])}`;
    do {
      seen.add(i);
      i = (i + k) % n;
      d += `L${f(pts[i][0])} ${f(pts[i][1])}`;
    } while (i !== s);
    d += "Z";
  }
  return d;
}

/** A rosette: a star polygon inside a circle, with an inner circle. */
export function rosette(n: number, k: number, size: number, stroke: string, fill = "none", sw = 1): string {
  const c = size / 2;
  const r = c - sw;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">` +
    `<g fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round">` +
    `<circle cx="${c}" cy="${c}" r="${f(r)}"/>` +
    `<path d="${starPath(n, k, r * 0.92, c, c)}"/>` +
    `<circle cx="${c}" cy="${c}" r="${f(r * 0.3)}"/>` +
    `</g></svg>`;
}

const uri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/**
 * The khatam field: an {8/3} star at every lattice point and at each cell's
 * centre. Neighbouring stars nearly touch, which is what makes the eye read
 * the octagons and crosses between them.
 */
export function lattice(color: string, size = 72): string {
  const h = size / 2;
  const r = size * 0.3;
  const stars = [[0, 0], [size, 0], [0, size], [size, size], [h, h]]
    .map(([x, y]) => starPath(8, 3, r, x, y, -Math.PI / 2 + Math.PI / 8))
    .join("");
  return uri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<path d="${stars}" fill="none" stroke="${color}" stroke-width="1"/></svg>`,
  );
}

/**
 * The tezhip band, as a 30×30 border-image: 10px corners carrying a rosette,
 * and 10px edges carrying one small star on a rule, repeated with `round`.
 * The centre is empty, so it frames without filling.
 */
export function band(ink: string, ground: string): string {
  const star = (x: number, y: number) => starPath(8, 3, 4.2, x, y, -Math.PI / 2 + Math.PI / 8);
  const corner = (x: number, y: number) =>
    `<circle cx="${x}" cy="${y}" r="4.3" fill="${ground}" stroke="${ink}" stroke-width=".8"/>` +
    `<path d="${starPath(8, 2, 3.4, x, y)}" fill="none" stroke="${ink}" stroke-width=".7"/>`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">` +
    `<g fill="none" stroke="${ink}" stroke-width=".8">` +
    // the two rules of each edge, inner and outer
    `<path d="M10 .5H20M10 9.5H20M10 20.5H20M10 29.5H20M.5 10V20M9.5 10V20M20.5 10V20M29.5 10V20"/>` +
    `<path d="M0 5H10M20 5H30M0 25H10M20 25H30M5 0V10M5 20V30M25 0V10M25 20V30" stroke-width=".5"/>` +
    `</g>` +
    `<g fill="${ground}" stroke="${ink}" stroke-width=".8">` +
    `<path d="${star(15, 5)}"/><path d="${star(15, 25)}"/><path d="${star(5, 15)}"/><path d="${star(25, 15)}"/>` +
    `</g>` +
    `<path d="M10 5H11M19 5H20M10 25H11M19 25H20M5 10V11M5 19V20M25 10V11M25 19V20" stroke="${ink}" stroke-width=".5"/>` +
    corner(5, 5) + corner(25, 5) + corner(5, 25) + corner(25, 25) +
    `</svg>`;
  return uri(svg);
}

/** A thin horizontal strip of the band, for the masthead and tab bar edges. */
export function strip(ink: string, ground: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="10" viewBox="0 0 24 10">` +
    `<rect width="24" height="10" fill="${ground}"/>` +
    `<path d="M0 .5H24M0 9.5H24" stroke="${ink}" stroke-width=".8"/>` +
    `<path d="M0 5H24" stroke="${ink}" stroke-width=".5"/>` +
    `<path d="${starPath(8, 3, 3.8, 12, 5, -Math.PI / 2 + Math.PI / 8)}" fill="${ground}" stroke="${ink}" stroke-width=".8"/>` +
    `</svg>`;
  return uri(svg);
}

/** A mask image of a solid eight-pointed star, for small bullets. */
export const starMask = uri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 20 20"><path d="${starPath(8, 3, 9.5, 0, 0, -Math.PI / 2 + Math.PI / 8)}" fill="#000" fill-rule="nonzero"/></svg>`,
);

/**
 * A medallion per theme: its own star polygon, so the sixteen situations are
 * sixteen distinct figures rather than sixteen identical bullets.
 */
const MEDALLIONS: [number, number][] = [
  [5, 2], [6, 2], [7, 2], [7, 3], [8, 3], [8, 2], [9, 2], [9, 4],
  [10, 3], [10, 4], [12, 5], [12, 4], [11, 4], [11, 3], [16, 7], [12, 3],
];
export const themeStar = (order: number) => MEDALLIONS[(order - 1 + MEDALLIONS.length) % MEDALLIONS.length];
