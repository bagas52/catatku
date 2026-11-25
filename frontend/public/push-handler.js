// Handler notifikasi push untuk service worker CatatKu.
// File ini di-import oleh service worker yang di-generate Workbox (lihat vite.config.ts).

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'CatatKu', body: event.data.text() };
  }

  const title = payload.title || 'CatatKu';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/favicon-192.png',
    badge: payload.badge || '/favicon-192.png',
    tag: payload.tag,
    data: payload.data || {},
    vibrate: [120, 60, 120],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const target = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (new URL(client.url).origin === self.location.origin && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});
