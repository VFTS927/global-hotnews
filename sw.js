const CACHE = "hotnews-v2";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", (e) => {
  // Cache hotnews.json for offline
  if (e.request.url.includes("hotnews.json")) {
    e.respondWith(
      caches.open(CACHE).then((cache) =>
        fetch(e.request)
          .then((r) => {
            cache.put(e.request, r.clone());
            return r;
          })
          .catch(() => cache.match(e.request))
      )
    );
  }
});
