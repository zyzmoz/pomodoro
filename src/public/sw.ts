const serviceWorker = self as unknown as ServiceWorkerGlobalScope;

serviceWorker.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll(["./", "./index.html"]);
    })
  );
});

serviceWorker.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .open("static")
      .then((cache) => {
        return fetch(event.request).then((response) => {
          void cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() =>
        caches
          .match(event.request)
          .then((response) => response ?? Response.error())
      )
  );
});
