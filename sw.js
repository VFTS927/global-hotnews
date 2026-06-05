const CACHE = "hotnews-v2";
const URLS = ["/", "/manifest.json", "/api/news"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(URLS)));
});

self.addEventListener("fetch", (e) => {
  // API: network first, fallback to cache
  if (e.request.url.includes("/api/")) {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const clone = r.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Static: cache first
    e.respondWith(
      caches.match(e.request).then((r) => r || fetch(e.request))
    );
  }
});
