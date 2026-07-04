// ─── RAZOM Service Worker ─────────────────────────────────────────────────
//
// ВАЖЛИВО: Щоразу коли ти оновлюєш контент і робиш git push —
// зміни тут цей номер версії (наприклад, razom-v1 → razom-v2).
// Це змусить браузери користувачів завантажити нову версію.
//
// ─────────────────────────────────────────────────────────────────────────

const CACHE_VERSION = 'razom-v2';

// Ці файли кешуються одразу при першому відкритті застосунку
const PRECACHE_URLS = [
  './offline.html',
  './1final_colorful.html',
  './js/translations.js',
  './js/i18n.js',
];

// ── Встановлення: кешуємо ключові файли ──────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Активація: видаляємо старі версії кешу ───────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Запити: мережа → кеш → офлайн ────────────────────────────────────────
self.addEventListener('fetch', event => {
  const req = event.request;

  // Тільки GET-запити
  if (req.method !== 'GET') return;

  // Пропускаємо зовнішні запити (Google Fonts, Cloudflare Worker, тощо)
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    // Навігація по сторінках: спочатку мережа, при помилці — кеш або offline.html
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            // Зберігаємо відповідь у кеш для майбутнього офлайн-використання
            const clone = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req)
            .then(hit => hit || caches.match('./offline.html'))
        )
    );
  } else {
    // Статичні ресурси (JS, шрифти тощо): спочатку кеш, потім мережа
    event.respondWith(
      caches.match(req).then(hit => {
        if (hit) return hit;
        return fetch(req).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, clone));
          }
          return res;
        });
      })
    );
  }
});
