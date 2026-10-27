// Offline support: the app itself is fetched fresh when online (so updates
// show up right away) and served from cache when offline. Posters and covers
// are cached after the first view.
const APP = 'shelf-app-v3';
const IMG = 'shelf-img-v1';
const SHELL = ['./', 'index.html', 'styles.css', 'config.js', 'js/app.js', 'js/store.js', 'js/api.js', 'js/sync.js', 'js/ui.js', 'js/views.js', 'js/detail.js', 'js/add.js', 'js/settings.js', 'js/samples.js', 'manifest.webmanifest', 'icons/icon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(APP).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => ![APP, IMG].includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(APP).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req, { ignoreSearch: true })),
    );
    return;
  }

  if (/image\.tmdb\.org|covers\.openlibrary\.org|books\.google/.test(url.hostname)) {
    e.respondWith(
      caches.open(IMG).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok || res.type === 'opaque') c.put(req, res.clone());
        return res;
      }),
    );
  }
});
