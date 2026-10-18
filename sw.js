// Service worker de l'appli Atelier : affiche les notifications envoyées par le serveur Google.
const API = 'https://script.google.com/macros/s/AKfycbzEcF4myP2quQhz5PkKLgQiCXvFXrWOxb0v2SszGl1zu8Da4-_sm2dyGuGi588rccEX_A/exec';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let n = { titre: 'Atelier', corps: 'Nouvelle activité à l\'atelier', tag: 'atelier' };
    try {
      const sub = await self.registration.pushManager.getSubscription();
      const r = await fetch(API + '?action=notif&endpoint=' + encodeURIComponent(sub ? sub.endpoint : ''), { cache: 'no-store' });
      const j = await r.json(); if (j && j.titre) n = j;
    } catch (err) {}
    await self.registration.showNotification(n.titre, { body: n.corps, tag: (n.tag || 'atelier') + '-' + Date.now(), icon: 'icon-192.png', badge: 'icon-192.png', data: { url: './' } });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./');
  }));
});
