const CACHE = 'moto2026-v6';
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
  'stats.html',
  'prediction.html',
  'circuiti.html',
  'circuiti/circuito_thailandia.html',
  'circuiti/circuito_brasile.html',
  'circuiti/circuito_america.html',
  'circuiti/circuito_jerez.html',
  'circuiti/circuito_lemans.html',
  'circuiti/circuito_barcellona.html',
  'circuiti/circuito_mugello.html',
  'circuiti/circuito_ungheria.html',
  'circuiti/circuito_brno.html',
  'circuiti/circuito_assen.html',
  'circuiti/circuito_sachsenring.html',
  'circuiti/circuito_silverstone.html',
  'circuiti/circuito_aragon.html',
  'circuiti/circuito_misano.html',
  'circuiti/circuito_austria.html',
  'circuiti/circuito_motegi.html',
  'circuiti/circuito_mandalika.html',
  'circuiti/circuito_phillipisland.html',
  'circuiti/circuito_sepang.html',
  'circuiti/circuito_qatar.html',
  'circuiti/circuito_portimao.html',
  'circuiti/circuito_valencia.html',
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
