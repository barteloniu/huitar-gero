self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("huitar-gero").then(c => {
            return c.addAll([
                "/huitar-gero",
                "/huitar-gero/lib/three.min.js",
                "/huitar-gero/lib/OrbitControls.js",
                "/huitar-gero/lib/hammer.min.js",
                "/huitar-gero/index.html",
                "/huitar-gero/index.css",
                "/huitar-gero/index.js",
                "/huitar-gero/path.js"
            ])
        })
    )
})

self.addEventListener("fetch", e => {
    console.log(e.request.url)
    e.respondWith(caches.match(e.request).then(res => {
        return res || fetch(e.request)
    }))
})