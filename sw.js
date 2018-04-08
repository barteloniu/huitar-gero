self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("huitar-gero").then(c => {
            return c.addAll([
                "/",
                //"/huitar-gero",
                "lib/three.min.js",
                "lib/OrbitControls.js",
                "lib/hammer.min.js",
                "index.html",
                "index.css",
                "index.js",
                "path.js"
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