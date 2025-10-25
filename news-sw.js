// news-sw.js (Advanced version)
const CACHE_NAME = 'news-cache-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/favicon.ico'
];

// Install event - pre-cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event - remove old cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch event - serve from cache, then update
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response ||
      fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      })
    ).catch(() => caches.match('/index.html'))
  );
});
