const PREFIX = 'luckyplus-bear7-' + new URL(self.registration.scope).pathname + ':';
const CACHE = PREFIX + '1a4daf5e23b6';
const shell = new URL('./index.html', self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([
    './index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png'
  ])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(PREFIX) && key !== CACHE)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate') return;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || ![scope.pathname, new URL(shell).pathname].includes(url.pathname)) return;
  event.respondWith(fetch(request).catch(async () => (await caches.open(CACHE)).match(shell)));
});
