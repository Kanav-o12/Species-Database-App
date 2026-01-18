/* service-worker.js */
const CACHE_NAME = "species-app-v1";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./home.html",
  "./specie.html",
  "./tetum.html",
  "./tutorial.html",
  "./video.html",
  "./login.html",
  "./language.html",
  "./imagepreview.html",

  "./manifest.json",

  "./css/login.css",
  "./css/language.css",
  "./css/responsive.css",

  "./scripts/specieslist.js",
  "./scripts/filterCarousel.js",
  "./scripts/sw-register.js",
  "./scripts/sw-register.js",
  "./scripts/imageCache.js",
  "./scripts/preloadImages.js",
  "./scripts/config.js",
  "./scripts/db.js",
  "./scripts/bundleSync.js",
  "./scripts/sw-register.js",

  // /icons
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        CORE_ASSETS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: "no-cache" });
            if (res.ok) await cache.put(url, res);
          } catch (_) {}
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  
  if (url.origin !== location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const cached = await cache.match(req);
      if (cached) return cached;

    
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok && req.method === "GET") {
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (e) {
        // 3) Offline fallback:
      
        if (req.mode === "navigate") {
          return (await cache.match("./home.html")) || (await cache.match("./index.html"));
        }
       
        if (req.destination === "image") {
          return new Response("", { status: 204 });
        }
        return new Response("Offline", { status: 503 });
      }
    })()
  );
});
