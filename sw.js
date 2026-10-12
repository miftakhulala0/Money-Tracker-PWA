const CACHE = 'money-tracker';
const ASSETS = ['./', './manifest.json', './favicon.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith('http')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.status === 200) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }))
  );
});