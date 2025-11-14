
const CACHE = 'ironbridge-cache-v1';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{
      let clone = res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, clone));
      return res;
    }))
  );
});
