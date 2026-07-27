/*
 * Offline support. The content is static, small, and never changes between
 * deploys, so the strategy is simply: serve from cache, refresh in background.
 *
 * There is no good reason a reference this size should stop working on a
 * plane, in a hospital, or anywhere else someone is likely to need it.
 */
const VERSION = "dua-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(["/dua/", "/dua/themes/", "/dua/prophets/"])).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET" || new URL(request.url).origin !== location.origin) return;

  e.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => hit || caches.match("/dua/"));
      return hit || network;
    }),
  );
});
