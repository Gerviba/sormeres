var dataCacheName = 'sormeres-pwa';
var cacheName = 'sormeres-pwa';
var filesToCache = [
  '/',
 "./fonts",
 "./fonts/RobotoMono-Bold.ttf",
 "./fonts/RobotoMono-Light.ttf",
 "./images",
 "./images/icons",
 "./images/icons/icon-128x128.png",
 "./images/icons/icon-144x144.png",
 "./images/icons/icon-152x152.png",
 "./images/icons/icon-192x192.png",
 "./images/icons/icon-384x384.png",
 "./images/icons/icon-512x512.png",
 "./images/icons/icon-72x72.png",
 "./images/icons/icon-96x96.png",
 "./index.html",
 "./manifest.json",
 "./script.js?3",
 "./sw.js",
 "./favicon.ico",
 "./style.css"
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});