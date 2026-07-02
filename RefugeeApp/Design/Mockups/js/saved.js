(function () {
  'use strict';

  var FILTER_ORDER = [
    "Охорона здоров'я",
    'Закони та права',
    'Освіта',
    'Житло',
    'Робота',
    'Практичні поради',
    'Корисні посилання',
    'Корисне',
    'Перші кроки',
  ];

  var activeFilter = '';

  function pluralCount(n) {
    if (n === 0) return '';
    var mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return n + ' стаття';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return n + ' статті';
    return n + ' статей';
  }

  function formatDate(ts) {
    if (!ts) return '';
    var diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60)    return 'Щойно збережено';
    if (diff < 3600)  return 'Збережено ' + Math.floor(diff / 60) + ' хв тому';
    if (diff < 86400) return 'Збережено сьогодні';
    var days = Math.floor(diff / 86400);
    if (days === 1)   return 'Збережено вчора';
    if (days < 7)     return 'Збережено ' + days + ' дні тому';
    if (days < 14)    return 'Збережено тиждень тому';
    if (days < 30)    return 'Збережено ' + Math.floor(days / 7) + ' тижні тому';
    return 'Збережено ' + Math.floor(days / 30) + ' міс тому';
  }

  function loadAllItems() {
    var items = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf('bm_') === 0) {
        try {
          var data = JSON.parse(localStorage.getItem(key));
          if (data && data.url && data.title) items.push(data);
        } catch (e) {}
      }
    }
    items.sort(function (a, b) { return (b.savedAt || 0) - (a.savedAt || 0); });
    return items;
  }

  function buildFilters(allItems) {
    var bar = document.querySelector('.filter-bar');
    if (!bar) return;

    var seen = {};
    var cats = [];
    allItems.forEach(function (item) {
      if (!seen[item.cat]) { seen[item.cat] = true; cats.push(item.cat); }
    });
    cats.sort(function (a, b) {
      var ia = FILTER_ORDER.indexOf(a), ib = FILTER_ORDER.indexOf(b);
      if (ia === -1) ia = 99;
      if (ib === -1) ib = 99;
      return ia - ib;
    });

    var html = '<div class="filter-tab' + (!activeFilter ? ' active' : '') + '" data-cat="">Всі</div>';
    cats.forEach(function (cat) {
      html += '<div class="filter-tab' + (activeFilter === cat ? ' active' : '') + '" data-cat="' + cat + '">' + cat + '</div>';
    });
    bar.innerHTML = html;

    bar.querySelectorAll('.filter-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        activeFilter = this.getAttribute('data-cat');
        render();
      });
    });
  }

  function renderCards(items) {
    var list = document.querySelector('.saved-list');
    if (!list) return;

    if (items.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:32px 16px;color:var(--muted);font-size:13px;font-weight:600;">Немає збережених у цій категорії</div>';
      return;
    }

    list.innerHTML = items.map(function (item) {
      return [
        '<div class="saved-card ' + item.color + '">',
        '  <a href="' + item.url + '" style="display:flex;flex:1;gap:12px;align-items:center;text-decoration:none;color:inherit;min-width:0;overflow:hidden;">',
        '    <div class="saved-icon">' + item.icon + '</div>',
        '    <div class="saved-info">',
        '      <div class="saved-cat">' + item.cat + '</div>',
        '      <div class="saved-title">' + item.title + '</div>',
        '      <div class="saved-meta">' + formatDate(item.savedAt) + '</div>',
        '    </div>',
        '    <span class="saved-bm">bookmark</span>',
        '  </a>',
        '  <button class="remove-btn" data-url="' + item.url + '" title="Видалити">close</button>',
        '</div>'
      ].join('');
    }).join('');

    list.querySelectorAll('.remove-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        localStorage.removeItem('bm_' + this.getAttribute('data-url'));
        var remaining = loadAllItems().filter(function (i) { return i.cat === activeFilter; });
        if (activeFilter && remaining.length === 0) activeFilter = '';
        render();
      });
    });
  }

  function render() {
    var allItems = loadAllItems();
    var filtered = activeFilter
      ? allItems.filter(function (i) { return i.cat === activeFilter; })
      : allItems;

    var countEl   = document.querySelector('.header-count');
    var filterBar = document.querySelector('.filter-bar');
    var section   = document.querySelector('.section');
    var emptyEl   = document.querySelector('.empty-state');

    if (countEl) countEl.textContent = pluralCount(allItems.length);

    if (allItems.length === 0) {
      if (filterBar) filterBar.style.display = 'none';
      if (section)   section.style.display   = 'none';
      if (emptyEl)   emptyEl.style.display   = 'flex';
      return;
    }

    if (filterBar) filterBar.style.display = 'flex';
    if (section)   section.style.display   = 'block';
    if (emptyEl)   emptyEl.style.display   = 'none';

    buildFilters(allItems);
    renderCards(filtered);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

})();
