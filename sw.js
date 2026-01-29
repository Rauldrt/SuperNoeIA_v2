
const CACHE_NAME = 'noelia-ai-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 1. Install Event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Network First, fallback to Cache
// Estategia ideal para Apps que dependen de datos frescos (API) y CDNs externos
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET o sean a la API de Google/Firebase
  if (event.request.method !== 'GET' || 
      event.request.url.includes('generativelanguage.googleapis.com') ||
      event.request.url.includes('firestore')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la red responde bien, actualizamos el caché (si es válido) y devolvemos respuesta
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
            // Intentar cachear (puede fallar con opaque responses de CDNs, es normal)
            try { cache.put(event.request, responseToCache); } catch(e) {}
        });
        return response;
      })
      .catch(() => {
        // Si falla la red (offline), buscamos en caché
        return caches.match(event.request);
      })
  );
});
