/* RAZOM — i18n engine
 * Reads window.T (from translations.js), applies data-i18n / data-i18n-html attributes,
 * injects a language picker bottom-sheet, and auto-binds all .lang-btn elements.
 * Include AFTER translations.js on each page.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'rg_lang';

  var LANGS = [
    { code: 'uk', name: 'Українська', flag: '🇺🇦', abbr: 'УКР' },
    { code: 'en', name: 'English',    flag: '🇬🇧', abbr: 'ENG' }
  ];

  // ── Core ─────────────────────────────────────────────────────────────────

  function current() {
    var saved = localStorage.getItem(STORAGE_KEY) || 'uk';
    // Migrate old stored full-name values (e.g. 'Українська' → 'uk')
    var found = LANGS.find(function (l) { return l.code === saved; });
    return found ? saved : 'uk';
  }

  // Maps nav link hrefs → translation keys (works across all pages without data-i18n)
  var NAV_MAP = {
    '1final_colorful.html': 'nav.home',
    'search.html':          'nav.explore',
    'saved.html':           'nav.saved',
    'profile.html':         'nav.profile',
    'settings.html':        'nav.profile'
  };

  function apply(lang) {
    var t = window.T && window.T[lang];
    if (!t) { lang = 'uk'; t = window.T && window.T['uk']; }
    if (!t) return;

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t[el.getAttribute('data-i18n')];
      if (v !== undefined) el.textContent = v;
    });

    // HTML nodes (for content with <br> or <strong> etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t[el.getAttribute('data-i18n-html')];
      if (v !== undefined) el.innerHTML = v;
    });

    // Auto-translate nav labels by their parent link's href (no data-i18n needed)
    document.querySelectorAll('nav a[href], .bottom-nav a[href]').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var file = href.split('/').pop().split('?')[0];
      var key  = NAV_MAP[file];
      if (key && t[key]) {
        var lbl = link.querySelector('.nav-lbl, .label');
        if (lbl) lbl.textContent = t[key];
      }
    });

    // lang attribute on <html>
    document.documentElement.lang = lang;

    // Update abbreviation labels in all lang buttons
    var entry = LANGS.find(function (l) { return l.code === lang; });
    document.querySelectorAll('.lang-display').forEach(function (el) {
      el.textContent = entry ? entry.abbr : 'УКР';
    });

    // Update full-name labels (used in settings row)
    document.querySelectorAll('.lang-full-display').forEach(function (el) {
      el.textContent = entry ? entry.name : 'Українська';
    });

    // Sync picker active state
    document.querySelectorAll('.rz-lp-option').forEach(function (el) {
      el.classList.toggle('rz-lp-active', el.dataset.lang === lang);
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    apply(lang);
    closePicker();
  }

  function openPicker() {
    var picker = document.getElementById('rz-lang-picker');
    if (!picker) return;
    var cur = current();
    picker.querySelectorAll('.rz-lp-option').forEach(function (el) {
      el.classList.toggle('rz-lp-active', el.dataset.lang === cur);
    });
    picker.style.display = 'flex';
    // small delay so CSS transition plays
    requestAnimationFrame(function () {
      picker.classList.add('rz-lp-open');
    });
  }

  function closePicker() {
    var picker = document.getElementById('rz-lang-picker');
    if (!picker) return;
    picker.classList.remove('rz-lp-open');
    // wait for transition before hiding
    picker.addEventListener('transitionend', function onEnd() {
      picker.style.display = 'none';
      picker.removeEventListener('transitionend', onEnd);
    }, { once: true });
  }

  // ── Picker injection ──────────────────────────────────────────────────────

  function injectPicker() {
    if (document.getElementById('rz-lang-picker')) return;

    // Styles
    var style = document.createElement('style');
    style.textContent = [
      '#rz-lang-picker{display:none;position:fixed;inset:0;z-index:2000;align-items:flex-end;justify-content:center;}',
      '#rz-lang-picker .rz-lp-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .25s;}',
      '#rz-lang-picker.rz-lp-open .rz-lp-backdrop{background:rgba(0,0,0,0.45);}',
      '#rz-lang-picker .rz-lp-sheet{position:relative;background:#fff;border-radius:24px 24px 0 0;padding:12px 20px 44px;width:100%;max-width:390px;transform:translateY(100%);transition:transform .3s cubic-bezier(.32,.72,0,1);}',
      '#rz-lang-picker.rz-lp-open .rz-lp-sheet{transform:translateY(0);}',
      '.rz-lp-handle{width:36px;height:4px;background:#DDD9D0;border-radius:2px;margin:0 auto 18px;}',
      '.rz-lp-title{font-family:Manrope,sans-serif;font-size:17px;font-weight:900;color:#111827;margin-bottom:16px;}',
      '.rz-lp-option{display:flex;align-items:center;gap:14px;width:100%;background:#fff;border:1.5px solid #E5E2DA;border-radius:16px;padding:14px 16px;margin-bottom:10px;font-family:Manrope,sans-serif;cursor:pointer;transition:border-color .15s,background .15s;}',
      '.rz-lp-option:last-child{margin-bottom:0;}',
      '.rz-lp-option.rz-lp-active{border-color:#0057B7;background:#EEF4FF;}',
      '.rz-lp-flag{font-size:26px;line-height:1;}',
      '.rz-lp-name{flex:1;font-size:15px;font-weight:700;color:#111827;text-align:left;}',
      '.rz-lp-check{font-family:"Material Symbols Outlined";font-size:22px;font-variation-settings:"FILL" 1,"wght" 500;color:#0057B7;opacity:0;transition:opacity .15s;}',
      '.rz-lp-option.rz-lp-active .rz-lp-check{opacity:1;}'
    ].join('');
    document.head.appendChild(style);

    // DOM
    var opts = LANGS.map(function (l) {
      return '<button class="rz-lp-option" data-lang="' + l.code + '" onclick="RAZOM_I18N.setLang(\'' + l.code + '\')">' +
        '<span class="rz-lp-flag">' + l.flag + '</span>' +
        '<span class="rz-lp-name">' + l.name + '</span>' +
        '<span class="rz-lp-check">check</span>' +
        '</button>';
    }).join('');

    var picker = document.createElement('div');
    picker.id = 'rz-lang-picker';
    picker.innerHTML =
      '<div class="rz-lp-backdrop" onclick="RAZOM_I18N.closePicker()"></div>' +
      '<div class="rz-lp-sheet">' +
        '<div class="rz-lp-handle"></div>' +
        '<div class="rz-lp-title" data-i18n="lang.picker.title">Мова</div>' +
        opts +
      '</div>';
    document.body.appendChild(picker);
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  window.RAZOM_I18N = {
    setLang:     setLang,
    openPicker:  openPicker,
    closePicker: closePicker,
    apply:       apply,
    current:     current
  };

  document.addEventListener('DOMContentLoaded', function () {
    injectPicker();

    // Bind every .lang-btn on this page (just once per element)
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      if (!btn._i18nBound) {
        btn._i18nBound = true;
        btn.addEventListener('click', openPicker);
      }
    });

    apply(current());
  });
})();
