/* Pass 104 · complete Admin Create library, native editor and 25-place Firstlist. */
(function () {
  'use strict';
  if (!window.IVROOMS || window.IVSTUDIO104) return;
  var H = window.IVHOUSE104, R = window.IVR;
  var LABEL = { blog: 'STORY', poll: 'POLL', image: 'PHOTO', audio: 'AUDIO', video: 'VIDEO' };

  function fetchLibrary() {
    var all = [];
    /* Unique-id keyset pages have no post ceiling and cannot drift when a new
       post is published halfway through a long read. */
    function page(cursor) {
      var path = '/rest/v1/admin_posts?select=*&order=id.desc&limit=200';
      if (cursor != null) path += '&id=lt.' + encodeURIComponent(String(cursor));
      return H.get(path).then(function (rows) {
        rows = Array.isArray(rows) ? rows : [];
        all = all.concat(rows);
        if (rows.length < 200) return all;
        var last = rows[rows.length - 1] || {};
        var next = last.id;
        if (next == null || String(next).trim() === '' || String(next) === String(cursor)) {
          throw new Error('The Library returned an invalid pagination cursor. No posts were changed.');
        }
        return page(next);
      });
    }
    return page(null);
  }
  function setFirst(id, on) { return H.api('/rest/v1/rpc/set_firstlist', { post_id_in: Number(id), pinned_in: !!on }); }
  function ordinal(n) { return n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : n + 'th'; }

  function mount(host) {
    var S = { posts: null, order: [], seq: 0, busy: false, q: '', type: 'all', state: 'all', firstOnly: false, message: '', bad: false };
    host.className = 'p104-studio c105-library-native';
    host.setAttribute('data-pass104-library', '1');
    host.innerHTML = '<div class="p104-lib-head"><div><p class="p104-kick">THE LIBRARY</p></div>' +
      '<button type="button" class="p104-icon" data-action="refresh" aria-label="Refresh the library">' + H.icon('refresh') + '</button></div>' +
      '<p class="p104-state" data-lib-state aria-live="polite"></p>' +
      '<details class="c105-library-tools"><summary>FILTER & SEARCH <span>website controls</span></summary><div class="p104-lib-tools"><label>Find a post<input class="p104-input" data-search placeholder="Title, summary or post number"></label>' +
      '<div class="p104-filters" data-type-filters>' + ['all', 'blog', 'image', 'audio', 'video', 'poll'].map(function (k) { return '<button type="button" class="p104-chip' + (k === 'all' ? ' on' : '') + '" data-action="filter-type" data-value="' + k + '">' + (k === 'all' ? 'ALL' : LABEL[k]) + '</button>'; }).join('') + '</div>' +
      '<div class="p104-filters"><button type="button" class="p104-chip on" data-action="filter-state" data-value="all">LIVE + DRAFT</button><button type="button" class="p104-chip" data-action="filter-state" data-value="live">LIVE</button><button type="button" class="p104-chip" data-action="filter-state" data-value="draft">DRAFT</button><button type="button" class="p104-chip" data-action="filter-first">FIRSTLIST ONLY</button></div></div></details>' +
      '<div class="p104-lib-list" data-library><div class="p104-loading">Opening the complete library…</div></div><div data-firstlist></div>';

    function say(message, bad) {
      S.message = message || ''; S.bad = !!bad;
      var n = host.querySelector('[data-lib-state]');
      if (n) { n.textContent = S.message; n.classList.toggle('bad', S.bad); }
      if (message) H.toast(message, bad);
    }
    function setBusy(value, message) {
      S.busy = !!value;
      host.classList.toggle('is-busy', S.busy);
      host.setAttribute('aria-busy', S.busy ? 'true' : 'false');
      if (message) {
        var n = host.querySelector('[data-lib-state]'); if (n) { n.textContent = message; n.classList.remove('bad'); }
      }
    }
    function post(id) { return (S.posts || []).filter(function (p) { return Number(p.id) === Number(id); })[0] || null; }
    function title(id) { var p = post(id); return p ? (p.title || 'Untitled') : 'Post ' + id; }
    function load(quiet) {
      var seq = ++S.seq;
      if (!quiet) setBusy(true, 'Opening the complete library…');
      return Promise.all([
        fetchLibrary(),
        H.get('/rest/v1/post_previews?select=id,pin_rank&pin_rank=gt.0&order=pin_rank.asc&limit=25')
      ]).then(function (r) {
        if (seq !== S.seq || !host.isConnected) return false;
        S.posts = r[0] || [];
        S.order = (Array.isArray(r[1]) ? r[1] : []).map(function (p) { return Number(p.id); }).filter(function (id) { return id > 0; }).slice(0, 25);
        setBusy(false); paintSlots(); paintList();
        return true;
      }).catch(function (e) {
        if (seq !== S.seq || !host.isConnected) return false;
        setBusy(false);
        host.querySelector('[data-library]').innerHTML = '<div class="p104-error-card"><b>The library did not open whole.</b><p>' + H.esc((e && e.message) || 'The house refused.') + '</p><p>No half-read post has been sent to the editor.</p><button type="button" class="p104-btn" data-action="refresh">TRY AGAIN</button></div>';
        return false;
      });
    }
    function notifyContent() {
      S.ownContentEvent = true;
      try { H.contentChanged(); } finally { S.ownContentEvent = false; }
    }
    function changed(message) {
      notifyContent();
      return load(true).then(function (ok) { if (message && ok) say(message, false); return ok; });
    }
    function paintSlots() {
      var box = host.querySelector('[data-firstlist]'); if (!box) return;
      var cards = [];
      for (var i = 0; i < 25; i++) {
        var id = S.order[i], p = id ? post(id) : null;
        cards.push('<article class="p104-slot' + (id ? ' filled' : '') + '"><span>PLACE ' + (i + 1) + '</span>' +
          (id ? '<b>' + H.esc(p ? (p.title || 'Untitled') : 'Post ' + id) + '</b><small>' + H.esc(p ? (LABEL[p.type] || 'POST') : 'PINNED POST') + '</small><button type="button" class="p104-chip on" data-action="place" data-id="' + id + '">MOVE / SWAP</button>'
                : '<b>Open place</b><small>Choose any post</small><button type="button" class="p104-chip" data-action="choose-slot" data-pos="' + i + '">CHOOSE POST</button>') + '</article>');
      }
      box.innerHTML = '<section class="p104-first c105-firstlist"><div class="p104-first-head"><div><p class="p104-kick">WEBSITE FIRSTLIST MANAGER</p><h3>IVORY’S FIRSTLIST</h3><p>Exactly 25 places · ' + S.order.length + ' filled · Home reads this same order</p></div><span>' + S.order.length + ' / 25</span></div>' +
        '<div class="p104-slot-rail" aria-label="The 25 Firstlist places">' + cards.join('') + '</div><p class="p104-hint">Tap a filled place to jump or swap. Empty places stay visible; nothing is pinned automatically.</p></section>';
    }
    function filtered() {
      var q = S.q.toLowerCase();
      return (S.posts || []).filter(function (p) {
        if (S.type !== 'all' && p.type !== S.type) return false;
        if (S.state === 'live' && p.is_published !== true) return false;
        if (S.state === 'draft' && p.is_published === true) return false;
        if (S.firstOnly && S.order.indexOf(Number(p.id)) < 0) return false;
        if (q && (String(p.title || '') + ' ' + String(p.summary || '') + ' ' + String(p.id)).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });
    }
    function access(p) {
      var price = Number(p.price_inr || p.price || 0), tier = Number(p.tier_required || 0);
      if (price > 0) return 'Paid · ₹' + Math.round(price);
      if (tier === 0) return 'Free';
      if (tier >= 9) return 'Everyone pays';
      return p.tier_name || ('Tier ' + tier);
    }
    function paintList() {
      var box = host.querySelector('[data-library]'); if (!box || !S.posts) return;
      var list = filtered();
      if (!list.length) { box.innerHTML = '<div class="p104-empty">Nothing stands under these filters.</div>'; return; }
      box.innerHTML = '<p class="p104-count">' + list.length + ' of ' + S.posts.length + ' posts · true server views, never display bloom</p>' + list.map(function (p) {
        var id = Number(p.id), pos = S.order.indexOf(id), live = p.is_published === true;
        var views = Number(p.view_count || 0), kind = p.type === 'blog' ? 'story' : (p.type === 'audio' ? 'audio' : p.type === 'video' ? 'video' : p.type === 'image' ? 'image' : 'poll');
        return '<article class="p104-post p105-post' + (live ? '' : ' draft') + '" data-post-row="' + id + '">' +
          '<span class="p105-post-type" title="' + H.esc(LABEL[p.type] || 'POST') + '">' + H.icon(kind) + '</span>' +
          '<div class="p105-post-main"><h3>' + H.esc(p.title || 'Untitled') + '</h3><p>' + (live ? 'Live' : 'Draft') + ' · ' + H.esc(access(p)) + ' · ' + views + ' view' + (views === 1 ? '' : 's') + '</p></div>' +
          '<div class="p105-post-actions">' +
          '<button type="button" class="n105-icon" data-action="edit" data-id="' + id + '" aria-label="Edit this post" title="Edit this post">' + H.icon('edit') + '</button>' +
          (pos >= 0 ? '<button type="button" class="p105-rank" data-action="place" data-id="' + id + '" aria-label="Move Firstlist place ' + (pos + 1) + '">' + (pos + 1) + '</button>' : '') +
          (pos > 0 ? '<button type="button" class="n105-icon" data-action="earlier" data-id="' + id + '" aria-label="Earlier on the Firstlist">' + H.icon('up') + '</button>' : '') +
          (pos >= 0 && pos < S.order.length - 1 ? '<button type="button" class="n105-icon" data-action="later" data-id="' + id + '" aria-label="Later on the Firstlist">' + H.icon('down') + '</button>' : '') +
          '<button type="button" class="n105-icon p105-star' + (pos >= 0 ? ' on' : '') + '" data-action="first-toggle" data-id="' + id + '" aria-label="' + (pos >= 0 ? 'On Ivory’s Firstlist - place ' + (pos + 1) : 'Add to Ivory’s Firstlist') + '">' + H.icon('star', pos >= 0) + '</button>' +
          '<button type="button" class="n105-switch' + (live ? ' on' : '') + '" data-action="publish" data-id="' + id + '" role="switch" aria-checked="' + (live ? 'true' : 'false') + '" aria-label="' + (live ? 'Hide from the feed' : 'Publish') + '"></button>' +
          '<button type="button" class="n105-icon p105-delete" data-action="delete" data-id="' + id + '" aria-label="Delete for good">' + H.icon('delete') + '</button></div></article>';
      }).join('');
    }
    function applyMove(id, newPos, quiet) {
      if (S.busy) return Promise.resolve(false);
      var plan;
      try { plan = H.reorderPlan(S.order, id, newPos); } catch (e) { say(e.message, true); return Promise.resolve(false); }
      /* Choosing the last empty slot needs no suffix writes, but the pin RPC
         still happened and the shelf/Home must still read its new state. */
      if (!plan.changed) return changed(quiet ? null : 'The Firstlist stands in its new order.');
      setBusy(true, 'Lifting only the changed Firstlist suffix…');
      var chain = Promise.resolve();
      plan.suffix.forEach(function (pid) { chain = chain.then(function () { return setFirst(pid, false); }); });
      plan.suffix.forEach(function (pid) { chain = chain.then(function () { return setFirst(pid, true); }); });
      return chain.then(function () { setBusy(false); return changed(quiet ? null : 'The Firstlist stands in its new order.'); })
        .catch(function (e) { setBusy(false); say((e && e.message) || 'The Firstlist refused. The shelf was read again so no guessed order remains.', true); return load(true).then(function () { return false; }); });
    }
    function placeSheet(id) {
      var pos = S.order.indexOf(Number(id)); if (pos < 0) return;
      var d = H.sheet({ title: 'PLACE ' + (pos + 1) + ' OF ' + S.order.length, lede: title(id),
        html: '<div class="p104-actions p104-quick">' + [1, 2, 3].map(function (n) { return '<button type="button" class="p104-btn small" data-quick="' + (n - 1) + '"' + (pos === n - 1 ? ' disabled' : '') + '>Make it ' + ordinal(n) + '</button>'; }).join('') + '</div>' +
          '<label class="p104-label">Jump to any place, 1 to ' + S.order.length + '<div class="p104-inline"><input class="p104-input" data-jump type="number" min="1" max="' + S.order.length + '" inputmode="numeric"><button type="button" class="p104-btn small" data-jump-go>JUMP</button></div></label>' +
          '<label class="p104-label">Swap places with place…<div class="p104-inline"><input class="p104-input" data-swap type="number" min="1" max="' + S.order.length + '" inputmode="numeric"><button type="button" class="p104-btn small" data-swap-go>SWAP</button></div></label>' +
          '<p class="p104-hint">One tap is enough. The members’ rail follows the same database order.</p>' });
      Array.prototype.forEach.call(d.body.querySelectorAll('[data-quick]'), function (b) { b.addEventListener('click', function () { var to = Number(b.getAttribute('data-quick')); d.close(true); applyMove(id, to, false); }); });
      d.body.querySelector('[data-jump-go]').addEventListener('click', function () {
        var to = Number(d.body.querySelector('[data-jump]').value);
        if (to < 1 || to > S.order.length) { d.body.querySelector('[data-jump]').focus(); return; }
        d.close(true); applyMove(id, to - 1, false);
      });
      d.body.querySelector('[data-swap-go]').addEventListener('click', function () {
        var to = Number(d.body.querySelector('[data-swap]').value) - 1;
        if (to < 0 || to >= S.order.length || to === pos) { d.body.querySelector('[data-swap]').focus(); return; }
        var other = S.order[to]; d.close(true);
        applyMove(id, to, true).then(function (ok) { if (!ok) return false; var now = S.order.indexOf(Number(other)); return now >= 0 ? applyMove(other, pos, false) : false; });
      });
    }
    function chooseSlot(position) {
      if (S.order.length >= 25) { say('All 25 Firstlist places are filled. Move or remove one first.', true); return; }
      var available = (S.posts || []).filter(function (p) { return S.order.indexOf(Number(p.id)) < 0; });
      var d = H.sheet({ title: 'CHOOSE PLACE ' + (position + 1), lede: 'The post is appended by the canonical RPC, then only the changed suffix is rearranged.',
        html: '<div class="p104-picker">' + (available.length ? available.map(function (p) { return '<button type="button" data-pick="' + Number(p.id) + '"><span>' + H.esc(LABEL[p.type] || 'POST') + '</span><b>' + H.esc(p.title || 'Untitled') + '</b></button>'; }).join('') : '<p class="p104-empty">Every post is already on the Firstlist.</p>') + '</div>' });
      Array.prototype.forEach.call(d.body.querySelectorAll('[data-pick]'), function (b) {
        b.addEventListener('click', function () {
          var id = Number(b.getAttribute('data-pick')); d.setBusy(true);
          setFirst(id, true).then(function () { d.close(true); S.order = S.order.concat([id]); return applyMove(id, position, false); })
            .catch(function (e) { d.setBusy(false); say((e && e.message) || 'The Firstlist is full or refused that post.', true); load(true); });
        });
      });
    }
    function toggleFirst(id) {
      if (S.busy) return;
      var pos = S.order.indexOf(Number(id));
      if (pos < 0 && S.order.length >= 25) { say('The Firstlist has exactly 25 places. Take one off before adding another.', true); return; }
      setBusy(true, pos >= 0 ? 'Taking it off the Firstlist…' : 'Adding it at the end…');
      setFirst(id, pos < 0).then(function () { setBusy(false); return changed(pos >= 0 ? 'Taken off Ivory’s Firstlist.' : 'Added to Ivory’s Firstlist.'); })
        .catch(function (e) { setBusy(false); say((e && e.message) || 'The Firstlist refused.', true); load(true); });
    }
    function railSource(got) { return got.rail === 'supabase' ? 'supabase' : (got.rail === 'r2' || got.rail === 'r2pub') ? 'r2' : 'b2'; }
    function upload(file, kind, rail) {
      if (!window.IVSTORE) return Promise.reject(new Error('The storage circuit is unavailable. The post has not been changed.'));
      var routes = {}; routes[kind] = rail;
      return IVSTORE.put(file, kind, null, { routes: routes });
    }
    function editSheet(id) {
      var d = H.sheet({ title: 'EDIT POST', lede: 'The same post ID survives. Nothing is deleted and re-created.', className: 'p104-editor', html: '<div class="p104-loading">Reading every field before the form can open…</div>' });
      Promise.all([
        H.get('/rest/v1/posts?select=id,type,title,summary,body,media_source,media_ref,thumb_source,thumb_ref,duration_secs,tier_required,is_published,price_inr,free_from_tier,door_credit,allowed_tiers&id=eq.' + Number(id)),
        H.get('/rest/v1/subscription_tiers?select=id,name,level,is_active&order=level.asc')
      ]).then(function (r) {
        var p = r[0] && r[0][0], tiers = r[1] || [];
        if (!p) throw new Error('The whole post did not arrive. Nothing has been changed.');
        if (!d.veil.isConnected) return;
        var who = Array.isArray(p.allowed_tiers) ? p.allowed_tiers.map(Number) : [];
        var live = p.is_published === true, type = p.type || 'blog';
        d.body.innerHTML = '<p class="p104-hint">' + H.esc(LABEL[type] || 'POST') + ' · post ' + Number(p.id) + ' · type and poll options stay unchanged. Live edits do not announce; a draft → live flip follows the canonical rule.</p>' +
          '<label class="p104-label">Title<input class="p104-input" data-f="title" maxlength="90" value="' + H.esc(p.title || '') + '"></label>' +
          '<label class="p104-label">Short teaser<textarea class="p104-input" data-f="summary" rows="2" maxlength="180">' + H.esc(p.summary || '') + '</textarea></label>' +
          '<label class="p104-label">The story itself<textarea class="p104-input" data-f="body" rows="7">' + H.esc(p.body || '') + '</textarea></label>' +
          (type === 'audio' || type === 'video' ? '<label class="p104-label">Length in minutes (optional)<input class="p104-input" data-f="minutes" type="number" min="0" inputmode="numeric" value="' + (p.duration_secs == null ? '' : Math.floor(Number(p.duration_secs) / 60)) + '"></label>' : '') +
          '<section class="p104-current"><h3>CURRENT FILE</h3><p>' + H.esc((p.media_source || 'none') + ' · ' + (p.media_ref || 'no media')) + '</p><small>Leave every attachment control untouched to keep it. A replaced file is never deleted.</small></section>' +
          (type !== 'poll' ? '<label class="p104-label">Replace media by upload (optional)<input class="p104-input" data-media-file type="file"></label>' +
            '<label class="p104-label">Media storage<select class="p104-input" data-media-rail><option value="b2">B2 · private</option><option value="r2">R2 · private</option>' + (type === 'image' || type === 'blog' ? '<option value="r2pub" data-public>R2 · public to anyone with the link</option>' : '') + '</select></label>' +
            '<label class="p104-label">Or point at a new link<input class="p104-input" data-f="link" placeholder="YouTube / Telegram / R2 / direct link"></label>' +
            (type !== 'image' ? '<label class="p104-label">Replace cover image (optional)<input class="p104-input" data-cover-file type="file" accept="image/*"></label><label class="p104-label">Cover storage<select class="p104-input" data-cover-rail><option value="b2">B2 · private (default)</option><option value="r2">R2 · private</option><option value="r2pub" data-public>R2 · public to anyone with the link</option></select></label>' : '') : '<p class="p104-hint">Poll options are not edited here; their votes and option IDs remain intact.</p>') +
          '<div class="p104-label">WHO CAN OPEN IT<div class="p104-filters" data-tiers>' + tiers.map(function (t) { var on = who.indexOf(Number(t.level)) >= 0; return '<button type="button" class="p104-chip' + (on ? ' on' : '') + '" data-tier="' + Number(t.level) + '" aria-pressed="' + on + '">' + H.esc(t.name) + '</button>'; }).join('') + '</div><small>No selected tier means “Nobody — all pay”, exactly as the native editor.</small></div>' +
          '<label class="p104-label">Price in rupees (optional)<input class="p104-input" data-f="price" type="number" min="0" inputmode="numeric" value="' + (Number(p.price_inr) > 0 ? Number(p.price_inr) : '') + '"></label>' +
          '<label class="p104-label">Opens free from<select class="p104-input" data-f="free"><option value="">Nobody</option>' + tiers.map(function (t) { return '<option value="' + Number(t.level) + '">' + H.esc(t.name) + '</option>'; }).join('') + '</select></label>' +
          '<label class="p104-label">Story door credit (optional)<input class="p104-input" data-f="credit" maxlength="40" value="' + H.esc(p.door_credit || '') + '"></label>' +
          '<div class="p104-segment"><button type="button" class="p104-chip' + (live ? ' on' : '') + '" data-pub="true">LIVE</button><button type="button" class="p104-chip' + (!live ? ' on' : '') + '" data-pub="false">HELD BACK</button></div>' +
          '<div class="p104-actions"><button type="button" class="p104-btn" data-save>SAVE THE SAME POST</button></div><p class="p104-state" data-edit-state aria-live="polite"></p>';
        var free = d.body.querySelector('[data-f="free"]'); if (free && p.free_from_tier != null && free.querySelector('option[value="' + Number(p.free_from_tier) + '"]')) free.value = String(Number(p.free_from_tier));
        function syncPublic() {
          Array.prototype.forEach.call(d.body.querySelectorAll('[data-public]'), function (o) { o.hidden = !live; o.disabled = !live; if (!live && o.parentNode.value === 'r2pub') o.parentNode.value = 'b2'; });
          Array.prototype.forEach.call(d.body.querySelectorAll('[data-pub]'), function (b) { var on = (b.getAttribute('data-pub') === 'true') === live; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        }
        syncPublic();
        Array.prototype.forEach.call(d.body.querySelectorAll('[data-tier]'), function (b) {
          b.addEventListener('click', function () { var level = Number(b.getAttribute('data-tier')), at = who.indexOf(level); if (at >= 0) who.splice(at, 1); else who.push(level); var on = who.indexOf(level) >= 0; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        });
        Array.prototype.forEach.call(d.body.querySelectorAll('[data-pub]'), function (b) { b.addEventListener('click', function () { live = b.getAttribute('data-pub') === 'true'; syncPublic(); }); });
        d.body.querySelector('[data-save]').addEventListener('click', function () {
          function val(name) { var n = d.body.querySelector('[data-f="' + name + '"]'); return n ? n.value : ''; }
          if (!val('title').trim()) { d.body.querySelector('[data-edit-state]').textContent = 'A title is required.'; return; }
          d.setBusy(true);
          var status = d.body.querySelector('[data-edit-state]'); status.textContent = 'Resolving attachments…';
          var mediaSource = p.media_source || 'none', mediaRef = p.media_ref || null, thumbSource = p.thumb_source || 'none', thumbRef = p.thumb_ref || null;
          var mediaFile = (d.body.querySelector('[data-media-file]') || {}).files && d.body.querySelector('[data-media-file]').files[0];
          var coverFile = (d.body.querySelector('[data-cover-file]') || {}).files && d.body.querySelector('[data-cover-file]').files[0];
          var chain = Promise.resolve();
          if (mediaFile) {
            var kind = type === 'audio' ? 'voice' : type === 'video' ? 'video' : /^audio\//.test(mediaFile.type) ? 'voice' : /^video\//.test(mediaFile.type) ? 'video' : 'image';
            var rail = d.body.querySelector('[data-media-rail]').value;
            chain = chain.then(function () { return upload(mediaFile, kind, rail); }).then(function (got) {
              mediaSource = railSource(got); mediaRef = got.url || got.key;
              if (type === 'image') { thumbSource = mediaSource; thumbRef = mediaRef; }
            });
          } else if (val('link').trim()) {
            var parsed = H.sourceForLink(val('link')); mediaSource = parsed.source; mediaRef = parsed.ref;
            if (type === 'image') { thumbSource = mediaSource; thumbRef = mediaRef; }
          }
          if (coverFile) {
            var coverRail = d.body.querySelector('[data-cover-rail]').value;
            chain = chain.then(function () { return upload(coverFile, 'image', coverRail); }).then(function (got) { thumbSource = railSource(got); thumbRef = got.url || got.key; });
          }
          chain.then(function () {
            status.textContent = 'Saving the same post…';
            var mins = val('minutes').trim(), sorted = who.slice().sort(function (a, b) { return a - b; });
            return H.api('/rest/v1/rpc/update_post', {
              post_id_in: Number(id), title_in: val('title').trim(), summary_in: val('summary'), body_in: val('body'),
              media_source_in: mediaSource, media_ref_in: mediaRef, thumb_source_in: thumbSource, thumb_ref_in: thumbRef,
              tier_required_in: sorted.length ? sorted[0] : 9, duration_secs_in: mins === '' ? null : Math.max(0, Number(mins) || 0) * 60,
              allowed_tiers_in: sorted, door_credit_in: val('credit').trim(), is_published_in: live
            }).then(function () {
              var price = Math.max(0, Number(val('price')) || 0), freeRaw = val('free'), freeFrom = freeRaw === '' ? null : Number(freeRaw);
              return H.api('/rest/v1/rpc/set_post_price', { post_id_in: Number(id), price_in: price, free_from_in: price > 0 ? freeFrom : null });
            });
          }).then(function () {
            d.close(true); notifyContent(); load(true); say(p.is_published === true || !live ? 'Saved. No already-live edit was announced. The replaced file is still in the Vault.' : 'Saved and published. The canonical draft-to-live rule was used; the replaced file is still in the Vault.', false);
          }).catch(function (e) { d.setBusy(false); status.textContent = (e && e.message) || 'Could not save. Check every field before trying again.'; load(true); });
        });
      }).catch(function (e) { if (d.veil.isConnected) d.body.innerHTML = '<div class="p104-error-card"><b>This post could not be opened, so it has not been changed.</b><p>' + H.esc((e && e.message) || 'The house refused.') + '</p></div>'; });
    }
    function publish(id) {
      var p = post(id); if (!p) return;
      setBusy(true, p.is_published === true ? 'Hiding it from the feed…' : 'Publishing through the canonical rule…');
      H.api('/rest/v1/rpc/set_post_published', { post_id_in: Number(id), value_in: p.is_published !== true }).then(function () { setBusy(false); return changed(p.is_published === true ? 'Hidden from the feed.' : 'Live now.'); })
        .catch(function (e) { setBusy(false); say((e && e.message) || 'Could not change that.', true); });
    }
    function remove(id) {
      H.confirm({ title: 'Delete this post?', lede: '“' + title(id) + '” will be removed for everyone. This cannot be undone.', action: 'DELETE', cancel: 'KEEP',
        onConfirm: function () { return H.api('/rest/v1/rpc/delete_post', { post_id_in: Number(id) }).then(function () { notifyContent(); load(true); say('Deleted.', false); return true; }); } });
    }

    host.__ivStudio = {
      reload: load,
      open: function (id) {
        return load(true).then(function (ok) {
          if (!ok || !post(id)) return false;
          editSheet(Number(id));
          var row = host.querySelector('[data-post-row="' + Number(id) + '"]');
          if (row) row.scrollIntoView({ block: 'center', behavior: 'smooth' });
          return true;
        });
      }
    };
    host.addEventListener('input', function (e) { if (e.target.hasAttribute('data-search')) { S.q = e.target.value; paintList(); } });
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-action]'); if (!b || S.busy) return;
      var action = b.getAttribute('data-action'), id = Number(b.getAttribute('data-id')), value = b.getAttribute('data-value');
      if (action === 'refresh') { load(false); return; }
      if (action === 'filter-type') { S.type = value; Array.prototype.forEach.call(host.querySelectorAll('[data-action="filter-type"]'), function (x) { x.classList.toggle('on', x === b); }); paintList(); return; }
      if (action === 'filter-state') { S.state = value; Array.prototype.forEach.call(host.querySelectorAll('[data-action="filter-state"]'), function (x) { x.classList.toggle('on', x === b); }); paintList(); return; }
      if (action === 'filter-first') { S.firstOnly = !S.firstOnly; b.classList.toggle('on', S.firstOnly); paintList(); return; }
      if (action === 'choose-slot') { chooseSlot(Number(b.getAttribute('data-pos'))); return; }
      if (action === 'place') { placeSheet(id); return; }
      if (action === 'earlier') { applyMove(id, S.order.indexOf(id) - 1, false); return; }
      if (action === 'later') { applyMove(id, S.order.indexOf(id) + 1, false); return; }
      if (action === 'first-toggle') { toggleFirst(id); return; }
      if (action === 'edit') { editSheet(id); return; }
      if (action === 'publish') { publish(id); return; }
      if (action === 'delete') { remove(id); }
    });
    function external() { if (!host.isConnected) { window.removeEventListener('iv-content-changed', external); return; } if (S.ownContentEvent) return; if (!S.busy) load(true); }
    window.addEventListener('iv-content-changed', external);
    load(false);
  }

  /* Create105 owns the single mounting point. Do not wrap IVROOMS.create here:
     a second wrapper would mount two libraries and duplicate every read/write. */
  window.IVSTUDIO104 = { fetchLibrary: fetchLibrary, mount: mount };
})();
