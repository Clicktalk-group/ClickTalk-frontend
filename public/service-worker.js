// Service Worker pour ClickTalk
const CACHE_NAME = 'clicktalk-cache-v1';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/css/main.chunk.css',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/vendors~main.chunk.js',
  '/manifest.json',
  '/favicon.ico',
  '/assets/images/logo.png',
  '/assets/images/avatar-assistant.png'
];

// Installation du Service Worker
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      // eslint-disable-next-line no-restricted-globals
      .then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
          return null; // Retourne null pour les autres cas (corrige l'erreur array-callback-return)
        })
      );
    // eslint-disable-next-line no-restricted-globals
    }).then(() => self.clients.claim())
  );
});

// Stratégie de mise en cache : Network First avec fallback vers le cache
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes API qui nécessitent une connexion fraîche
  if (event.request.url.includes('/api/') || 
      event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone la réponse car elle ne peut être consommée qu'une fois
        const responseClone = response.clone();
        
        // Ouvre le cache et y stocke la nouvelle réponse
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
          
        return response;
      })
      .catch(() => {
        // Si le réseau échoue, tente de récupérer depuis le cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Fallback pour les pages HTML : renvoie la page d'accueil
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // Si rien n'est trouvé, retourne une erreur
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Gestion des messages du client (pour forcer la mise à jour du cache)
// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // eslint-disable-next-line no-restricted-globals
    self.skipWaiting();
  }
});
