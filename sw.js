const CACHE = 'refugeeguide-v1';

const CORE = [
  '/ClaudeCode/',
  '/ClaudeCode/RefugeeApp/Design/Mockups/1final_colorful.html',
  '/ClaudeCode/RefugeeApp/Design/Mockups/firststeps.html',
  '/ClaudeCode/RefugeeApp/Design/Mockups/news.html',
  '/ClaudeCode/RefugeeApp/Design/Mockups/search.html',
  '/ClaudeCode/RefugeeApp/Design/Mockups/saved.html',
  '/ClaudeCode/RefugeeApp/Design/Mockups/profile.html',
  '/ClaudeCode/RefugeeApp/Design/Mockups/19_korysne.html',
  '/ClaudeCode/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});
