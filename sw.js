const CACHE_NAME = 'moto2026-v6';
const ASSETS_TO_CACHE = [
  'index.html',
  'notizie.html',
  'classifica.html',
  'classifica-jgprcc-html',
  'risultati.html',
  'piloti.html',
  'pilota.html',
  'calendario.html',
  'team.html',
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
  'manifest.json',
  'img/icon-192.png',  // AGGIUNTA: Così salva in cache anche le icone!
  'img/icon-512.png'   // AGGIUNTA: Così salva in cache anche le icone!
];

// Installazione: salva i file in cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aperta');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((error) => console.error('Errore nel caching:', error))
  );
});

// Attivazione: pulisce le vecchie cache se aggiorni l'app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch: Serve i file dalla cache se non c'è connessione
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se il file è in cache, lo serve da lì
        if (response) {
          return response;
        }
        // Altrimenti lo scarica dalla rete
        return fetch(event.request);
      })
  );
});