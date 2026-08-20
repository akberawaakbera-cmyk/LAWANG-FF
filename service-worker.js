const CACHE_NAME = "lawangen-injector-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./assets/logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  // API requests ہمیشہ network سے جائیں
  // تاکہ Key اور Database کا live status ملے۔
  if (
    new URL(request.url).pathname.startsWith("/api/")
  ) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({
            success: false,
            error: "Network unavailable"
          }),
          {
            status: 503,
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
      )
    );

    return;
  }

  // باقی application files کے لیے
  // network-first strategy
  event.respondWith(
    fetch(request)
      .then(response => {

        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(request, copy);
            });
        }

        return response;
      })
      .catch(() =>
        caches.match(request)
      )
  );
});