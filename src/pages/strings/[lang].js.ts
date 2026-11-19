/**
 * The interface strings the browser needs, one small cached file per
 * language, instead of the same dictionary inlined into every page.
 */
import { LANGS, clientStrings, type Lang } from "../../lib/i18n";

export function getStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

export function GET({ params }: { params: { lang: Lang } }) {
  return new Response(`window.DUA_S=${JSON.stringify(clientStrings(params.lang))};`, {
    headers: { "Content-Type": "text/javascript" },
  });
}
