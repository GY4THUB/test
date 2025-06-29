const CACHE_NAME = "my-app-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/page2.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  // Add more if needed, like /style.css, /script.js
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).catch(err => {
      console.error("Caching error:", err);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => caches.match("/index.html")) // fallback if offline
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});
