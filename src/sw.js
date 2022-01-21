self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll(["./", "./index.html"]);
    })
  );
});

self.addEventListener("fetch", (evt) => {
  console.log({ req: evt.request });

  evt.respondWith(
    caches
      .open("static")
      .then((cache) => {
        return fetch(evt.request).then((response) => {
          cache.put(evt.request, response.clone());
          return response;
        });
      })
      .catch((err) => caches.match(evt.request).then((response) => response))
  );
});
