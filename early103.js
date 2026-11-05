/* Pass 103 · the complete canonical Early Door, owned by the server. */
window.IVEARLY103 = (function () {
  'use strict';
  var d = document, w = window;
  var S = { seq: 0, busy: false, state: null, dawn: {}, peeks: {}, last: 0, pending: null, screenPost: 0 };
  function $(s, r) { return (r || d).querySelector(s); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }
  function map(v) { return Array.isArray(v) ? (v[0] || {}) : (v && typeof v === 'object' ? v : {}); }
  function signed() { try { return !!(w.IVSESS && IVSESS.ident().id); } catch (e) { return false; } }
  function house() { try { return !!(w.ivIsAdmin && ivIsAdmin()); } catch (e) { return false; } }
  function rpc(name, params) { if (!signed()) return Promise.reject(new Error('Sign in to open the Early Door.')); return IVSESS.call('/rest/v1/rpc/' + name, params || {}); }
  function say(text, bad) { if (w.ivoryToast) ivoryToast(String(text || 'The door did not answer.'), !!bad); }
  function reason(e) { return String(e && (e.message || e.error) || e || 'The door did not answer.').replace(/^Exception:\s*/, ''); }
  function open() { var sh = $('sheet-door'); return !!(sh && sh.classList.contains('show') && sh.getAttribute('aria-hidden') !== 'true'); }
  function when(v) { var x = new Date(v); return isNaN(x.getTime()) ? '' : x.toLocaleString(); }
  function countdown(v) { var ms = new Date(v).getTime() - Date.now(); if (!isFinite(ms)) return 'at its appointed time'; if (ms <= 0) return 'now'; var m = Math.ceil(ms / 60000), h = Math.floor(m / 60); return h ? 'in ' + h + 'h ' + (m % 60) + 'm' : 'in ' + m + 'm'; }
  function ensure() {
    var body = $('#sheet-door .door-body'); if (!body) return null;
    var posts = $('#early103-posts');
    if (!posts) { posts = d.createElement('div'); posts.id = 'early103-posts'; posts.className = 'early103-posts'; var lab = $('.dr-lab', body); if (lab) body.insertBefore(posts, lab); else body.appendChild(posts); }
    var status = $('#early103-status');
    if (!status) { status = d.createElement('p'); status.id = 'early103-status'; status.className = 'early103-status'; status.setAttribute('role', 'status'); var key = $('.dr-key', body); if (key) key.parentNode.insertBefore(status, key.nextSibling); }
    var modal = $('#early103-modal');
    if (!modal) { modal = d.createElement('div'); modal.id = 'early103-modal'; modal.className = 'early103-modal'; modal.hidden = true; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); body.appendChild(modal); }
    return body;
  }
  function paint() {
    var body = ensure(); if (!body) return;
    var x = S.dawn || {}, s = S.state, nums = $$nums(body);
    if (nums[0]) nums[0].textContent = num(x.streak); if (nums[1]) nums[1].textContent = num(x.best); if (nums[2]) nums[2].textContent = num(x.reads);
    var next = num(x.next_at), reads = num(x.reads), nudge = $('.dr-nudge', body);
    if (nudge) nudge.innerHTML = next > reads ? esc((next - reads) + ' more and you are ' + (next === 5 ? 'a Dawn Regular' : next === 12 ? 'a Dawn Keeper' : next === 25 ? 'of the Inner Room' : 'a Dawn Visitor')) : esc(String(x.rank || 'Dawn Circle') + ' · every dawn is kept');
    var note = $('.dr-note-copy', body); if (note && x.note != null) note.textContent = String(x.note || 'Walk softly. The dawn is yours.');
    var lede = $('.dr-lede', body); if (lede) lede.textContent = num(x.foot_today) > 0 ? 'The door opened at 06:07 IST · ' + num(x.foot_today) + ' walked in before the world today.' : 'The door opened at 06:07 IST · the first footsteps are yours.';
    var key = $('.dr-key', body); if (key) { key.disabled = !!S.busy || x.peek_turn === true; key.classList.toggle('is-turned', x.peek_turn === true); key.innerHTML = x.peek_turn === true ? '<span aria-hidden="true">✦</span> The keyhole is turned · one peek is yours' : '<span aria-hidden="true">⚿</span> Turn the keyhole'; }
    var stat = $('.dr-stat', body); if (stat) stat.textContent = String(x.rank || 'Dawn Circle') + (num(x.golden) ? ' · ' + num(x.golden) + ' Golden Key' + (num(x.golden) === 1 ? '' : 's') : '') + (x.plaque === true ? ' · Dawn Plaque earned' : '');
    var premium = $('.dr-prem-copy', body); if (premium && x.discount != null) premium.innerHTML = 'Your dawns take <b>₹' + num(x.discount) + '</b> off the first premium month' + (num(x.cap) ? ', up to ₹' + num(x.cap) : '') + '.';
    var whisper = $('.dr-whisper', body); if (whisper) { whisper.disabled = !!S.busy; whisper.setAttribute('aria-pressed', String(!s || s.push_on !== false)); whisper.textContent = s && s.push_on === false ? 'Whisper to me when the door opens' : 'Early Door whispers are on · tap to pause'; }
    renderPosts(); paintCard();
  }
  function $$nums(body) { return Array.prototype.slice.call(body.querySelectorAll('.dr-streak .dr-num b')); }
  function renderPosts() {
    var box = $('#early103-posts'); if (!box) return;
    var s = S.state, x = S.dawn || {};
    if (!s) { box.innerHTML = '<p class="early103-empty">' + (signed() ? 'The Early Door is not enabled for this membership right now.' : 'Sign in to read your dawn state and turn the keyhole.') + '</p>'; return; }
    var posts = Array.isArray(s.posts) ? s.posts : [];
    box.innerHTML = '<p class="dr-lab">Held behind the door</p>' + (posts.length ? posts.map(function (p) {
      var id = num(p.post_id), teaser = S.peeks[id];
      return '<article class="early103-post"><h3>' + esc(p.title) + '</h3><p>' + (p.can_open === true ? 'Open for you now · everyone at ' + esc(when(p.public_at)) : 'Opens for you ' + esc(countdown(p.opens_at)) + ' · everyone ' + esc(countdown(p.public_at))) + '</p><div class="early103-keys">' +
        (p.can_open === true ? '<button type="button" data-early="read" data-post="' + id + '">READ NOW</button>' : '') +
        ((s.paid === true || house()) ? '<button type="button" data-early="screen" data-post="' + id + '">FIRST SCREENING</button>' : '') +
        (p.can_open !== true && num(x.golden) > 0 ? '<button type="button" class="gold" data-early="golden" data-post="' + id + '">USE A GOLDEN KEY</button>' : '') +
        (p.can_open !== true && x.peek_turn === true && !teaser ? '<button type="button" data-early="peek" data-post="' + id + '">PEEK</button>' : '') + '</div>' +
        (teaser ? '<blockquote><b>THROUGH THE KEYHOLE</b>' + esc(teaser) + '</blockquote>' : '') + '</article>';
    }).join('') : '<p class="early103-empty">Nothing is held behind the door right now. When a story is held, it waits here first.</p>');
  }
  function paintCard() {
    var card = $('.card.c-plum'); if (!card) return;
    var lede = $('.lede', card), s = S.state, x = S.dawn || {};
    if (lede && s) { var waiting = (s.posts || []).filter(function (p) { return p.can_open === true; }).length; lede.textContent = waiting ? waiting + ' held moment' + (waiting === 1 ? ' is' : 's are') + ' open for you.' : x.peek_turn === true ? 'Today’s keyhole is turned. One peek is yours.' : 'Light your Heart or finish today’s question, then turn the keyhole.'; }
  }
  function refresh(force) {
    if (!signed()) { S.state = null; S.dawn = {}; paint(); return Promise.resolve(); }
    if (!force && S.pending) return S.pending;
    if (!force && S.last && Date.now() - S.last < 20000) { paint(); return Promise.resolve(); }
    var seq = ++S.seq;
    S.pending = Promise.all([rpc('early_state').catch(function () { return S.state; }), rpc('dawn_report')]).then(function (r) {
      if (seq !== S.seq) return;
      var state = map(r[0]); S.state = state.open === true ? state : null; S.dawn = map(r[1]); S.last = Date.now(); S.pending = null; paint();
    }).catch(function (e) { if (seq === S.seq) { S.pending = null; say(reason(e), true); paint(); } });
    return S.pending;
  }
  function busy(v) { S.busy = v; var b = $('#sheet-door .dr-key'); if (b) b.disabled = v || (S.dawn || {}).peek_turn === true; }
  function turn() {
    if (S.busy) return; busy(true);
    rpc('dawn_task_turn').then(function (r) { var x = map(r); if (x.ok === true) { say('The keyhole is turned. One peek is yours today.'); return refresh(true); } say(x.why || 'The keyhole did not turn.', true); }).catch(function (e) { say(reason(e), true); }).then(function () { busy(false); paint(); });
  }
  function peek(id) {
    if (S.busy) return; busy(true);
    rpc('dawn_peek', { post_in: id }).then(function (r) { var x = map(r); if (x.ok === true) { S.peeks[id] = String(x.teaser || ''); return refresh(true); } say(x.why === 'already' ? 'You have looked through this keyhole today.' : (x.why || 'This peek is not open.'), true); }).catch(function (e) { say(reason(e), true); }).then(function () { busy(false); paint(); });
  }
  function modal(html) { var m = ensure() && $('#early103-modal'); if (!m) return; m.innerHTML = '<section><button type="button" class="early103-modal-x" data-early="close-modal" aria-label="Close">×</button>' + html + '</section>'; m.hidden = false; }
  function golden(id) {
    if (S.busy) return; busy(true);
    rpc('dawn_golden_use', { post_in: id }).then(function (r) { var x = map(r); if (x.ok !== true) { say(x.why || 'The Golden Key did not open this door.', true); return; } modal('<p class="early103-kick">THE GOLDEN KEY</p><h2>' + esc(x.title) + '</h2><div class="early103-prose">' + esc(x.body) + '</div><button type="button" class="early103-main" data-early="close-modal">CLOSE THE DOOR SOFTLY</button>'); return refresh(true); }).catch(function (e) { say(reason(e), true); }).then(function () { busy(false); paint(); });
  }
  function screening(id) {
    S.screenPost = id; modal('<p class="early103-kick">THE FIRST SCREENING</p><p>Opening the held cut…</p>');
    rpc('dawn_screen', { post_in: id }).then(function (r) { var x = map(r); if (S.screenPost !== id) return; if (x.ok !== true) { modal('<p class="early103-kick">THE DOOR IS TIERED</p><h2>The First Screening</h2><p>This room opens only when the house returns access. No held words are shown here.</p>'); return; } paintScreening(x); }).catch(function (e) { modal('<p class="early103-kick">THE FIRST SCREENING</p><p>' + esc(reason(e)) + '</p>'); });
  }
  function paintScreening(x) {
    var mine = map(x.mine), counts = [['RELEASE IT',x.release_n],['HOLD FOR NOTES',x.notes_n],['SUPER HIT',x.super_n],['SLOW BURN',x.slow_n],['SLEEPER',x.sleeper_n]];
    modal('<p class="early103-kick">THE FIRST SCREENING · ' + num(x.seats) + ' SEATS</p><h2>' + esc(x.title || 'The held cut') + '</h2><p class="early103-meta">' + esc(countdown(x.public_at)) + ' until the world sees it · Seer ' + num(x.seer) + '/' + num(x.calls) + '</p><div class="early103-prose">' + esc(x.body) + '</div>' +
      '<div class="early103-pulse">' + counts.map(function (c) { return '<span>' + c[0] + ' <b>' + num(c[1]) + '</b></span>'; }).join('') + '</div>' +
      '<div class="early103-verdict"><label>Verdict<select id="early103-v"><option value="release">Release it</option><option value="notes">Hold for notes</option></select></label><label>Your call<select id="early103-h"><option value="super">Super hit</option><option value="slow">Slow burn</option><option value="sleeper">Sleeper</option></select></label><label>Note for Ivory<textarea id="early103-n" rows="3" maxlength="2000">' + esc(mine.note) + '</textarea></label><button type="button" class="early103-main" data-early="verdict">SEAL MY VERDICT</button></div>' +
      (x.is_admin === true ? '<div class="early103-settle"><b>SETTLE THE CALL · DESK</b><button data-early="settle" data-band="super">SUPER HIT</button><button data-early="settle" data-band="slow">SLOW BURN</button><button data-early="settle" data-band="sleeper">SLEEPER</button></div>' : ''));
    $('#early103-v').value = mine.verdict === 'notes' ? 'notes' : 'release'; $('#early103-h').value = ['super','slow','sleeper'].indexOf(mine.hype) >= 0 ? mine.hype : 'super';
  }
  function verdict() {
    if (S.busy) return; busy(true); var id = S.screenPost;
    rpc('dawn_verdict', { post_in: id, verdict_in: $('#early103-v').value, note_in: $('#early103-n').value, hype_in: $('#early103-h').value }).then(function (r) { var x = map(r); say(x.ok === true ? 'Your verdict is sealed with Ivory.' : 'The desk would not take it. Try again at dawn.', x.ok !== true); if (x.ok === true) screening(id); }).catch(function (e) { say(reason(e), true); }).then(function () { busy(false); });
  }
  function settle(band) { if (S.busy) return; busy(true); var id = S.screenPost; rpc('dawn_settle', { post_in: id, band_in: band }).then(function () { say('Call settled. The Seers are marked.'); screening(id); }).catch(function (e) { say(reason(e), true); }).then(function () { busy(false); }); }
  function push() { if (S.busy) return; var on = !(S.state && S.state.push_on !== false); busy(true); rpc('early_set_push', { on_in: on }).then(function () { return refresh(true); }).then(function () { say(on ? 'Early Door whispers are on.' : 'Early Door whispers are paused.'); }).catch(function (e) { say(reason(e), true); }).then(function () { busy(false); paint(); }); }
  d.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target : null; if (!t) return;
    if (t.closest('[data-open="door"]')) setTimeout(function () { refresh(true); }, 30);
    if (t.closest('#sheet-door .dr-key')) { e.preventDefault(); e.stopImmediatePropagation(); turn(); return; }
    if (t.closest('#sheet-door .dr-whisper')) { e.preventDefault(); e.stopImmediatePropagation(); push(); return; }
    if (t.closest('#sheet-door .dr-prem-btn')) { e.preventDefault(); e.stopImmediatePropagation(); if (w.IVHOUSE102) IVHOUSE102.go('premium'); else if (w.ivoryShow) ivoryShow('premium'); return; }
    var b = t.closest('[data-early]'); if (!b || !$('#sheet-door').contains(b)) return;
    e.preventDefault(); e.stopImmediatePropagation(); var action = b.getAttribute('data-early'), id = num(b.getAttribute('data-post'));
    if (action === 'read') { if (w.IVCONTENT) IVCONTENT.open(id); }
    else if (action === 'peek') peek(id); else if (action === 'golden') golden(id); else if (action === 'screen') screening(id);
    else if (action === 'verdict') verdict(); else if (action === 'settle') settle(b.getAttribute('data-band'));
    else if (action === 'close-modal') { S.screenPost = 0; var m = $('#early103-modal'); if (m) { m.hidden = true; m.innerHTML = ''; } }
  }, true);
  setInterval(function () { if (open() && !d.hidden) refresh(false); }, 20000);
  if (w.IVSESS && IVSESS.on) IVSESS.on(function () { S.last = 0; S.peeks = {}; if (open()) refresh(true); else paintCard(); });
  function boot() { ensure(); paint(); }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
  return { refresh: refresh, state: S, turn: turn, openScreening: screening };
})();
