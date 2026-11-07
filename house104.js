/* Pass 104 · shared, non-destructive Admin primitives.
   No member outcome, payment, progress or reward is created here. */
(function () {
  'use strict';
  if (window.IVHOUSE104) return;

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function toast(message, bad) {
    if (window.ivoryToast) window.ivoryToast(String(message || ''), !!bad);
  }
  function api(path, body) {
    if (!window.IVSESS) return Promise.reject(new Error('Sign in as the house first.'));
    return IVSESS.call(path, body == null ? {} : body);
  }
  function get(path) {
    if (!window.IVSESS) return Promise.reject(new Error('Sign in as the house first.'));
    return IVSESS.get(path);
  }
  function patch(path, body) {
    if (!window.IVSESS) return Promise.reject(new Error('Sign in as the house first.'));
    return IVSESS.call(path, body, { method: 'PATCH', extra: { Prefer: 'return=minimal' } });
  }
  function bytes(value) {
    var n = Number(value);
    if (!isFinite(n) || n < 0) return 'size unmeasured';
    if (n < 1024) return Math.round(n) + ' B';
    if (n < 1048576) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' KB';
    if (n < 1073741824) return (n / 1048576).toFixed(1) + ' MB';
    return (n / 1073741824).toFixed(2) + ' GB';
  }
  function date(value) {
    if (!value) return 'banked before the vault';
    var d = new Date(value);
    if (isNaN(d.getTime())) return 'banked before the vault';
    try {
      return 'banked ' + d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return 'banked before the vault'; }
  }
  function icon(name, filled) {
    var paths = {
      story: '<path d="M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M8 4.5V17a3 3 0 0 0-3 3M9 9h5M9 12h5"/>',
      audio: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v6H5a1 1 0 0 1-1-1zM20 14h-3v6h2a1 1 0 0 0 1-1z"/>',
      video: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
      image: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="M4 17l5-5 3.5 3 2.5-2.5 5 4.5"/>',
      poll: '<path d="M9 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M8 13l2.5 2.5L16 10"/>',
      edit: '<path d="M4 20l1-4L16 5a2.1 2.1 0 0 1 3 3L8 19zM14 7l3 3"/>',
      star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
      up: '<path d="M6 15l6-6 6 6"/>', down: '<path d="M6 9l6 6 6-6"/>',
      delete: '<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
      refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M18.5 12a7 7 0 0 0-12-4.8L4 10M5.5 12a7 7 0 0 0 12 4.8L20 14"/>',
      groups: '<circle cx="9" cy="9" r="3"/><path d="M3.5 20c.5-4 2.5-6 5.5-6s5 2 5.5 6M15 6a3 3 0 0 1 0 6M17 14c2 .5 3.2 2.5 3.5 5"/>',
      person: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.7-4.5 3.2-6.5 7.5-6.5s6.8 2 7.5 6.5"/>',
      mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
      attach: '<path d="M8 12l7-7a4 4 0 0 1 6 6l-9 9a5 5 0 0 1-7-7l8-8" transform="translate(1 0) scale(.9)"/>',
      send: '<path d="M3 11l17-8-7 18-2-7zM11 14l9-11"/>',
      check: '<path d="M5 12l4 4L19 6"/>',
      history: '<path d="M4 5v5h5M4.8 10a8 8 0 1 1 .8 7"/><path d="M12 7v5l3 2"/>',
      gift: '<rect x="4" y="10" width="16" height="10" rx="1"/><path d="M3 7h18v3H3zM12 7v13M12 7c-2-4-6-4-6-1s4 1 6 1c2-4 6-4 6-1s-4 1-6 1z"/>',
      live: '<circle cx="12" cy="12" r="2"/><path d="M8 8a6 6 0 0 0 0 8M16 8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>',
      sparkle: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
      upload: '<path d="M12 16V4M7 9l5-5 5 5M4 15v5h16v-5"/>',
      link: '<path d="M10 14l4-4M8 16l-1 1a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0M14 8l1-1a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" transform="translate(1 0)"/>',
      crown: '<path d="M4 8l4 4 4-7 4 7 4-4-2 11H6zM6 19h12"/>',
      phone: '<path d="M7 3l3 4-2 2a14 14 0 0 0 7 7l2-2 4 3-1 3c-1 2-4 1-7 0A17 17 0 0 1 4 10c-1-3-2-6 0-7z"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
    };
    return '<svg class="n105-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="' + (filled ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (paths[name] || paths.sparkle) + '</svg>';
  }
  function contentChanged() {
    window.dispatchEvent(new CustomEvent('iv-content-changed'));
  }
  function sourceForLink(input) {
    var s = String(input || '').trim(), m;
    if (!s) return { source: 'none', ref: null };
    m = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (m) return { source: 'youtube', ref: m[1] };
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return { source: 'youtube', ref: s };
    m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return { source: 'vimeo', ref: m[1] };
    m = s.match(/dailymotion\.com\/video\/([A-Za-z0-9]+)/);
    if (m) return { source: 'dailymotion', ref: m[1] };
    m = s.match(/t\.me\/c\/(\d+)\/(\d+)/);
    if (m) return { source: 'telegram_channel', ref: m[1] + ':' + m[2] };
    if (s.indexOf('t.me/') >= 0) return { source: 'telegram_channel', ref: s };
    if (/^https?:\/\//i.test(s)) {
      if (s.indexOf('.r2.dev') >= 0 || s.indexOf('r2.cloudflarestorage.com') >= 0) return { source: 'r2', ref: s };
      if (s.indexOf('/storage/v1/object/public/') >= 0) return { source: 'supabase', ref: s };
      return { source: 'direct', ref: s };
    }
    return { source: 'supabase', ref: s };
  }

  /* The frozen native Firstlist algorithm: lift only the changed suffix,
     then let set_firstlist append it in the new order. Postgres retains
     ownership of the 25-place cap and all pin_rank values. */
  function reorderPlan(order, id, newPosition) {
    var old = (order || []).map(Number);
    id = Number(id);
    if (old.indexOf(id) < 0) throw new Error('That post is not on the Firstlist.');
    var next = old.filter(function (x) { return x !== id; });
    var pos = Math.max(0, Math.min(next.length, Number(newPosition) || 0));
    next.splice(pos, 0, id);
    var first = 0;
    while (first < old.length && old[first] === next[first]) first++;
    return { old: old, next: next, first: first, suffix: next.slice(first), changed: first < old.length };
  }

  var veilSeq = 0;
  function sheet(options) {
    options = options || {};
    var oldFocus = document.activeElement;
    var veil = document.createElement('div');
    var box = document.createElement('section');
    var id = 'p104-dialog-' + (++veilSeq);
    veil.className = 'p104-veil';
    box.className = 'p104-sheet ' + (options.className || '');
    box.id = id;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', id + '-title');
    box.tabIndex = -1;
    box.innerHTML = '<div class="p104-grab" aria-hidden="true"></div>' +
      '<div class="p104-sheet-head"><div><p class="p104-kick" id="' + id + '-title">' + esc(options.title || 'The house') + '</p>' +
      (options.lede ? '<p class="p104-lede">' + esc(options.lede) + '</p>' : '') + '</div>' +
      '<button type="button" class="p104-icon" data-p104-close aria-label="Close">×</button></div>' +
      '<div class="p104-sheet-body"></div>';
    box.querySelector('.p104-sheet-body').innerHTML = options.html || '';
    veil.appendChild(box);
    document.body.appendChild(veil);
    var closed = false, busy = false;
    function close(force) {
      if (closed || (busy && !force)) return;
      closed = true;
      document.removeEventListener('keydown', keys);
      veil.classList.remove('on');
      setTimeout(function () { if (veil.parentNode) veil.parentNode.removeChild(veil); }, 180);
      if (oldFocus && oldFocus.isConnected) {
        try { oldFocus.focus({ preventScroll: true }); } catch (e) { try { oldFocus.focus(); } catch (_) {} }
      }
    }
    function keys(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(false); return; }
      if (e.key !== 'Tab') return;
      var items = Array.prototype.slice.call(box.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex="0"]'))
        .filter(function (x) { return x.offsetParent !== null; });
      if (!items.length) { e.preventDefault(); box.focus(); return; }
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    veil.addEventListener('click', function (e) { if (e.target === veil) close(false); });
    box.querySelector('[data-p104-close]').addEventListener('click', function () { close(false); });
    document.addEventListener('keydown', keys);
    requestAnimationFrame(function () { veil.classList.add('on'); });
    setTimeout(function () {
      /* A slow WebKit frame may arrive after the user has already started
         typing or moved to the second field. Never steal that focus back. */
      if (box.contains(document.activeElement) && document.activeElement !== box) return;
      var focus = box.querySelector('[autofocus],input,select,textarea,button:not([data-p104-close])');
      try { (focus || box).focus({ preventScroll: true }); } catch (e) { (focus || box).focus(); }
    }, 30);
    return {
      veil: veil, el: box, body: box.querySelector('.p104-sheet-body'), close: close,
      setBusy: function (value) {
        busy = !!value;
        box.classList.toggle('is-busy', busy);
        Array.prototype.forEach.call(box.querySelectorAll('button,input,select,textarea'), function (x) {
          if (x.hasAttribute('data-p104-keep-enabled')) return;
          x.disabled = busy;
        });
      }
    };
  }
  function confirm(options) {
    options = options || {};
    var d = sheet({
      title: options.title || 'Are you sure?', lede: options.lede || '', className: 'p104-confirm',
      html: '<div class="p104-actions"><button type="button" class="p104-btn danger" data-yes>' + esc(options.action || 'CONFIRM') + '</button>' +
        '<button type="button" class="p104-btn quiet" data-no>' + esc(options.cancel || 'KEEP IT') + '</button></div><p class="p104-state" aria-live="polite"></p>'
    });
    d.body.querySelector('[data-no]').addEventListener('click', function () { d.close(false); });
    d.body.querySelector('[data-yes]').addEventListener('click', function () {
      if (!options.onConfirm) { d.close(false); return; }
      d.setBusy(true);
      Promise.resolve(options.onConfirm(d)).then(function (ok) {
        if (ok !== false && d.veil.isConnected) d.close(true);
      }).catch(function (e) {
        d.setBusy(false);
        var s = d.body.querySelector('.p104-state');
        if (s) s.textContent = (e && e.message) || 'The house refused.';
      });
    });
    return d;
  }

  window.IVHOUSE104 = {
    esc: esc, toast: toast, api: api, get: get, patch: patch, bytes: bytes, date: date, icon: icon,
    contentChanged: contentChanged, sourceForLink: sourceForLink, reorderPlan: reorderPlan,
    sheet: sheet, confirm: confirm
  };
})();
