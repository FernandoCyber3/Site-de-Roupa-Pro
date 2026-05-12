// Service Worker básico para permitir a instalação do PWA
const CACHE_NAME = 'squad-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Necessário para satisfazer os critérios de instalação do PWA
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(response => {
        return response || new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
