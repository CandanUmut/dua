/**
 * The minimal record of every duʿāʾ, for the parts of the site that render in
 * the browser: Today, the reader, lists, sharing. One file, cached offline.
 */
import { cards } from "../lib/content";

export function GET() {
  return new Response(JSON.stringify(cards()), { headers: { "Content-Type": "application/json" } });
}
