/* RAZOM — i18n engine v2
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

  // Maps nav link hrefs → translation keys (works across all pages without data-i18n)
  var NAV_MAP = {
    '1final_colorful.html': 'nav.home',
    'search.html':          'nav.explore',
    'saved.html':           'nav.saved',
    'profile.html':         'nav.profile',
    'settings.html':        'nav.profile'
  };

  // ── Core ─────────────────────────────────────────────────────────────────

  function current() {
    var saved = localStorage.getItem(STORAGE_KEY) || 'uk';
    // Migrate old full-name values (e.g. 'Українська' → 'uk')
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i].code === saved) return saved;
    }
    return 'uk';
  }

  function langEntry(code) {
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i].code === code) return LANGS[i];
    }
    return LANGS[0];
  }

  function apply(lang) {
    var t = window.T && window.T[lang];
    if (!t) { lang = 'uk'; t = window.T && window.T['uk']; }
    if (!t) return;

    // Text nodes
    var textEls = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textEls.length; i++) {
      var v = t[textEls[i].getAttribute('data-i18n')];
      if (v !== undefined) textEls[i].textContent = v;
    }

    // HTML nodes (content with <br>, <strong> etc.)
    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlEls.length; j++) {
      var vh = t[htmlEls[j].getAttribute('data-i18n-html')];
      if (vh !== undefined) htmlEls[j].innerHTML = vh;
    }

    // Input placeholder attributes
    var phEls = document.querySelectorAll('[data-i18n-placeholder]');
    for (var p = 0; p < phEls.length; p++) {
      var vph = t[phEls[p].getAttribute('data-i18n-placeholder')];
      if (vph !== undefined) phEls[p].setAttribute('placeholder', vph);
    }

    // Auto-translate nav labels by their link href (no data-i18n needed on each page)
    var navLinks = document.querySelectorAll('nav a[href], .bottom-nav a[href]');
    for (var k = 0; k < navLinks.length; k++) {
      var href = navLinks[k].getAttribute('href') || '';
      var file = href.split('/').pop().split('?')[0];
      var key  = NAV_MAP[file];
      if (key && t[key]) {
        var lbl = navLinks[k].querySelector('.nav-lbl, .label');
        if (!lbl) {
          var ch = navLinks[k].children;
          for (var s = ch.length - 1; s >= 0; s--) {
            if (ch[s].tagName === 'SPAN') { lbl = ch[s]; break; }
          }
        }
        if (lbl) lbl.textContent = t[key];
      }
    }

    // Show/hide language content blocks (data-lang-block="uk" / "en")
    var langBlocks = document.querySelectorAll('[data-lang-block]');
    for (var lb = 0; lb < langBlocks.length; lb++) {
      langBlocks[lb].style.display =
        langBlocks[lb].getAttribute('data-lang-block') === lang ? '' : 'none';
    }

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update abbreviation labels (УКР / ENG)
    var entry = langEntry(lang);
    var abbEls = document.querySelectorAll('.lang-display');
    for (var a = 0; a < abbEls.length; a++) abbEls[a].textContent = entry.abbr;

    // Update full-name labels (Українська / English) — used in settings row
    var fullEls = document.querySelectorAll('.lang-full-display');
    for (var b = 0; b < fullEls.length; b++) fullEls[b].textContent = entry.name;

    // Sync picker option highlights
    var opts = document.querySelectorAll('.rz-lp-option');
    for (var c = 0; c < opts.length; c++) {
      var isActive = opts[c].getAttribute('data-lang') === lang;
      if (isActive) opts[c].classList.add('rz-lp-active');
      else          opts[c].classList.remove('rz-lp-active');
    }
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

    // Sync active state before showing
    var cur = current();
    var opts = picker.querySelectorAll('.rz-lp-option');
    for (var i = 0; i < opts.length; i++) {
      var isActive = opts[i].getAttribute('data-lang') === cur;
      if (isActive) opts[i].classList.add('rz-lp-active');
      else          opts[i].classList.remove('rz-lp-active');
    }

    picker.style.display = 'flex';
    // Trigger CSS animation on next frame
    setTimeout(function () {
      picker.classList.add('rz-lp-open');
    }, 10);
  }

  function closePicker() {
    var picker = document.getElementById('rz-lang-picker');
    if (!picker) return;
    picker.classList.remove('rz-lp-open');
    // Hide after animation completes (sheet slides in 300ms)
    setTimeout(function () {
      if (!picker.classList.contains('rz-lp-open')) {
        picker.style.display = 'none';
      }
    }, 350);
  }

  // ── Picker injection ──────────────────────────────────────────────────────

  function injectPicker() {
    if (document.getElementById('rz-lang-picker')) return;
    if (!document.body) return;

    // Inject CSS (uses explicit top/left/right/bottom for max browser compat)
    var style = document.createElement('style');
    style.textContent =
      'a.fab{text-decoration:none;}' +
      '#rz-lang-picker{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;-webkit-box-align:end;align-items:flex-end;-webkit-justify-content:center;justify-content:center;}' +
      '#rz-lang-picker .rz-lp-bd{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0);-webkit-transition:background .25s;transition:background .25s;}' +
      '#rz-lang-picker.rz-lp-open .rz-lp-bd{background:rgba(0,0,0,0.45);}' +
      '#rz-lang-picker .rz-lp-sheet{position:relative;background:#fff;border-radius:24px 24px 0 0;padding:12px 20px 48px;width:100%;max-width:390px;-webkit-transform:translateY(100%);transform:translateY(100%);-webkit-transition:-webkit-transform .3s cubic-bezier(.32,.72,0,1);transition:transform .3s cubic-bezier(.32,.72,0,1);}' +
      '#rz-lang-picker.rz-lp-open .rz-lp-sheet{-webkit-transform:translateY(0);transform:translateY(0);}' +
      '.rz-lp-handle{width:36px;height:4px;background:#DDD9D0;border-radius:2px;margin:0 auto 18px;}' +
      '.rz-lp-title{font-family:Manrope,sans-serif;font-size:17px;font-weight:900;color:#111827;margin-bottom:16px;}' +
      '.rz-lp-option{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;gap:14px;width:100%;background:#fff;border:1.5px solid #E5E2DA;border-radius:16px;padding:14px 16px;margin-bottom:10px;font-family:Manrope,sans-serif;cursor:pointer;-webkit-transition:border-color .15s,background .15s;transition:border-color .15s,background .15s;box-sizing:border-box;}' +
      '.rz-lp-option:last-child{margin-bottom:0;}' +
      '.rz-lp-option.rz-lp-active{border-color:#0057B7;background:#EEF4FF;}' +
      '.rz-lp-flag{font-size:26px;line-height:1;flex-shrink:0;}' +
      '.rz-lp-name{-webkit-box-flex:1;flex:1;font-size:15px;font-weight:700;color:#111827;text-align:left;}' +
      '.rz-lp-check{font-family:"Material Symbols Outlined";font-size:22px;font-variation-settings:"FILL" 1,"wght" 500;color:#0057B7;opacity:0;-webkit-transition:opacity .15s;transition:opacity .15s;flex-shrink:0;}' +
      '.rz-lp-option.rz-lp-active .rz-lp-check{opacity:1;}';
    document.head.appendChild(style);

    // Build option buttons
    var opts = '';
    for (var i = 0; i < LANGS.length; i++) {
      var l = LANGS[i];
      opts += '<button class="rz-lp-option" data-lang="' + l.code +
        '" onclick="RAZOM_I18N.setLang(\'' + l.code + '\')">' +
        '<span class="rz-lp-flag">' + l.flag + '</span>' +
        '<span class="rz-lp-name">' + l.name + '</span>' +
        '<span class="rz-lp-check">check</span>' +
        '</button>';
    }

    // Build picker DOM
    var picker = document.createElement('div');
    picker.id = 'rz-lang-picker';
    picker.innerHTML =
      '<div class="rz-lp-bd" onclick="RAZOM_I18N.closePicker()"></div>' +
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

  function init() {
    injectPicker();

    // Bind click on every .lang-btn (header language button)
    var btns = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < btns.length; i++) {
      if (!btns[i]._rz_bound) {
        btns[i]._rz_bound = true;
        btns[i].addEventListener('click', openPicker);
      }
    }

    apply(current());

    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    }
  }

  // Safe init: works whether DOM is ready or not yet
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
