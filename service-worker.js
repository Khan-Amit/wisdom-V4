// Service Worker for Wisdom Cards App
const CACHE_NAME = 'wisdom-cards-v4';
const STATIC_ASSETS = [
  '/wisdom-V4/',
  '/wisdom-V4/index.html',
  '/wisdom-V4/style.css',
  '/wisdom-V4/script.js',
  '/wisdom-V4/update-checker.js',
  '/wisdom-V4/manifest.json',
  '/wisdom-V4/wisdom-data.json',
  '/wisdom-V4/app-icons/icon-72x72.png',
  '/wisdom-V4/app-icons/icon-192x192.png',
  '/wisdom-V4/app-icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(response => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
      .catch(error => {
        console.log('Service Worker: Fetch failed; returning offline page', error);
        // If everything fails, show a fallback
        if (event.request.destination === 'document') {
          return caches.match('/wisdom-V4/index.html');
        }
      })
  );
});
