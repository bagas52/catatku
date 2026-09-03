/* CatatKu Service Worker
 * Cache aset statik aplikasi agar dapat dibuka offline & cepat.
 * HANYA men-cache aset aplikasi — TIDAK menyentuh localStorage (catatan/tema/pengaturan)
 * maupun IndexedDB (file audio MP3). Data user tetap tersimpan & aman.
 */
const CACHE_NAME = 'catatku-shell-v1';

const PRECACHE_URLS = [
  './',
  './index.html',
  './site.webmanifest',
  './logo.svg',
  './favicon.png',
  './favicon-192.png',
  './favicon-512.png',
  './favicon-180.png',
];

/* Install: pre-cache shell & aset awal */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* Activate: hapus cache versi lama, segera kendalikan halaman */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

/* Fetch: network-first untuk navigasi, cache-first untuk aset statik */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Abaikan metode non-GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Abaikan request cross-origin (mis. Google Fonts) — biarkan default browser
  if (url.origin !== self.location.origin) return;

  // Navigasi halaman: network-first dengan fallback ke cache, lalu shell offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() =>
          caches
            .match('./index.html')
            .then((cached) => cached || caches.match('./'))
        )
    );
    return;
  }

  // Aset statik (JS/CSS/ikon/logo): cache-first
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          // Hanya cache respons yang sukses & same-origin
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
