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
    esc: esc, toast: toast, api: api, get: get, patch: patch, bytes: bytes, date: date,
    contentChanged: contentChanged, sourceForLink: sourceForLink, reorderPlan: reorderPlan,
    sheet: sheet, confirm: confirm
  };
})();
