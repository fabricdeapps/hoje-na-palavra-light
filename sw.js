// Hoje na Palavra - Service Worker v1.0.0
const CACHE_NAME = 'hnp-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(err => console.warn('Cache addAll:', err));
    })
  );
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch - Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET and external API requests
  if (request.method !== 'GET') return;
  if (request.url.includes('openrouter.ai')) return;
  if (request.url.includes('googleapis.com') && request.url.includes('/fonts/')) {
    // Cache fonts
    event.respondWith(
      caches.open(CACHE_NAME + '-fonts').then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(resp => {
            cache.put(request, resp.clone());
            return resp;
          }).catch(() => cached);
        })
      )
    );
    return;
  }
  
  // HTML pages: Network first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return resp;
        })
        .catch(() => caches.match(request).then(c => c || caches.match('/index.html')))
    );
    return;
  }
  
  // Other assets: Cache first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return resp;
      }).catch(() => cached);
    })
  );
});

// Push Notification Handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {
    title: '☀️ Hoje na Palavra',
    body: '✦ Sua reflexão diária está pronta!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '☀️ Hoje na Palavra', {
      body: data.body || '✦ Sua reflexão diária está pronta. Comece o dia com a Palavra!',
      icon: data.icon || '/icons/icon-192.png',
      badge: data.badge || '/icons/icon-192.png',
      tag: 'daily-devotional',
      requireInteraction: false,
      data: { url: data.url || '/' }
    })
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data?.url || '/');
    })
  );
});
