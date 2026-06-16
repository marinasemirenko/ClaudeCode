/* RAZOM — translations
 * All UI strings for every page, organized by section.
 * Keys use dot-notation: page.section.element
 * For article content with long text, use data-i18n-html for HTML,
 * or use <div lang="uk"> / <div lang="en"> blocks (shown/hidden by i18n.js).
 */
window.T = {

  /* ═══════════════════════════════════════════════════════════════════════
     UKRAINIAN  (default / fallback)
  ══════════════════════════════════════════════════════════════════════════ */
  uk: {

    // Language picker
    'lang.picker.title': 'Мова',
    'lang.current.name': 'Українська',

    // ── Bottom navigation (appears on every page) ──────────────────────
    'nav.home':    'Головна',
    'nav.explore': 'Огляд',
    'nav.saved':   'Збережені',
    'nav.profile': 'Профіль',

    // ── HOME (1final_colorful.html) ────────────────────────────────────
    'home.greeting':      'Добрий день, <strong>Марино</strong>',
    'home.cat.laws':      'Закони<br>та права',
    'home.cat.health':    "Охорона<br>здоров'я",
    'home.cat.education': 'Освіта',
    'home.cat.work':      'Робота',
    'home.cat.housing':   'Житло',
    'home.cat.links':     'Посилання',
    'home.cat.useful':    'Корисне',
    'home.cat.news':      'Новини',
    'home.qs.title':      'Перші кроки в Нідерландах',
    'home.qs.sub':        'BSN, gemeente, лікар — з чого почати',
    'home.qs.pill':       'Гайд',
    'home.hotline.label': 'Медична гаряча лінія 24/7',
    'home.emergency':     'Екстрена допомога',

    // ── SETTINGS (settings.html) ───────────────────────────────────────
    'settings.title':               'Налаштування',
    'settings.sec.app':             'Застосунок',
    'settings.lang.label':          'Мова інтерфейсу',
    'settings.lang.desc':           'Мова кнопок та підказок',
    'settings.notif.label':         'Сповіщення',
    'settings.notif.desc':          'Важливі оновлення та новини',
    'settings.offline.label':       'Зберігати офлайн',
    'settings.offline.desc':        'Завантажити контент для читання без інтернету',
    'settings.sec.subscription':    'Підписка',
    'settings.premium.title':       'RAZOM Premium',
    'settings.premium.sub':         'Весь контент, без реклами, пріоритетний чат',
    'settings.premium.btn':         'Скоро',
    'settings.sec.support':         'Підтримка',
    'settings.chat.label':          'AI-помічник',
    'settings.chat.desc':           'Відкрити чат з помічником',
    'settings.email.label':         'Написати нам',
    'settings.rate.label':          'Оцінити застосунок',
    'settings.rate.desc':           'Допоможи нам стати кращими',
    'settings.sec.about':           'Про застосунок',
    'settings.about.version.key':   'Версія',
    'settings.about.made.key':      'Зроблено',
    'settings.about.made.val':      'Мариною, для українців 🇺🇦',
    'settings.about.country.key':   'Країна',
    'settings.about.country.val':   'Нідерланди 🇳🇱',
    'settings.clear.label':         'Очистити всі дані',
    'settings.clear.desc':          'Видалити ключ, налаштування, збережене',

    // ── FIRST STEPS (firststeps.html) ──────────────────────────────────
    'firststeps.title':       'Перші кроки в Нідерландах',
    'firststeps.badge':       '🇳🇱 Орієнтація',
    'firststeps.h1':          'Перші <span style="color:var(--yellow)">7 кроків</span> у Нідерландах',
    'firststeps.sub':         'Новий старт — це завжди трохи хаотично. Ось чіткий план, що робити в перший місяць.',
    'firststeps.stat1.num':   '7',
    'firststeps.stat1.lbl':   'кроків',
    'firststeps.stat2.num':   '30',
    'firststeps.stat2.lbl':   'днів',
    'firststeps.alert':       '⚠️ Цей список не офіційний порядок — кожна ситуація різна. Деякі кроки залежать від твого статусу.',
    'firststeps.sec.steps':   'Кроки',
    'firststeps.progress.of': 'з',
    'firststeps.progress.done': 'виконано',

    // ── SEARCH (search.html) ──────────────────────────────────────────
    'search.placeholder':     'Пошук по всьому застосунку...',
    'search.title':           'Пошук',

    // ── SAVED (saved.html) ────────────────────────────────────────────
    'saved.title':            'Збережені',
    'saved.empty':            'Поки нічого не збережено',
    'saved.empty.sub':        'Натисни 🔖 на будь-якій статті, щоб зберегти її сюди',

    // ── PROFILE / CHAT (profile.html) ────────────────────────────────
    'profile.title':          'Профіль',
    'chat.title':             'AI-помічник',

    // ── COMMON ARTICLE ELEMENTS ───────────────────────────────────────
    'article.back':           'Назад',
    'article.premium.title':  'Преміум контент',
    'article.premium.unlock': 'Розблокувати',
    'article.premium.soon':   'Повний доступ з\'явиться незабаром',
  },

  /* ═══════════════════════════════════════════════════════════════════════
     ENGLISH
  ══════════════════════════════════════════════════════════════════════════ */
  en: {

    // Language picker
    'lang.picker.title': 'Language',
    'lang.current.name': 'English',

    // ── Bottom navigation ──────────────────────────────────────────────
    'nav.home':    'Home',
    'nav.explore': 'Explore',
    'nav.saved':   'Saved',
    'nav.profile': 'Profile',

    // ── HOME ──────────────────────────────────────────────────────────
    'home.greeting':      'Hello, <strong>Marina</strong>',
    'home.cat.laws':      'Laws &amp;<br>Rights',
    'home.cat.health':    'Healthcare',
    'home.cat.education': 'Education',
    'home.cat.work':      'Work',
    'home.cat.housing':   'Housing',
    'home.cat.links':     'Useful Links',
    'home.cat.useful':    'Tips &amp; Tools',
    'home.cat.news':      'News',
    'home.qs.title':      'First Steps in the Netherlands',
    'home.qs.sub':        'BSN, gemeente, doctor — where to start',
    'home.qs.pill':       'Guide',
    'home.hotline.label': 'Medical Helpline 24/7',
    'home.emergency':     'Emergency',

    // ── SETTINGS ──────────────────────────────────────────────────────
    'settings.title':               'Settings',
    'settings.sec.app':             'Application',
    'settings.lang.label':          'Interface language',
    'settings.lang.desc':           'Language for buttons and labels',
    'settings.notif.label':         'Notifications',
    'settings.notif.desc':          'Important updates and news',
    'settings.offline.label':       'Save offline',
    'settings.offline.desc':        'Download content for offline reading',
    'settings.sec.subscription':    'Subscription',
    'settings.premium.title':       'RAZOM Premium',
    'settings.premium.sub':         'Full content, no ads, priority chat',
    'settings.premium.btn':         'Coming soon',
    'settings.sec.support':         'Support',
    'settings.chat.label':          'AI Assistant',
    'settings.chat.desc':           'Open chat with assistant',
    'settings.email.label':         'Contact us',
    'settings.rate.label':          'Rate the app',
    'settings.rate.desc':           'Help us improve',
    'settings.sec.about':           'About',
    'settings.about.version.key':   'Version',
    'settings.about.made.key':      'Made by',
    'settings.about.made.val':      'Marina, for Ukrainians 🇺🇦',
    'settings.about.country.key':   'Country',
    'settings.about.country.val':   'Netherlands 🇳🇱',
    'settings.clear.label':         'Clear all data',
    'settings.clear.desc':          'Delete key, settings, saved content',

    // ── FIRST STEPS ───────────────────────────────────────────────────
    'firststeps.title':       'First Steps in the Netherlands',
    'firststeps.badge':       '🇳🇱 Orientation',
    'firststeps.h1':          'First <span style="color:var(--yellow)">7 Steps</span> in the Netherlands',
    'firststeps.sub':         'A fresh start can feel overwhelming. Here is a clear plan for your first month.',
    'firststeps.stat1.num':   '7',
    'firststeps.stat1.lbl':   'steps',
    'firststeps.stat2.num':   '30',
    'firststeps.stat2.lbl':   'days',
    'firststeps.alert':       '⚠️ This list is not an official order — every situation is different. Some steps depend on your status.',
    'firststeps.sec.steps':   'Steps',
    'firststeps.progress.of': 'of',
    'firststeps.progress.done': 'done',

    // ── SEARCH ────────────────────────────────────────────────────────
    'search.placeholder':     'Search across the app...',
    'search.title':           'Search',

    // ── SAVED ─────────────────────────────────────────────────────────
    'saved.title':            'Saved',
    'saved.empty':            'Nothing saved yet',
    'saved.empty.sub':        'Tap 🔖 on any article to save it here',

    // ── PROFILE / CHAT ────────────────────────────────────────────────
    'profile.title':          'Profile',
    'chat.title':             'AI Assistant',

    // ── COMMON ARTICLE ELEMENTS ───────────────────────────────────────
    'article.back':           'Back',
    'article.premium.title':  'Premium content',
    'article.premium.unlock': 'Unlock',
    'article.premium.soon':   'Full access coming soon',
  }

};
