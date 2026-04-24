const CACHE = 'moto2026-v3';
const PRECACHE = [
  'index.html',
  'classifica.html',
  'risultati.html',
  'piloti.html',
  'pilota.html',
  'calendario.html',
  'stagione.html',
  'albo_doro.html',
  'guida.html',
  'relazione.html',
  'motogp.html',
  'moto2.html',
  'moto3.html',
  'favicon.svg',
  'manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Solo richieste GET della stessa origine
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request)
          .then(resp => {
            if (resp && resp.status === 200) cache.put(e.request, resp.clone());
            return resp;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    )
  );
});
