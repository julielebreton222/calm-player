/* My Calm Player — offline support.
 * The app's own files are cached so it opens with no internet.
 * Your files in "My files" live in the browser's IndexedDB, not here.
 * YouTube videos still need a connection. */
const CACHE = "my-hangout-v20261103d";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./sw.js", "./hangout.js", "./sync.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// The page sends the exact CSS/JS addresses it loaded, so they're kept for offline use.
self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "cache" && Array.isArray(e.data.urls)) {
    caches.open(CACHE).then((c) => Promise.all(e.data.urls.map((u) => c.add(u).catch(() => {}))));
  }
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !isFont) return; // YouTube & thumbnails: always live

  if (isFont) {
    // Fonts: use the saved copy, refresh it in the background.
    e.respondWith(caches.open(CACHE).then((c) => c.match(req).then((hit) => {
      const net = fetch(req).then((res) => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }
  // App files: newest from the network when online, saved copy when offline.
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: req.mode === "navigate" }).then((hit) => hit || caches.match("./index.html")))
  );
});
