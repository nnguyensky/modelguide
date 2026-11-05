// Offline support for Model Guide.
// Same-origin files: serve from cache at once, refresh the cache in the background
// (stale-while-revalidate), so new data shows up on the next visit.
// Bump VERSION when the list of core files changes.
const VERSION = 'mg-v2';
const CORE = ['./', 'index.html', 'styles.css', 'data.js', 'app.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'feed.xml'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !fonts) return;
  e.respondWith(caches.open(VERSION).then(async (cache) => {
    const hit = await cache.match(req, { ignoreSearch: sameOrigin });
    const fresh = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => hit);
    if (hit) { e.waitUntil(fresh); return hit; }
    return fresh;
  }));
});
