(function () {
  'use strict';

  var CATEGORIES = [
    { prefix: '02_',         cat: "Охорона здоров'я", icon: '🏥', color: 'c-blue'   },
    { prefix: '12_',         cat: "Охорона здоров'я", icon: '🏥', color: 'c-blue'   },
    { prefix: '13_',         cat: 'Закони та права',  icon: '⚖️',  color: 'c-blue'   },
    { prefix: '14_',         cat: 'Освіта',           icon: '🎓',  color: 'c-amber'  },
    { prefix: '15_',         cat: 'Житло',            icon: '🏠',  color: 'c-purple' },
    { prefix: '16_',         cat: 'Робота',           icon: '💼',  color: 'c-amber'  },
    { prefix: '17_',         cat: 'Практичні поради', icon: '💡',  color: 'c-sky'    },
    { prefix: '18_',         cat: 'Корисні посилання',icon: '🔗',  color: 'c-teal'   },
    { prefix: '19_',         cat: 'Корисне',          icon: '🔧',  color: 'c-teal'   },
    { prefix: 'firststeps',  cat: 'Перші кроки',      icon: '👣',  color: 'c-green'  },
  ];

  function getFilename() {
    var path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  }

  function getStorageKey(filename) {
    return 'bm_' + (filename || getFilename());
  }

  function getCategoryMeta(filename) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (filename.indexOf(CATEGORIES[i].prefix) === 0) return CATEGORIES[i];
    }
    return { cat: 'Стаття', icon: '📄', color: 'c-blue' };
  }

  function isBookmarked(filename) {
    return !!localStorage.getItem(getStorageKey(filename));
  }

  function applyState(btn, saved) {
    var icon = btn.querySelector('span');
    if (!icon) return;
    if (saved) {
      icon.style.fontVariationSettings = "'FILL' 1,'wght' 600,'GRAD' 0,'opsz' 24";
      btn.style.color = '#0057B7';
      btn.style.borderColor = '#0057B7';
      btn.style.background = '#E8F0FF';
    } else {
      icon.style.fontVariationSettings = "'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24";
      btn.style.color = '';
      btn.style.borderColor = '';
      btn.style.background = '';
    }
  }

  function showToast(msg) {
    var old = document.getElementById('bm-toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.id = 'bm-toast';
    el.textContent = msg;
    el.style.cssText = [
      'position:fixed', 'bottom:110px', 'left:50%',
      "transform:translateX(-50%) translateY(8px)",
      'background:#111827', 'color:#fff',
      "font-family:'Manrope',sans-serif",
      'font-size:13px', 'font-weight:700',
      'padding:10px 20px', 'border-radius:12px',
      'z-index:9999', 'white-space:nowrap',
      'box-shadow:0 4px 16px rgba(0,0,0,0.25)',
      'pointer-events:none', 'opacity:0',
      'transition:opacity 0.15s ease, transform 0.15s ease'
    ].join(';');
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.opacity = '1';
        el.style.transform = 'translateX(-50%) translateY(0)';
      });
    });
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) translateY(8px)';
      setTimeout(function () { if (el.parentNode) el.remove(); }, 200);
    }, 2000);
  }

  function init() {
    var btn = document.querySelector('.bookmark-btn');
    if (!btn) return;

    var filename = getFilename();
    applyState(btn, isBookmarked(filename));

    btn.addEventListener('click', function () {
      var key = getStorageKey(filename);
      if (isBookmarked(filename)) {
        localStorage.removeItem(key);
        applyState(btn, false);
        showToast('Видалено зі збережених');
      } else {
        var meta = getCategoryMeta(filename);
        var titleEl = document.querySelector('.header-title');
        var title = titleEl ? titleEl.textContent.trim() : document.title;
        var data = {
          url: filename,
          title: title,
          cat: meta.cat,
          icon: meta.icon,
          color: meta.color,
          savedAt: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(data));
        applyState(btn, true);
        showToast('Збережено!');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
