/* Pass 104 · Admin Wheel of Fans, traced from the frozen native spoke. */
(function () {
  'use strict';
  if (!window.IVROOMS || window.IVWHEEL104) return;
  var H = window.IVHOUSE104, B = window.IVBANK104, R = window.IVR;
  var COLORS = ['#D9A62E', '#C96586', '#D47C35', '#B9AE9D', '#5B9B72', '#8C73B4', '#B65D55', '#C16B8C', '#AAA091', '#9D5874', '#B9944A', '#C77B58'];

  window.IVROOMS.wheel = function (pane) {
    var S = { rep: null, busy: false, seq: 0, message: '', bad: false };
    pane.innerHTML = R.head('The wheel', 'Its face is the <em>weights.</em>',
      'The native Wheel room: dials, server-locked hours, wishes, its three banks and petals owed. ' +
      'The server alone draws every member prize.') + '<div class="w104" id="w104"><div class="p104-loading">Reading the Wheel…</div></div>';
    var root = pane.querySelector('#w104');

    function rows(name) { return S.rep && Array.isArray(S.rep[name]) ? S.rep[name] : []; }
    function clone(v) { return JSON.parse(JSON.stringify(v || {})); }
    function busy(value, message) {
      S.busy = !!value;
      root.classList.toggle('is-busy', S.busy);
      Array.prototype.forEach.call(root.querySelectorAll('button,input,select,textarea'), function (b) { b.disabled = S.busy; });
      if (message != null) { S.message = message; S.bad = false; }
      var m = root.querySelector('[data-wheel-message]');
      if (m && message != null) { m.textContent = S.message; m.classList.toggle('bad', !!S.bad); }
    }
    function say(message, bad) {
      S.message = message; S.bad = !!bad;
      var m = root.querySelector('[data-wheel-message]');
      if (m) { m.textContent = message; m.classList.toggle('bad', !!bad); }
      H.toast(message, bad);
    }
    function result(r, fallback) {
      if (!r || r.ok !== true) throw new Error((r && (r.why || r.error)) || fallback || 'The desk refused.');
      return r;
    }
    function load() {
      var seq = ++S.seq;
      if (!R.signed()) { root.innerHTML = R.miss(); return Promise.resolve(null); }
      return H.api('/rest/v1/rpc/wheel_admin_report', {}).then(function (rep) {
        if (seq !== S.seq || !root.isConnected) return null;
        S.rep = rep || {};
        S.weights = rows('weights').map(clone);
        S.windows = rows('windows').map(clone);
        paint();
        return rep;
      }).catch(function (e) {
        if (seq !== S.seq || !root.isConnected) return null;
        root.innerHTML = '<div class="p104-error-card"><b>The Wheel report did not open.</b><p>' + H.esc((e && e.message) || 'The desk refused.') + '</p>' +
          '<button type="button" class="p104-btn" data-action="retry">TRY AGAIN</button></div>';
        return null;
      });
    }
    function refresh(message) {
      return load().then(function () { if (message) say(message, false); });
    }
    function face() {
      var enabled = (S.weights || []).filter(function (w) { return w.enabled !== false && Number(w.weight) > 0; });
      var total = enabled.reduce(function (n, w) { return n + Number(w.weight); }, 0);
      if (!total) return '<svg class="w104-face" viewBox="0 0 240 240" aria-label="No enabled Wheel slices"><circle cx="120" cy="120" r="104" class="w104-empty"/></svg>';
      var angle = -Math.PI / 2, paths = [];
      enabled.forEach(function (w) {
        var original = (S.weights || []).indexOf(w);
        var span = Number(w.weight) / total * Math.PI * 2, end = angle + span;
        var x0 = 120 + 104 * Math.cos(angle), y0 = 120 + 104 * Math.sin(angle);
        var x1 = 120 + 104 * Math.cos(end), y1 = 120 + 104 * Math.sin(end);
        paths.push('<path d="M120 120L' + x0.toFixed(2) + ' ' + y0.toFixed(2) + 'A104 104 0 ' + (span > Math.PI ? 1 : 0) + ' 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + 'Z" fill="' + COLORS[original % COLORS.length] + '"/>');
        angle = end;
      });
      return '<svg class="w104-face" viewBox="0 0 240 240" aria-label="Weighted member Wheel"><circle cx="120" cy="120" r="107" class="w104-rim"/>' + paths.join('') + '<circle cx="120" cy="120" r="20" class="w104-hub"/></svg>';
    }
    function head(title, sub, id) {
      return '<div class="w104-head"><div><h2' + (id ? ' id="' + id + '" tabindex="-1"' : '') + '>' + H.esc(title) + '</h2>' + (sub ? '<p>' + H.esc(sub) + '</p>' : '') + '</div></div>';
    }
    function bankTotals() {
      var voices = rows('voices'), images = rows('images'), words = rows('words');
      function measured(list) { return list.reduce(function (n, r) { return n + (typeof r.bytes === 'number' ? r.bytes : 0); }, 0); }
      function unmeasured(list) { return list.filter(function (r) { return typeof r.bytes !== 'number'; }).length; }
      return '<section class="w104-total"><p>WHAT THE BANKS HOLD</p><div class="w104-total-grid">' +
        '<span><b>' + words.length + '</b> words</span>' +
        '<span><b>' + voices.length + '</b> voices · ' + H.bytes(measured(voices)) + (unmeasured(voices) ? ' · ' + unmeasured(voices) + ' unmeasured' : '') + '</span>' +
        '<span><b>' + images.length + '</b> images · ' + H.bytes(measured(images)) + (unmeasured(images) ? ' · ' + unmeasured(images) + ' unmeasured' : '') + '</span>' +
        '</div><small>Files banked before the vault keep their honest “size unmeasured” label. The Wheel does not guess.</small></section>';
    }
    function odds() {
      var total = (S.weights || []).reduce(function (n, w) { return n + (w.enabled !== false ? Number(w.weight) || 0 : 0); }, 0) || 1;
      return '<section class="w104-section">' + head('ODDS DIALS', 'weights, not promises; members see rupees only') +
        '<div class="w104-weights">' + (S.weights || []).map(function (w, i) {
          var on = w.enabled !== false, share = on ? (Number(w.weight) || 0) / total * 100 : 0;
          return '<div class="w104-weight' + (on ? '' : ' off') + '"><span class="w104-dot" style="--slice:' + COLORS[i % COLORS.length] + '"></span>' +
            '<div class="w104-weight-name"><b>' + H.esc(w.label || w.word || 'A fortune') + '</b><small>' + H.esc(w.kind || '') + ' · ' + share.toFixed(1) + '%</small></div>' +
            '<div class="w104-step"><button type="button" data-action="weight-down" data-i="' + i + '" aria-label="Reduce weight by 10">−</button><b>' + Number(w.weight || 0) + '</b><button type="button" data-action="weight-up" data-i="' + i + '" aria-label="Increase weight by 10">+</button></div>' +
            '<button type="button" class="p104-chip' + (on ? ' on' : '') + '" data-action="weight-toggle" data-i="' + i + '">' + (on ? 'IN' : 'OUT') + '</button></div>';
        }).join('') + '</div><button type="button" class="p104-btn" data-action="save-weights">SAVE THE DIALS</button></section>';
    }
    function hours() {
      return '<section class="w104-section">' + head('THE HOURS', 'IST, server-locked') + '<div class="w104-windows">' +
        (S.windows || []).map(function (w, i) {
          var active = w.active === true;
          return '<div class="w104-window' + (active ? '' : ' off') + '"><div class="w104-window-title"><b>' + H.esc(w.name || w.title || w.label || 'Gilded Hour') + '</b><small>' + (Number(w.boost || 1) > 1 ? 'doubled rupees' : 'declared hour') + '</small></div>' +
            '<label>OPEN<input type="time" data-window-open="' + i + '" value="' + H.esc(String(w.open || '').slice(0, 5)) + '"></label>' +
            '<label>CLOSE<input type="time" data-window-close="' + i + '" value="' + H.esc(String(w.close || '').slice(0, 5)) + '"></label>' +
            '<button type="button" class="p104-chip' + (active ? ' on' : '') + '" data-action="window-toggle" data-i="' + i + '">' + (active ? 'ACTIVE' : 'RESTING') + '</button></div>';
        }).join('') + '</div><button type="button" class="p104-btn" data-action="save-windows">SAVE THE HOURS</button></section>';
    }
    function wishes() {
      var list = rows('open_wishes');
      return '<section class="w104-section">' + head('THE WISH QUEUE', 'letters, moments, ticker names') +
        (!list.length ? '<p class="p104-empty">Nothing owed. The house is square.</p>' : '<div class="w104-debts">' + list.map(function (w) {
          var age = Number(w.age) || 0;
          return '<div class="w104-debt age-' + Math.min(6, age) + '"><div><b>' + H.esc(w.kind || 'wish') + ' · due ' + H.esc(w.by || '—') + '</b><small>member ' + H.esc(String(w.uid || '').slice(0, 8)) + ' · day ' + age + '</small></div>' +
            '<button type="button" class="p104-chip" data-action="deliver" data-id="' + H.esc(w.id) + '">DELIVERED</button></div>';
        }).join('') + '</div>') + '</section>';
    }
    function words() {
      var list = rows('words');
      return '<section class="w104-section" id="w104-words">' + head('THE WORD BANK', 'reword, cull or grow') +
        '<div class="w104-words">' + (list.length ? list.map(function (w) {
          var on = w.enabled === true;
          return '<article class="w104-word' + (on ? '' : ' off') + '"><div><b>' + H.esc(w.word || '') + '</b><p>' + H.esc(w.line || '') + '</p><small>given ' + Number(w.uses || 0) + '</small></div>' +
            '<div class="p104-actions"><button type="button" class="p104-chip' + (on ? ' on' : '') + '" data-action="word-toggle" data-id="' + H.esc(w.id) + '">' + (on ? 'REST' : 'ENABLE') + '</button>' +
            '<button type="button" class="p104-chip" data-action="word-edit" data-id="' + H.esc(w.id) + '">REWORD</button>' +
            '<button type="button" class="p104-chip" data-action="word-cull" data-id="' + H.esc(w.id) + '">CULL</button></div></article>';
        }).join('') : '<p class="p104-empty">No words banked yet.</p>') + '</div><button type="button" class="p104-btn quiet" data-action="word-add">ADD A WORD</button></section>';
    }
    function media(kind) {
      var voice = kind === 'voice', list = rows(voice ? 'voices' : 'images');
      var enabled = list.filter(function (r) { return r.enabled === true; }).length;
      var given = list.reduce(function (n, r) { return n + (Number(r.uses) || 0); }, 0);
      return '<section class="w104-section w104-bank" data-bank-section="' + kind + '">' +
        head(voice ? 'VOICES' : 'IMAGES', list.length + ' in bank · ' + enabled + ' enabled · given ' + given + ' time' + (given === 1 ? '' : 's') + ' · uploaded once, delivered in its own time') +
        '<div class="' + (voice ? 'w104-voices' : 'w104-images') + '">' + (list.length ? list.map(function (r) {
          var on = r.enabled === true, name = r.title && r.title !== (voice ? 'A voice from Ivory' : 'An image from Ivory') ? r.title : (r.fname || r.title || 'untitled');
          return '<article class="w104-media' + (on ? '' : ' off') + '" data-media-row="' + kind + ':' + H.esc(r.id) + '">' +
            '<button type="button" class="w104-media-open" data-action="media-open" data-kind="' + kind + '" data-id="' + H.esc(r.id) + '" aria-label="Open ' + H.esc(name) + '">' +
            (voice ? '<span class="w104-voice-mark">▶</span>' : '<span class="w104-image-mark" data-image-art="' + H.esc(r.id) + '">IMAGE</span>') +
            '<span class="w104-media-name">' + H.esc(name) + '</span></button>' +
            '<div class="w104-media-meta"><span>' + (typeof r.bytes === 'number' ? H.bytes(r.bytes) : 'size unmeasured') + ' · given ' + Number(r.uses || 0) + '</span><small>' + H.esc(H.date(r.added_at)) + '</small></div>' +
            '<div class="p104-actions"><button type="button" class="p104-chip' + (on ? ' on' : '') + '" data-action="media-toggle" data-kind="' + kind + '" data-id="' + H.esc(r.id) + '">' + (on ? 'REST' : 'ENABLE') + '</button>' +
            '<button type="button" class="p104-chip" data-action="media-rename" data-kind="' + kind + '" data-id="' + H.esc(r.id) + '">RENAME</button>' +
            '<button type="button" class="p104-chip" data-action="media-cull" data-kind="' + kind + '" data-id="' + H.esc(r.id) + '">CULL</button></div></article>';
        }).join('') : '<p class="p104-empty">Nothing banked yet. Upload from this Wheel spoke.</p>') + '</div>' +
        '<button type="button" class="p104-btn quiet" data-action="media-upload" data-kind="' + kind + '">' + (voice ? 'UPLOAD A VOICE' : 'UPLOAD AN IMAGE') + '</button><p class="p104-hint">pick as many as you like</p></section>';
    }
    function petals() {
      var list = rows('petals_owed');
      return '<section class="w104-section">' + head('PETALS OWED', 'unspent fortunes; place them from REWARDS') +
        (!list.length ? '<p class="p104-empty">No petals owed.</p>' : list.map(function (p) {
          return '<div class="w104-petal"><span>member ' + H.esc(String(p.uid || '').slice(0, 8)) + '</span><b>' + Number(p.petals || 0) + ' petal(s)</b></div>';
        }).join('')) + '</section>';
    }
    function paint() {
      if (!S.rep) return;
      root.innerHTML = '<p class="p104-state' + (S.bad ? ' bad' : '') + '" data-wheel-message aria-live="polite">' + H.esc(S.message) + '</p>' +
        '<button type="button" class="w104-vault-link" data-action="bank-vault">BANK VAULT</button>' +
        '<div class="w104-today"><div>' + face() + '<p>the wheel as members see it</p></div><div><h2>TODAY</h2><b>' + Number(S.rep.today_spins || 0) + ' turns</b><span>₹' + Number(S.rep.today_rupees || 0) + ' given</span></div></div>' +
        odds() + hours() + wishes() +
        '<div id="w104-banks" class="w104-banks"><div class="w104-bank-heading"><h2 tabindex="-1">THE BANK VAULT</h2><p>Image, Word and Voice Banks belong to the Wheel. They do not borrow the Vault screen.</p></div>' +
        bankTotals() + '<details class="w104-promise"><summary>Exact member announcement</summary><p>Image and voice: “… is yours; find it in your inbox.” Letter: “It reaches you within seven days — the house keeps its promises on a clock.” Moment: “A live moment with your name on it, within seven days.”</p></details></div>' +
        words() + media('voice') + media('image') + petals();
      hydrateImages();
    }
    function find(kind, id) {
      var name = kind === 'word' ? 'words' : kind === 'voice' ? 'voices' : 'images';
      return rows(name).filter(function (r) { return String(r.id) === String(id); })[0] || null;
    }
    function hydrateImages() {
      var seq = S.seq;
      rows('images').slice(0, 40).forEach(function (r) {
        var host = root.querySelector('[data-image-art="' + String(r.id).replace(/"/g, '') + '"]');
        if (!host) return;
        B.open(r).then(function (url) {
          if (seq !== S.seq || !host.isConnected) return;
          var img = new Image(); img.alt = ''; img.src = url;
          img.onload = function () { if (host.isConnected) { host.innerHTML = ''; host.appendChild(img); host.classList.add('ready'); } };
          img.onerror = function () { if (host.isConnected) { host.textContent = '!'; host.classList.add('jammed'); host.title = 'The signed address loaded, but the picture bytes did not.'; } };
        }).catch(function (e) {
          if (host.isConnected) { host.textContent = '!'; host.classList.add('jammed'); host.title = (e && e.message) || 'The file could not be signed.'; }
        });
      });
    }
    function saveWeights(message) {
      var payload = (S.weights || []).map(function (w) { return { id: w.id, weight: Math.max(0, Number(w.weight) || 0), enabled: w.enabled !== false }; });
      busy(true, 'Writing the dials…');
      return H.api('/rest/v1/rpc/wheel_weights_set', { payload: payload }).then(function (r) { result(r, 'The dials were refused.'); busy(false); return refresh(message || 'The dials are set.'); })
        .catch(function (e) { busy(false); say((e && e.message) || 'The dials were refused.', true); });
    }
    function saveWindows() {
      var payload = (S.windows || []).map(function (w) {
        return { id: w.id, open: w.open, close: w.close, boost: w.boost == null ? 1 : w.boost, active: w.active === true };
      });
      busy(true, 'Writing the hours…');
      return H.api('/rest/v1/rpc/wheel_window_set', { payload: payload }).then(function (r) { result(r, 'The hours were refused.'); busy(false); return refresh('The hours are set.'); })
        .catch(function (e) { busy(false); say((e && e.message) || 'The hours were refused.', true); });
    }
    function wordSheet(row) {
      var editing = !!row;
      var d = H.sheet({ title: editing ? 'REWORD' : 'A NEW WORD', lede: 'The word and its line travel together.',
        html: '<label class="p104-label">word<input class="p104-input" data-word maxlength="160" value="' + H.esc(row && row.word || '') + '"></label>' +
          '<label class="p104-label">its line<textarea class="p104-input" data-line rows="3" maxlength="600">' + H.esc(row && row.line || '') + '</textarea></label>' +
          '<div class="p104-actions"><button type="button" class="p104-btn" data-save>SAVE</button></div><p class="p104-state" data-state aria-live="polite"></p>' });
      d.body.querySelector('[data-save]').addEventListener('click', function () {
        var word = d.body.querySelector('[data-word]').value.trim(), line = d.body.querySelector('[data-line]').value.trim();
        if (!word || !line) { d.body.querySelector('[data-state]').textContent = 'Give both the word and its line.'; return; }
        d.setBusy(true);
        var job = editing ? B.set([{ id: row.id, kind: 'word', word: word, line: line }]) : H.api('/rest/v1/rpc/wheel_bank_add', { kind: 'word', title: word, path: line }).then(function (r) { return result(r, 'The bank refused the word.'); });
        job.then(function () { d.close(true); return refresh(editing ? 'Reworded.' : 'The bank grows.'); }).catch(function (e) { d.setBusy(false); d.body.querySelector('[data-state]').textContent = (e && e.message) || 'The bank refused.'; });
      });
    }
    function renameSheet(row, kind) {
      var d = H.sheet({ title: 'Name it plainly', lede: 'This changes the bank label, not the file or its address.',
        html: '<label class="p104-label">Bank name<input class="p104-input" data-name maxlength="120" value="' + H.esc(row.title || row.fname || '') + '"></label>' +
          '<div class="p104-actions"><button type="button" class="p104-btn" data-save>NAME IT</button></div><p class="p104-state" data-state></p>' });
      d.body.querySelector('[data-save]').addEventListener('click', function () {
        var name = d.body.querySelector('[data-name]').value.trim();
        if (!name) { d.body.querySelector('[data-state]').textContent = 'Give the bank row a name first.'; return; }
        d.setBusy(true);
        B.set([{ id: row.id, kind: kind, title: name }]).then(function () { d.close(true); return refresh('Named.'); })
          .catch(function (e) { d.setBusy(false); d.body.querySelector('[data-state]').textContent = (e && e.message) || 'The bank refused.'; });
      });
    }
    function cull(row, kind) {
      H.confirm({ title: 'Cull it from the bank?', lede: '“' + (row.title || row.word || row.fname || 'This row') + '” leaves the bank. The stored file itself is not deleted.', action: 'CULL FROM THE BANK', cancel: 'KEEP',
        onConfirm: function () { return B.drop(row.id, kind).then(function () { refresh('Culled.'); return true; }); } });
    }
    function pick(kind) {
      var input = document.createElement('input');
      input.type = 'file'; input.multiple = true;
      input.accept = kind === 'image' ? 'image/jpeg,image/png,image/webp,image/gif,image/heic' : 'audio/*,.mp3,.m4a,.aac,.wav,.ogg,.opus,.flac';
      input.addEventListener('change', function () {
        if (!input.files || !input.files.length) return;
        busy(true, 'Carrying 1/' + input.files.length + '…');
        B.upload(input.files, kind, function (p) {
          var m = root.querySelector('[data-wheel-message]');
          if (m) m.textContent = 'Carrying ' + p.current + '/' + p.total + ': ' + p.name + (p.fraction != null ? ' · ' + Math.round(p.fraction * 100) + '%' : '');
        }).then(function (r) {
          busy(false);
          var message = r.failed ? r.done + ' banked, ' + r.failed + ' refused. ' + r.errors.join(' ') : r.done + ' banked.';
          refresh(message);
        }).catch(function (e) { busy(false); say((e && e.message) || 'The upload failed.', true); });
      });
      input.click();
    }

    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-window-open')) S.windows[Number(t.getAttribute('data-window-open'))].open = t.value;
      if (t.hasAttribute('data-window-close')) S.windows[Number(t.getAttribute('data-window-close'))].close = t.value;
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-action]');
      if (!b || S.busy) return;
      var action = b.getAttribute('data-action'), i = Number(b.getAttribute('data-i')), id = b.getAttribute('data-id'), kind = b.getAttribute('data-kind');
      if (action === 'retry') { load(); return; }
      if (action === 'bank-vault') { var h = root.querySelector('.w104-bank-heading h2'); if (h) { h.scrollIntoView({ block: 'start', behavior: 'smooth' }); h.focus({ preventScroll: true }); } return; }
      if (action === 'weight-down' || action === 'weight-up') {
        var w = S.weights[i]; w.weight = Math.max(0, (Number(w.weight) || 0) + (action === 'weight-up' ? 10 : -10)); paint(); return;
      }
      if (action === 'weight-toggle') { S.weights[i].enabled = S.weights[i].enabled === false; saveWeights('The dials are set.'); return; }
      if (action === 'save-weights') { saveWeights(); return; }
      if (action === 'window-toggle') { S.windows[i].active = S.windows[i].active !== true; saveWindows(); return; }
      if (action === 'save-windows') { saveWindows(); return; }
      if (action === 'deliver') {
        busy(true, 'Marking it delivered…');
        H.api('/rest/v1/rpc/wheel_wish_deliver', { wid: Number(id) }).then(function (r) { result(r, 'The queue refused.'); busy(false); return refresh('Delivered. The queue shortens.'); })
          .catch(function (x) { busy(false); say((x && x.message) || 'The queue refused.', true); }); return;
      }
      if (action === 'word-add') { wordSheet(null); return; }
      if (action === 'word-edit') { wordSheet(find('word', id)); return; }
      if (action === 'word-cull') { cull(find('word', id), 'word'); return; }
      if (action === 'word-toggle') {
        var word = find('word', id); busy(true, 'Setting the word…');
        B.set([{ id: word.id, kind: 'word', enabled: word.enabled !== true }]).then(function () { busy(false); return refresh('The bank is set.'); }).catch(function (x) { busy(false); say(x.message, true); }); return;
      }
      if (action === 'media-open') { B.viewer(find(kind, id), kind); return; }
      if (action === 'media-rename') { renameSheet(find(kind, id), kind); return; }
      if (action === 'media-cull') { cull(find(kind, id), kind); return; }
      if (action === 'media-upload') { pick(kind); return; }
      if (action === 'media-toggle') {
        var row = find(kind, id); busy(true, 'Setting the bank…');
        B.set([{ id: row.id, kind: kind, enabled: row.enabled !== true }]).then(function () { busy(false); return refresh(row.enabled === true ? 'Resting.' : 'Back in the bank.'); })
          .catch(function (x) { busy(false); say((x && x.message) || 'The bank refused.', true); });
      }
    });
    load();
  };
  window.IVWHEEL104 = true;
})();
