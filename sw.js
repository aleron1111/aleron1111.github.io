// DickChat Service Worker — Push Notifications
const CACHE = ‘dickchat-v1’;

self.addEventListener(‘install’, e => {
self.skipWaiting();
});

self.addEventListener(‘activate’, e => {
e.waitUntil(clients.claim());
});

// Handle push from server (future use)
self.addEventListener(‘push’, e => {
const data = e.data ? e.data.json() : {};
e.waitUntil(
self.registration.showNotification(data.title || ‘DickChat 🍆’, {
body: data.body || ‘Нове повідомлення’,
icon: data.icon || ‘/icon.png’,
badge: data.badge || ‘/icon.png’,
tag: data.tag || ‘dickchat-msg’,
renotify: true,
vibrate: [200, 100, 200],
data: { url: data.url || ‘/’ }
})
);
});

// Handle notification click — open app
self.addEventListener(‘notificationclick’, e => {
e.notification.close();
e.waitUntil(
clients.matchAll({ type: ‘window’, includeUncontrolled: true }).then(list => {
for (const client of list) {
if (client.url.includes(self.location.origin) && ‘focus’ in client) {
return client.focus();
}
}
return clients.openWindow(e.notification.data?.url || ‘/’);
})
);
});

// Receive message from main page to show notification
self.addEventListener(‘message’, e => {
if (e.data?.type === ‘SHOW_NOTIFICATION’) {
const { title, body, icon, tag } = e.data;
self.registration.showNotification(title, {
body,
icon: icon || ‘/icon.png’,
badge: ‘/icon.png’,
tag: tag || ‘dickchat-msg’,
renotify: true,
vibrate: [150, 50, 150],
silent: false,
data: { url: self.location.origin }
});
}
});