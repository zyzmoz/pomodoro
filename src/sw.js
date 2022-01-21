self.addEventListener("install", evt => {
  evt.waitUntil(
    caches.open("static").then(cache => {
      return cache.addAll(["./", "./*.png", "./*.css", "./*.js"])
    })
  )
})

self.addEventListener("fetch", evt => {
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
    )
})