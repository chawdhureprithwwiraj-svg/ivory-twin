/* ═══════════════════════════════════════════════════════════════════════════
   THE HOUSE'S SERVICE WORKER · one job only: the notice on the phone

   Android Chrome will only put a notification on the handset from a service
   worker, so this file exists for that single purpose. It caches nothing, it
   intercepts no request, and it never keeps a stale page: the house must always
   be the house as it was built, and nothing here can serve an old one.

   Tapping a notice brings the house forward, on the tab it names.
   ═══════════════════════════════════════════════════════════════════════════ */
self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var tab = (e.notification.data && e.notification.data.tab) || 'feed';
  var url = './#' + tab;
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if ('focus' in c) {
          try { c.postMessage({ ivory: 'tab', tab: tab }); } catch (err) {}
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
