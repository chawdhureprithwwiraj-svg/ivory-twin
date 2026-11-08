window.IVHOUSE102 = (function () {
'use strict';
var d = document, w = window;
var S = { line: null, lineFree: null, lineLoaded: false, lineBusy: false, lineError: '', share: false };
function $(s, r) { return (r || d).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function msg(e) { return String(e && (e.message || e.error_description || e.error) || e || 'The house could not answer.').replace(/^Exception:\s*/, ''); }
function signed() { try { return !!(w.IVSESS && IVSESS.ident().id); } catch (e) { return false; } }
function rpc(name, params) {
if (!signed()) return Promise.reject(new Error('Sign in to continue.'));
return IVSESS.call('/rest/v1/rpc/' + name, params || {});
}
function toast(t, bad) { if (w.ivoryToast) w.ivoryToast(t, !!bad); }
function go(room) {
if (w.ivShell && ivShell.shutAll) ivShell.shutAll();
if (w.ivoryShow) ivoryShow(room);
}
function map(v) { return Array.isArray(v) ? (v[0] || {}) : (v && typeof v === 'object' ? v : {}); }
function words(text) { var t = String(text || '').trim(); return t ? t.split(/\s+/).length : 0; }
function status(el, text, bad) {
if (!el) return;
el.textContent = text || '';
el.classList.toggle('bad', !!bad);
el.hidden = !text;
}
function featherInto(el, cls) {
if (!el) return;
el.classList.add('iv-feather-frame');
el.innerHTML = '<img class="iv-feather ' + esc(cls || '') + '" src="media/art/feather.webp" alt="" draggable="false">';
}
function dressFeathers() {
$$('.featherimg').forEach(function (img) {
img.classList.add('iv-feather');
if (img.getAttribute('src').indexOf('data:') === 0 && img.dataset.art) img.src = img.dataset.art;
img.setAttribute('draggable', 'false');
});
var folio = $('#sheet-folio .fl-hico');
if (folio && !folio.querySelector('.iv-feather')) featherInto(folio, 'folio');
var privateLine = $('#sheet-folio .fl-private');
if (privateLine) privateLine.textContent = 'Private to your account';
}
function membershipTap(e) {
var t = e.target && e.target.closest ? e.target.closest('.dr-prem-btn,.ln-skip-btn,.ln-join-btn') : null;
if (!t) return;
e.preventDefault(); e.stopImmediatePropagation();
go('premium');
}
function shareText() {
var base = ($('#iv-text') || {}).textContent || 'Ivory ~ private stories, live sessions and one-on-one time with me.';
var url = /^https?:$/.test(location.protocol) ? location.origin + location.pathname : 'https://ivory-twin.pages.dev/';
return { text: base.trim(), url: url, combined: base.trim() + '\n' + url };
}
function shareStatus(text, bad) { status($('#iv-share-status'), text, bad); }
function legacyCopy(text) {
var area = d.createElement('textarea');
area.value = text; area.setAttribute('readonly', ''); area.className = 'iv-copy-fallback';
d.body.appendChild(area); area.select(); area.setSelectionRange(0, area.value.length);
var ok = false;
try { ok = d.execCommand('copy') === true; } catch (e) {}
area.remove(); return ok;
}
function copyShare() {
var value = shareText().combined;
var work = navigator.clipboard && navigator.clipboard.writeText
? navigator.clipboard.writeText(value).then(function () { return true; }).catch(function () { return legacyCopy(value); })
: Promise.resolve(legacyCopy(value));
return work.then(function (ok) {
shareStatus(ok ? 'Copied, including the Ivory link.' : 'Copy did not work. Select the words and link, then copy them yourself.', !ok);
return ok;
});
}
function nativeShare() {
var value = shareText();
if (!navigator.share) {
return copyShare().then(function (ok) { if (ok) shareStatus('This browser has no share sheet. The words and link are copied instead.'); return ok; });
}
return navigator.share({ title: 'Ivory', text: value.text, url: value.url }).then(function () {
shareStatus('Shared.'); return true;
}).catch(function (e) {
if (e && e.name === 'AbortError') return false;
shareStatus('The share sheet did not open. Copy is still available.', true);
return false;
});
}
function wireShare() {
var root = $('#sheet-ivory'); if (!root || root.__house102) return; root.__house102 = true;
var buttons = $$('.iv-share .iv-sc', root);
if (buttons[0]) buttons[0].addEventListener('click', function (e) { e.preventDefault(); copyShare(); });
if (buttons[1]) buttons[1].addEventListener('click', function (e) { e.preventDefault(); nativeShare(); });
var targets = $$('.iv-targets .iv-t', root);
if (targets[0]) targets[0].addEventListener('click', function (e) { e.preventDefault(); nativeShare(); });
var open = $('.iv-get', root);
if (open) open.addEventListener('click', function (e) { e.preventDefault(); go('home'); });
var note = d.createElement('p'); note.id = 'iv-share-status'; note.className = 'iv-house-status'; note.hidden = true;
note.setAttribute('role', 'status');
var share = $('.iv-share', root); if (share) share.insertAdjacentElement('afterend', note);
}
function businessCount() {
var text = $('#bz-text'), count = $('#bz-count'); if (!text || !count) return;
count.textContent = words(text.value).toLocaleString() + ' / 3,000 words';
count.classList.toggle('bad', words(text.value) > 3000 || text.value.length > 100000);
}
function wireBusiness() {
var root = $('#sheet-biz'); if (!root || root.__house102) return; root.__house102 = true;
var text = $('#bz-text', root), send = $('.bz-send', root), fine = $('.bz-fine', root);
if (!text || !send) return;
text.maxLength = 100000;
text.addEventListener('input', businessCount); businessCount();
var note = d.createElement('p'); note.id = 'bz-status'; note.className = 'iv-house-status'; note.hidden = true; note.setAttribute('role', 'status');
send.insertAdjacentElement('afterend', note);
send.addEventListener('click', function (e) {
e.preventDefault(); if (send.disabled) return;
var clean = text.value.trim();
if (!clean || words(clean) > 3000 || clean.length > 100000) {
status(note, 'Please keep your note within 3,000 words and 100,000 characters.', true); text.focus(); return;
}
if (!signed()) { status(note, 'Sign in to send a private business note.', true); return; }
send.disabled = true; status(note, 'Sending your private note…');
IVSESS.call('/functions/v1/business-enquiry', { message: clean }).then(function (r) {
if (!r || r.ok !== true) throw new Error('The note could not be sent just now. Please try again.');
text.value = ''; businessCount();
status(note, 'Sent. Your note is in Ivory’s private business inbox.');
if (fine) fine.textContent = 'Your note was sent to Ivory’s private inbox and business email.';
}).catch(function (x) {
status(note, msg(x) || 'The note could not be sent just now. Please try again.', true);
}).then(function () { send.disabled = false; });
});
}
function lineStatus(text, bad) { status($('#ln-status'), text, bad); }
function lineCount() {
var text = $('#ln-text'), count = $('#ln-count'); if (!text || !count) return;
count.textContent = text.value.length + '/' + text.maxLength;
}
function draftSave() {
clearTimeout(S.draftTimer);
S.draftTimer = setTimeout(function () {
try { localStorage.setItem('ivory_line_draft_v1', ($('#ln-text') || {}).value || ''); } catch (e) {}
}, 450);
}
function draftClear() {
try { localStorage.removeItem('ivory_line_draft_v1'); } catch (e) {}
}
function whyLine(s) {
var why = s.why_not;
if (why === 'open') return 'One letter is already open. Ivory will read it before another is sealed.';
if (why === 'used') return 'This membership’s letter allowance has been used for this window.';
if (why === 'resting') return 'The Line is resting until ' + (s.return_days || 7) + ' days have passed. Your draft stays here.';
if (why === 'join') return 'This letter needs a paid membership. See the memberships below; your draft stays here.';
return 'The house is not accepting this letter just now. Your draft stays here.';
}
function renderLetters(s) {
var box = $('#ln-letters'); if (!box) return;
var rows = Array.isArray(s.letters) ? s.letters : [];
box.innerHTML = rows.length ? rows.map(function (r) {
var answered = r.status === 'answered' && (r.reply_text || r.reply_audio_url);
return '<article class="ln-letter"><div class="ln-lt-top"><span>' + esc(r.created_at ? new Date(r.created_at).toLocaleString() : '') + '</span>' +
'<span class="ln-state">' + esc(r.status || 'waiting') + '</span></div><p class="ln-lt-body">' + esc(r.body || '') + '</p>' +
(answered ? '<div class="ln-reply"><p class="ln-rp-lab">Ivory wrote back.</p>' +
(r.reply_text ? '<p class="ln-rp-a">' + esc(r.reply_text) + '</p>' : '') +
(r.reply_audio_url ? '<p class="ln-rp-a">A voice reply is waiting in the app.</p>' : '') + '</div>' : '') + '</article>';
}).join('') : '<p class="ln-fine">No sealed letters yet. Your first one will appear here.</p>';
}
function renderLine() {
var s = S.line || {}, seal = $('.ln-seal'), text = $('#ln-text');
if (!seal || !text) return;
var paidCan = s.paid === true && s.can_send === true;
var env = $('.ln-env', seal);
seal.innerHTML = (env ? env.outerHTML : '') + (paidCan ? ' Seal and send' : ' Seal into the Line');
text.maxLength = Math.max(3, Number(s.max_chars) || 750); lineCount();
var consent = $('.ln-consent > span:last-child');
if (consent) consent.textContent = paidCan
? 'Ivory may share this letter and her reply as the Letter of the Day, without my name.'
: 'Ivory may share this letter and her reply as a Saturday Evening Letter, without my name.';
var fine = $('.ln-fine');
if (fine) fine.textContent = paidCan
? 'Your letter goes to Ivory now. It clears this phone only after the house accepts it.'
: 'Kept on this phone until you seal it. A letter sealed before you join still stands in the queue — membership simply carries yours to the front.';
var join = $('.ln-join'), skip = $('.ln-skip'), saturday = $('.ln-saturday');
if (join) join.hidden = !!s.paid;
if (skip) skip.hidden = !!s.paid;
if (saturday) saturday.hidden = !!s.paid;
var stamps = $('.ln-stamps'), stampCopy = stamps && stamps.nextElementSibling;
var pos = S.lineFree && S.lineFree.position;
if (stamps) {
if (!s.paid && pos != null) {
stamps.hidden = false;
stamps.innerHTML = '<div class="ln-stamp sealed"><b>#' + esc(pos) + '</b><em>Your place in the Line</em></div>';
if (stampCopy && stampCopy.classList.contains('ln-copy')) stampCopy.textContent = 'Your sealed letter is in the canonical Forever queue.';
} else {
stamps.hidden = true;
if (stampCopy && stampCopy.classList.contains('ln-copy')) stampCopy.hidden = true;
}
}
renderLetters(s);
seal.disabled = S.lineBusy || s.open === false;
if (s.open === false) lineStatus('The Private Line is not open right now. Your draft is still kept on this phone.', true);
else if (s.paid && !s.can_send) lineStatus(whyLine(s), true);
else if (S.lineError) lineStatus(S.lineError, true);
else lineStatus('');
}
function loadLine(force) {
if (!signed()) { lineStatus('Sign in to seal a letter. Your draft stays on this phone.', true); return Promise.resolve(null); }
if (S.lineLoaded && !force) { renderLine(); return Promise.resolve(S.line); }
S.lineBusy = true; lineStatus('Reading your Line…');
return rpc('line_state').then(function (r) {
S.line = map(r); S.lineLoaded = true; S.lineError = '';
return rpc('line_free_state').then(function (f) { S.lineFree = map(f); }).catch(function () { S.lineFree = null; });
}).then(function () { renderLine(); return S.line; }).catch(function (e) {
S.lineError = msg(e); S.lineLoaded = false;
lineStatus(S.lineError + ' Your letter is still here.', true);
return null;
}).then(function (v) {
S.lineBusy = false;
if (S.lineLoaded) renderLine();
else { var seal = $('.ln-seal'); if (seal) seal.disabled = false; }
return v;
});
}
function sealLine(e) {
if (e) { e.preventDefault(); e.stopImmediatePropagation(); }
if (S.lineBusy) return;
var text = $('#ln-text'), body = text ? text.value.trim() : '';
if (body.length < 3) { lineStatus('Write at least a few words first.', true); if (text) text.focus(); return; }
if (!S.lineLoaded) { loadLine().then(function (s) { if (s) sealLine(); }); return; }
var s = S.line || {};
if (s.open === false) { lineStatus('The Private Line is not open right now. Your draft is still here.', true); return; }
if (s.paid && !s.can_send) { lineStatus(whyLine(s), true); return; }
var paidCan = s.paid === true && s.can_send === true;
var name = paidCan ? 'line_send' : 'line_queue_join';
S.lineBusy = true;
var seal = $('.ln-seal'); if (seal) seal.disabled = true;
lineStatus(paidCan ? 'Sealing and sending…' : 'Sealing into the Line…');
rpc(name, { body_in: body, share_in: S.share }).then(function (r) {
r = map(r);
if (r.ok !== true) {
lineStatus(String(r.message || 'That did not go through. Your letter is still here.'), true);
if (!s.paid) { var join = $('.ln-join'); if (join) join.hidden = false; }
return null;
}
draftClear(); if (text) { text.value = ''; lineCount(); }
var accepted = String(r.message || (paidCan ? 'Sealed and sent.' : 'Sealed into the Line.'));
lineStatus(accepted);
S.lineLoaded = false;
return loadLine(true).then(function () { lineStatus(accepted); });
}).catch(function (x) {
lineStatus(msg(x) + ' Your letter is still here.', true);
if (!s.paid) { var join = $('.ln-join'); if (join) join.hidden = false; }
}).then(function () { S.lineBusy = false; if (seal) seal.disabled = false; });
}
function wireLine() {
var root = $('#sheet-line'); if (!root || root.__house102) return; root.__house102 = true;
var text = $('#ln-text', root), seal = $('.ln-seal', root), consent = $('.ln-consent', root);
if (text) {
try { if (!text.value) text.value = localStorage.getItem('ivory_line_draft_v1') || ''; } catch (e) {}
text.addEventListener('input', function () { lineCount(); draftSave(); }); lineCount();
}
if (consent) {
var label = consent.textContent.trim();
consent.innerHTML = '<input id="ln-share" type="checkbox"><span class="ln-box" aria-hidden="true"></span><span>' + esc(label) + '</span>';
var check = $('#ln-share', consent); S.share = false;
if (check) check.addEventListener('change', function () { S.share = check.checked; consent.classList.toggle('checked', check.checked); });
}
if (seal) {
seal.addEventListener('click', sealLine);
var note = d.createElement('p'); note.id = 'ln-status'; note.className = 'iv-house-status'; note.hidden = true; note.setAttribute('role', 'status');
seal.insertAdjacentElement('afterend', note);
}
var old = $('.ln-letter', root);
if (old) { var list = d.createElement('div'); list.id = 'ln-letters'; old.parentNode.replaceChild(list, old); }
}
function wrapSheets() {
if (!w.openSheet || w.openSheet.__house102) return;
var base = w.openSheet;
function wrapped(id) {
var r = base.apply(this, arguments);
if (id === 'line') setTimeout(function () { loadLine(false); }, 30);
if (id === 'ivory') shareStatus('');
return r;
}
['__p92', '__p94', '__folio'].forEach(function (k) { if (base[k]) wrapped[k] = base[k]; });
wrapped.__house102 = true; w.openSheet = wrapped;
}
function boot() {
dressFeathers(); wireShare(); wireBusiness(); wireLine(); wrapSheets();
d.addEventListener('click', membershipTap, true);
}
if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
return { boot: boot, go: go, copyShare: copyShare, share: nativeShare, loadLine: loadLine, sealLine: sealLine, businessWords: words };
})();

window.IVGOLD102 = (function () {
'use strict';
var d = document, w = window;
var S = { mode: '', seq: 0, open: false, busy: false, protect: false, rehearsal: false,
question: null, deadline: 0, timer: 0, resultTimer: 0, vault: null, quiz: null, pending: null,
fx: [], advanceTimer: 0, audio: null, soundOn: true, lastTick: 99, totalSeconds: 30, skew: 0, vaultResult: null,
calY: 0, calM: 0, calBusy: false, calAligned: false, ladder: null };
var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function $(s, r) { return (r || d).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function num(v, fallback) { var n = Number(v); return isFinite(n) ? n : (fallback || 0); }
function map(v) { return Array.isArray(v) ? (v[0] || {}) : (v && typeof v === 'object' ? v : {}); }
function msg(e) { return String(e && (e.message || e.error_description || e.error) || e || 'The house could not answer.').replace(/^Exception:\s*/, ''); }
function signed() { try { return !!(w.IVSESS && IVSESS.ident().id); } catch (e) { return false; } }
function rpc(name, params) {
if (!signed()) return Promise.reject(new Error('Sign in to continue.'));
return IVSESS.call('/rest/v1/rpc/' + name, params || {});
}
function toast(t, bad) { if (w.ivoryToast) w.ivoryToast(t, !!bad); }
function valid(seq) { return S.open && seq === S.seq; }
function when(v) { if (!v) return ''; var x = new Date(v); return isNaN(x.getTime()) ? '' : x.toLocaleString(); }
function money(v) { return '₹' + num(v, 0).toLocaleString('en-IN'); }
try { S.soundOn = localStorage.getItem('iv.gold103.sound') !== '0'; } catch (e) {}
function scene(name) { var r = $('#gold102'); if (r) r.dataset.scene = name; }
function paintSound() { var b = $('.g102-sound'); if (b) { b.setAttribute('aria-pressed', S.soundOn ? 'true' : 'false'); b.setAttribute('aria-label', S.soundOn ? 'Mute game sounds' : 'Turn game sounds on'); b.textContent = S.soundOn ? '♪' : '×'; b.classList.toggle('off', !S.soundOn); } }
function audio() {
if (!S.soundOn) return null;
try { var A = w.AudioContext || w.webkitAudioContext; if (!A) return null; if (!S.audio) S.audio = new A(); if (S.audio.state === 'suspended') S.audio.resume().catch(function () {}); return S.audio; } catch (e) { return null; }
}
function tone(ac, freq, at, duration, gain, type) {
var o = ac.createOscillator(), g = ac.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(freq, at);
g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(gain || 0.055, at + 0.018); g.gain.exponentialRampToValueAtTime(0.0001, at + duration);
o.connect(g); g.connect(ac.destination); o.start(at); o.stop(at + duration + 0.025); o.onended = function () { try { o.disconnect(); g.disconnect(); } catch (e) {} };
}
function sound(kind, step) {
var ac = audio(); if (!ac) return;
var sets = { tick:[880], seal:[300 + num(step, 0) * 28], reveal:[392,523.25,659.25], correct:[523.25,659.25,783.99], golden:[659.25,830.61,987.77,1318.51], wrong:[220,174.61], timeout:[196,146.83], win:[392,523.25,659.25,783.99], perfect:[523.25,659.25,783.99,1046.5,1318.51], lose:[261.63,220] };
var notes = sets[kind] || sets.reveal, now = ac.currentTime + 0.006, long = /reveal|win|perfect/.test(kind);
notes.forEach(function (f, i) { tone(ac, f, now + i * (long ? 0.075 : 0.045), long ? 0.62 : (kind === 'tick' ? 0.065 : 0.25), kind === 'tick' ? 0.025 : 0.045, kind === 'wrong' || kind === 'timeout' ? 'triangle' : 'sine'); });
}
function toggleSound() { S.soundOn = !S.soundOn; try { localStorage.setItem('iv.gold103.sound', S.soundOn ? '1' : '0'); } catch (e) {} paintSound(); if (S.soundOn) sound('seal', 3); }
function later(fn, ms) { var id = setTimeout(function () { S.fx = S.fx.filter(function (x) { return x !== id; }); fn(); }, ms); S.fx.push(id); return id; }
function clearFx() { S.fx.forEach(clearTimeout); S.fx = []; clearAdvance(); }
function clearAdvance() { if (S.advanceTimer) { clearTimeout(S.advanceTimer); S.advanceTimer = 0; } }
function readClock(x) { var t = x && Date.parse(x.server_now || ''); S.skew = isFinite(t) ? t - Date.now() : 0; }
function remaining(v) { var ms = Date.parse(v || '') - (Date.now() + S.skew); if (!isFinite(ms)) return ''; var sec = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), ss = sec % 60; return (h ? h + 'h ' : '') + (h || m ? m + 'm ' : '') + ss + 's'; }
function updateExpiries() { $$('[data-expiry]').forEach(function (el) { var left = remaining(el.dataset.expiry); el.textContent = left ? (el.dataset.expiryLabel || 'Next opening in ') + left : el.dataset.expiryDone || 'The house will refresh this opening.'; }); }
function startResultClock() { updateExpiries(); if ($('[data-expiry]') && !S.resultTimer) S.resultTimer = setInterval(updateExpiries, 1000); }
function rankOf(x) { var score = num(x.score, 0), total = num(x.questions || x.days, 0); return total > 0 && score === total ? 'IVORY SAGE' : score >= 7 ? 'STORYTELLER' : score >= 4 ? 'KEEPER' : 'THE CURIOUS'; }
function shell() {
var root = d.getElementById('gold102');
if (root) return root;
root = d.createElement('div'); root.id = 'gold102'; root.className = 'g102'; root.hidden = true;
root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-hidden', 'true');
root.innerHTML = '<div class="g102-veil"></div><section class="g102-room" aria-label="Golden activity">' +
'<div class="g102-ambient" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
'<header class="g102-head"><button type="button" class="g102-x" data-g102="close" aria-label="Close">×</button>' +
'<div class="g102-heading"><p id="g102-kick"></p><h2 id="g102-title"></h2></div><span class="g102-rehearsal" id="g102-rehearsal" hidden>Admin rehearsal</span>' +
'<button type="button" class="g102-sound" data-g102="sound" aria-label="Mute game sounds" aria-pressed="true">♪</button></header>' +
'<div class="g102-body" id="g102-body"></div><p class="g102-status" id="g102-status" role="status" hidden></p>' +
'<div class="g102-confirm" id="g102-confirm" hidden><div><h3 id="g102-confirm-title"></h3><p id="g102-confirm-copy"></p>' +
'<div class="g102-row"><button type="button" class="g102-quiet" data-g102="stay">Stay</button><button type="button" class="g102-primary" data-g102="leave">Leave</button></div></div></div>' +
'</section></div>';
d.body.appendChild(root);
root.addEventListener('click', action);
return root;
}
function heading(kick, title) {
$('#g102-kick').textContent = kick; $('#g102-title').textContent = title;
$('#g102-rehearsal').hidden = !S.rehearsal;
}
function body(html) { $('#g102-body').innerHTML = html; $('#g102-body').scrollTop = 0; }
function status(text, bad) { var el = $('#g102-status'); el.textContent = text || ''; el.hidden = !text; el.classList.toggle('bad', !!bad); }
function loading(text) { body('<div class="g102-loading"><span class="g102-spinner" aria-hidden="true"></span><p>' + esc(text || 'Reading the house…') + '</p></div>'); status(''); }
function errorView(text, retry) {
body('<div class="g102-error"><span class="g102-coin" aria-hidden="true">I</span><h3>The door did not open.</h3><p>' + esc(text) + '</p>' +
'<div class="g102-row"><button type="button" class="g102-primary" data-g102="' + esc(retry || 'retry') + '">Try again</button>' +
'<button type="button" class="g102-quiet" data-g102="leave">Close</button></div></div>'); status('');
}
function openMode(mode) {
shell(); closeTimer(); clearFx();
S.seq++; S.mode = mode; S.open = true; S.busy = false; S.protect = false; S.rehearsal = false;
S.question = null; S.pending = null; S.vaultResult = null; S.quizSummary = null; S.deadline = 0;
var root = $('#gold102'); root.dataset.mode = mode; root.dataset.scene = 'loading'; paintSound(); root.hidden = false; root.setAttribute('aria-hidden', 'false'); root.classList.add('on');
d.body.classList.add('g102-open'); $('#g102-confirm').hidden = true;
heading(mode === 'vault' ? 'One key a day' : 'Ten questions · every answer from the house', mode === 'vault' ? 'The Ten-Day Vault' : 'The Golden Knock-off');
loading();
if (mode === 'vault') vaultHome(S.seq); else quizHome(S.seq);
}
function closeTimer() { if (S.timer) { clearInterval(S.timer); S.timer = 0; } if (S.resultTimer) { clearInterval(S.resultTimer); S.resultTimer = 0; } }
function finishClose() {
closeTimer(); clearFx(); S.open = false; S.seq++; S.protect = false; S.question = null; S.pending = null; S.busy = false;
var root = $('#gold102'); if (root) { root.classList.remove('on'); root.setAttribute('aria-hidden', 'true'); root.hidden = true; }
d.body.classList.remove('g102-open');
refreshCards();
}
function askClose() {
if (!S.open) return;
if (!S.protect) { finishClose(); return; }
var quiz = S.mode === 'quiz';
$('#g102-confirm-title').textContent = quiz ? 'Leave The Golden Knock-off?' : 'Leave today’s key?';
$('#g102-confirm-copy').textContent = S.rehearsal ? 'This is an admin rehearsal. Leaving costs nothing.' :
(quiz ? 'The server keeps this quiz and its clock. Gold already earned stays earned; its expiry keeps running.' :
'The clock keeps running. If time runs out, today’s answer counts as missed, but your vault goes on. You can return from the Home card.');
$('#g102-confirm').hidden = false;
}
function rehearsalVaultButtons(resetOnly) {
if (!S.rehearsal) return '';
return '<div class="g102-row g102-rehearsal-tools">' + (!resetOnly ? '<button type="button" class="g102-primary" data-g102="vault-next">Next rehearsal day</button>' : '') +
'<button type="button" class="g102-quiet" data-g102="vault-reset">Reset the rehearsal</button></div>';
}
function rehearsalVault(action) {
if (!S.rehearsal || S.busy) return;
var seq = S.seq; S.busy = true; loading(action === 'next' ? 'Turning the rehearsal day…' : 'Resetting the rehearsal…');
rpc(action === 'next' ? 'vault_rehearsal_next_day' : 'vault_rehearsal_reset').then(function () {
if (!valid(seq)) return; S.busy = false; vaultHome(seq);
}).catch(function (e) { if (valid(seq)) { S.busy = false; errorView(msg(e), 'retry'); } });
}
function daysHTML(answered, current, total, phase) {
var out = '<div class="g102-days" aria-label="Vault days">';
for (var i = 1; i <= (total || 10); i++) {
var got = i <= answered, open = !got && i === current && (phase === 'ready' || phase === 'open');
var cls = got ? 'got' : (open ? 'open' : 'locked');
out += '<button type="button" class="g102-day ' + cls + '" data-day="' + i + '" aria-label="Day ' + i + (got ? ', sealed' : (open ? ', open' : ', locked; explain')) + '">' +
'<span>' + i + '</span><small>' + (got ? 'sealed' : (open ? 'open' : 'locked')) + '</small></button>';
}
return out + '</div>';
}
function hourLabel(h) { h = num(h, 0); return h === 0 ? '12 AM' : h < 12 ? h + ' AM' : h === 12 ? '12 PM' : (h - 12) + ' PM'; }
function vaultDayTitle(start, seq) {
closeTimer(); clearFx(); S.mode = 'vault'; S.question = null; S.protect = false; scene('title');
var vs = S.vault || {}, day = start ? 1 : num(vs.day_no, 1), days = num(vs.days, 10), last = day >= days;
heading('One key a day', 'The Ten-Day Vault');
body('<div class="g102-day-title"><span class="g102-key-emblem" aria-hidden="true">⚿</span><p class="g102-eyebrow">' + (last ? 'THE LAST KEY' : 'ONE KEY A DAY') + '</p><h3>DAY ' + day + '</h3><b>OF ' + days + '</b><p>' + (last ? 'The hardest question of all. After this, the vault opens.' : day === 1 ? 'The gentlest key of all. Take a breath.' : 'Today’s key is a little harder than yesterday’s.') + '</p></div>');
sound('seal', day - 1);
later(function () { if (valid(seq)) vaultKey(start, seq); }, 2100);
}
function vaultHome(seq, fresh) {
closeTimer(); scene('home');
rpc('vault_home_state').then(function (r) {
if (!valid(seq)) return;
var s = map(r); readClock(s); S.vault = s; S.rehearsal = s.rehearsal === true;
heading('One key a day', 'The Ten-Day Vault'); paintVaultCard(s);
var state = String(s.state || 'signed_out'), days = num(s.days, 10), answered = num(s.answered, 0), day = num(s.day_no, 1);
if (state === 'open' && s.in_progress === true) { vaultKey(false, seq); return; }
if (state === 'open') { vaultDayTitle(false, seq); return; }
if (state === 'ceremony') { vaultResult(s.run_id, seq); return; }
var circles = daysHTML(answered, day, days, state);
if (state === 'ready') {
var rules = [
'One question a day for ' + days + ' days. Each day turns over at ' + hourLabel(s.day_start_hour) + '.',
'Every answer is sealed immediately. Right or wrong, nothing is revealed until the last key.',
'The questions grow harder each day; Day 1 is gentle.',
num(s.question_seconds, 30) + ' seconds for each question. Its clock starts only when the question appears.',
'Every right answer turns to gold, up to ' + money(s.max_per_answer) + ' each' + (num(s.max_bonus, 0) ? '; a perfect ' + days + ' adds up to ' + money(s.max_bonus) + '.' : '.'),
'Miss a day and the vault starts over from Day 1. Taking a membership while it runs ends it too.',
'On Day ' + days + ' the vault opens. Spend its gold within ' + num(s.credit_hours, 6) + ' hours on a membership priced above it.'
];
body('<div class="g102-intro"><span class="g102-key-emblem" aria-hidden="true">⚿</span><p class="g102-eyebrow">ONE KEY A DAY FOR ' + days + ' DAYS</p><h3>Ten days. One question at a time.</h3>' +
'<div class="g102-rules">' + rules.map(function (rule, i) { return '<p><span>' + (i + 1) + '</span>' + esc(rule) + '</p>'; }).join('') + '</div>' + circles +
'<button type="button" class="g102-primary" data-g102="begin-vault">' + (S.rehearsal ? 'START THE REHEARSAL' : 'BEGIN DAY 1 NOW') + '</button>' +
'<p class="g102-fine">The Day 1 title appears first; only then does the house open its question and clock.</p></div>');
} else if (state === 'sealed') {
body('<div class="g102-intro g102-sealed-scene ' + (fresh ? 'fresh' : '') + '"><span class="g102-big-key" aria-hidden="true">⚿</span><p class="g102-eyebrow">DAY ' + answered + ' SEALED</p><h3>Well turned.</h3>' +
'<p>Your answer is locked in the vault. Right or wrong, nothing is revealed until Day ' + days + '.</p>' + circles +
(s.next_opens_at ? '<div class="g102-next-key"><small>DAY ' + (answered + 1) + ' OPENS IN</small><b data-expiry="' + esc(s.next_opens_at) + '" data-expiry-label="" data-expiry-done="The next key is ready to open."></b><span>Each day turns over at ' + hourLabel(s.day_start_hour) + '.</span></div>' : '') +
'<p class="g102-fine">Sealed days explain themselves; future days can be touched to see why they are locked.</p>' +
rehearsalVaultButtons(false) + '<button type="button" class="g102-quiet" data-g102="leave">DONE</button></div>');
if (fresh) sound('reveal'); startResultClock();
} else {
var text = state === 'resting' ? 'Your vault has opened. A new one begins when the wait is over.' :
state === 'locked' ? 'The Ten-Day Vault is closed while this membership is running. The Home card will say when it opens again.' :
state === 'closed' ? 'The Ten-Day Vault is not open right now.' : 'Sign in to open your Ten-Day Vault.';
body('<div class="g102-intro"><h3>' + esc(text) + '</h3>' +
(s.next_start_at ? '<p>Next vault: ' + esc(when(s.next_start_at)) + '</p>' : '') +
'<button type="button" class="g102-quiet" data-g102="leave">Close</button></div>');
}
status(S.rehearsal ? 'Admin rehearsal: the server keeps this activity separate from member progress and rewards.' : '');
}).catch(function (e) { if (valid(seq)) errorView(msg(e), 'retry'); });
}
function vaultKey(start, seq) {
seq = seq || S.seq; S.busy = true; S.protect = true; scene('opening'); loading(start ? 'Opening Day One…' : 'Opening today’s key…');
rpc(start ? 'vault_start' : 'vault_open_key').then(function (r) {
if (!valid(seq)) return; S.busy = false;
var q = map(r); S.rehearsal = q.rehearsal === true || S.rehearsal; showQuestion('vault', q);
}).catch(function (e) { if (valid(seq)) { S.busy = false; errorView(msg(e), 'retry'); } });
}
function vaultResult(runId, seq) {
seq = seq || S.seq; closeTimer(); clearFx(); scene('ceremony-load'); loading('Opening the vault…');
rpc('vault_result', { run_id_in: num(runId, 0) || null }).then(function (r) {
if (!valid(seq)) return;
var x = map(r); readClock(x); S.rehearsal = x.rehearsal === true || S.rehearsal; S.protect = false; S.vaultResult = x;
showVaultCeremony(x, seq);
}).catch(function (e) { if (valid(seq)) errorView(msg(e), 'retry'); });
}
function showVaultCeremony(x, seq) {
closeTimer(); clearFx(); scene('ceremony'); S.ceremonyDone = false; S.question = null; S.protect = false;
var rows = Array.isArray(x.review) ? x.review : [];
heading('The last key has turned', 'The Vault opens');
body('<div class="g102-ceremony"><p class="g102-eyebrow">THE VAULT OPENS</p><div class="g102-ceremony-total"><span>YOUR GOLD</span><b id="g102-running">₹0</b></div>' +
'<p id="g102-turning">Turning key 0 of ' + rows.length + '</p><div class="g102-flips">' + rows.map(function (r, i) {
var right = r.correct === true, golden = r.golden === true;
return '<div class="g102-flip" data-flip="' + i + '"><div class="g102-flip-inner"><span class="g102-flip-front"><small>DAY</small><b>' + num(r.day, i + 1) + '</b></span>' +
'<span class="g102-flip-back ' + (right ? (golden ? 'golden' : 'right') : 'wrong') + '"><small>' + (right ? (golden ? 'GOLDEN' : 'CORRECT') : 'SEALED') + '</small><b>' + (right ? money(r.amount_inr) : '×') + '</b></span></div></div>';
}).join('') + '</div><button type="button" class="g102-quiet" data-g102="skip-ceremony">SKIP</button></div>');
status(S.rehearsal ? 'Admin rehearsal — these plates reveal no member reward.' : 'Every plate shows only what the house sealed.');
sound('reveal');
var shown = 0, running = 0;
function flip() {
if (!valid(seq) || S.ceremonyDone) return;
if (shown >= rows.length) { later(finishVaultCeremony, 900); return; }
var r = rows[shown], disc = $('[data-flip="' + shown + '"]'); if (disc) disc.classList.add('flipped');
if (r.correct === true) running += num(r.amount_inr, 0);
var total = $('#g102-running'); if (total) { total.textContent = money(running); total.classList.remove('bump'); void total.offsetWidth; total.classList.add('bump'); }
var label = $('#g102-turning'); if (label) label.textContent = shown + 1 < rows.length ? 'Turning key ' + (shown + 1) + ' of ' + rows.length : 'Every key is open';
sound(r.correct === true ? (r.golden === true ? 'golden' : 'correct') : 'wrong'); shown++;
later(flip, 720);
}
if (rows.length) later(flip, 720); else later(finishVaultCeremony, 500);
}
function finishVaultCeremony() {
if (S.ceremonyDone) return; S.ceremonyDone = true; clearFx();
var x = S.vaultResult || {}; rpc('vault_mark_seen', { run_id_in: num(x.run_id, 0) }).catch(function () {});
showVaultResultSummary(x, false);
}
function showVaultResultSummary(x, quiet) {
closeTimer(); clearFx(); scene('result'); S.protect = false; S.question = null; S.pending = null;
heading('The last key has turned', 'The Vault, opened');
body(summaryHTML(x, 'The Ten-Day Vault') + rehearsalVaultButtons(true) + '<div class="g102-row">' +
'<button type="button" class="g102-quiet" data-g102="review-vault">See my answers</button>' +
(num(x.total_inr, 0) > 0 && !S.rehearsal ? '<button type="button" class="g102-primary" data-g102="membership">Spend my gold</button>' : '') +
'<button type="button" class="g102-quiet" data-g102="share">Share my score</button><button type="button" class="g102-quiet" data-g102="leave">Done</button></div>');
status(S.rehearsal ? 'Admin rehearsal result — no member reward was created.' : ''); startResultClock();
if (!quiet) { var total = num(x.questions || x.days, 0); sound(total > 0 && num(x.score, 0) === total ? 'perfect' : num(x.total_inr, 0) > 0 && !S.rehearsal ? 'win' : 'lose'); }
}
function reviewVault() {
var x = S.vaultResult || {}, rows = x.review || [];
body('<div class="g102-review"><h3>Your sealed answers, now open</h3>' + (rows.length ? rows.map(function (r) {
return '<article><b>Day ' + num(r.day, 0) + ' · ' + (r.correct ? 'Correct' : 'Not correct') + '</b><p>' + esc(r.question) + '</p>' +
'<p>Your answer: ' + esc((r.options || [])[num(r.chosen, -1)] || 'No answer') + '<br>Correct answer: ' + esc((r.options || [])[num(r.correct_idx, -1)] || '—') + '</p>' +
(r.fact ? '<p>' + esc(r.fact) + '</p>' : '') + '</article>';
}).join('') : '<p>The house returned no review rows.</p>') +
'<button type="button" class="g102-quiet" data-g102="back-result">Back to the result</button></div>');
}
function summaryHTML(x, name) {
var score = num(x.score, 0), total = num(x.questions || x.days, 0), rank = rankOf(x), perfect = total > 0 && score === total;
var line = rank === 'IVORY SAGE' ? 'A perfect ' + total + '. Not one story slipped past you.' : rank === 'STORYTELLER' ? 'You know our stories well.' : rank === 'KEEPER' ? 'You keep the stories safe.' : 'Curiosity is where every story begins.';
return '<div class="g102-summary ' + (perfect ? 'perfect' : '') + '"><div class="g102-result-burst" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="g102-coin">I</span><p class="g102-eyebrow">YOUR SCORE · ' + esc(name) + '</p>' +
'<h3 class="g102-score"><b>' + score + '</b><span>/' + total + '</span></h3><h4 class="g102-rank">' + rank + '</h4><p class="g102-rank-line">' + esc(line) + '</p>' +
'<div class="g102-gold"><span>YOUR VAULT</span><b>' + money(x.total_inr) + '</b><small>' + (S.rehearsal ? 'rehearsal gold only' : 'golden credit') + '</small></div>' +
'<div class="g102-breakdown"><p>Right answers <b>' + money(x.answers_inr) + '</b></p>' + (num(x.bonus_inr, 0) > 0 ? '<p>Perfect-round bonus <b>' + money(x.bonus_inr) + '</b></p>' : '') + '</div>' +
(x.expires_at ? '<p class="g102-expiry"><b data-expiry="' + esc(x.expires_at) + '" data-expiry-label="Turns to dust in " data-expiry-done="This gold has reached its server-owned expiry."></b><small>Spend it on any membership priced above it.</small></p>' : '') +
(!num(x.total_inr, 0) && !S.rehearsal ? '<p class="g102-fine">No gold this time. Your next opening appears when the house says the wait is over.</p>' : '') + '</div>';
}
function shareScore() {
var x = S.mode === 'vault' ? (S.vaultResult || {}) : (S.quizSummary || {}), name = S.mode === 'vault' ? 'The Ten-Day Vault' : 'The Golden Knock-off';
var text = 'I scored ' + num(x.score, 0) + '/' + num(x.questions || x.days, 0) + ' on ' + name + ' in Ivory' + (num(x.total_inr, 0) > 0 ? ' and earned ' + money(x.total_inr) + ' off a membership' : '') + '. Where every story leaves a mark.';
function copied() { toast('Your score is copied, ready to share.'); }
if (navigator.share) { navigator.share({ title: name, text: text }).catch(function (e) { if (!e || e.name !== 'AbortError') { if (navigator.clipboard) navigator.clipboard.writeText(text).then(copied).catch(function () { toast(text); }); else toast(text); } }); return; }
if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(copied).catch(function () { toast(text); }); return; }
var ta = d.createElement('textarea'); ta.value = text; ta.className = 'iv-copy-fallback'; d.body.appendChild(ta); ta.select();
try { if (d.execCommand('copy')) copied(); else toast(text); } catch (e) { toast(text); } ta.remove();
}
function quizHome(seq) {
closeTimer(); scene('home');
rpc('quiz_home_state').then(function (r) {
if (!valid(seq)) return;
var s = map(r); readClock(s); S.quiz = s; S.rehearsal = s.rehearsal === true; paintQuizCard(s);
heading('Ten questions · every answer from the house', 'The Golden Knock-off');
var phase = String(s.state || 'signed_out');
if (phase === 'playing') { quizResume(seq); return; }
if (phase === 'ready') {
body('<div class="g102-intro"><p class="g102-eyebrow">The rapid-fire round</p><h3>Ten questions. Thirty seconds each.</h3>' +
'<p>The topic, order, timer, scoring and gold all come from the house. A correct answer is revealed only after you answer.</p>' +
'<div class="g102-facts"><span><b>' + num(s.total, 10) + '</b>questions</span><span><b>' + num(s.question_seconds, 30) + '</b>seconds each</span><span><b>' + money(s.max_per_answer) + '</b>up to each answer</span></div>' +
'<button type="button" class="g102-primary" data-g102="begin-quiz">Unseal the topic</button></div>');
} else {
var text = phase === 'gold' ? 'Your golden credit is waiting to be spent.' :
phase === 'cooling' || phase === 'dust' ? 'This round has finished. The Home card will say when the next opens.' :
phase === 'paid' ? 'Your golden credit has been used.' :
phase === 'closed' ? 'The Golden Knock-off is not open right now.' : 'The Golden Knock-off is not open for you right now.';
body('<div class="g102-intro"><h3>' + esc(text) + '</h3>' +
(num(s.credit_inr, 0) ? '<div class="g102-gold"><b>' + money(s.credit_inr) + '</b><span>golden credit</span></div>' : '') +
(s.next_open_at ? '<p>Next opening: ' + esc(when(s.next_open_at)) + '</p>' : '') +
'<div class="g102-row">' + (num(s.credit_inr, 0) > 0 ? '<button type="button" class="g102-primary" data-g102="membership">See memberships</button>' : '') +
'<button type="button" class="g102-quiet" data-g102="leave">Close</button></div></div>');
}
status(S.rehearsal ? 'Admin rehearsal: canonical answers, no member-visible reward.' : '');
}).catch(function (e) { if (valid(seq)) errorView(msg(e), 'retry'); });
}
function quizResume(seq) {
loading('Resuming the open round…');
rpc('quiz_resume').then(function (r) {
if (!valid(seq)) return;
if (!r) { errorView('The open round could not be resumed. Try reading it again.', 'retry'); return; }
var x = map(r); S.rehearsal = x.rehearsal === true || S.rehearsal; if (x.topic_title) heading(x.topic_title, 'The Golden Knock-off'); showQuestion('quiz', map(x.next));
}).catch(function (e) { if (valid(seq)) errorView(msg(e), 'retry'); });
}
function quizStart() {
var seq = S.seq; S.busy = true; clearFx(); scene('opening'); loading('Unsealing the topic…');
rpc('quiz_start').then(function (r) {
if (!valid(seq)) return; S.busy = false;
var x = map(r); S.rehearsal = x.rehearsal === true || S.rehearsal;
if (x.topic_title) heading(x.topic_title, 'The Golden Knock-off');
if (x.resumed === true) showQuestion('quiz', map(x.next)); else showTopicReveal(x, seq);
}).catch(function (e) { if (valid(seq)) { S.busy = false; errorView(msg(e), 'begin-quiz'); } });
}
function showTopicReveal(x, seq) {
closeTimer(); clearFx(); scene('reveal'); S.question = null; S.pending = null; S.protect = true;
heading('Unsealing your topic', 'The Golden Knock-off');
body('<div class="g102-topic-reveal"><p class="g102-eyebrow">UNSEALING YOUR TOPIC</p><div class="g102-seal-orbit" aria-hidden="true"><span class="g102-topic-coin">I</span>' +
Array.apply(null, Array(10)).map(function (_, i) { return '<i data-seal="' + i + '" style="--i:' + i + '">' + (i + 1) + '</i>'; }).join('') + '</div>' +
'<div class="g102-topic-words"><small>YOUR TOPIC</small><h3>' + esc(x.topic_title || 'The Golden Knock-off') + '</h3><p>' + esc(x.topic_tagline || '') + '</p></div></div>');
status(S.rehearsal ? 'Admin rehearsal · the same canonical topic ceremony, no member reward' : 'Ten seals. One secret topic. The first clock begins with the question.');
for (var i = 0; i < 25; i++) (function (step) { later(function () { if (!valid(seq)) return; var seal = $('[data-seal="' + (step % 10) + '"]'); if (seal) { seal.classList.remove('lit'); void seal.offsetWidth; seal.classList.add('lit'); } sound('seal', Math.floor(step * 10 / 25)); }, step * 100); })(i);
later(function () { if (!valid(seq)) return; var room = $('.g102-topic-reveal'); if (room) room.classList.add('is-revealed'); var kick = $('.g102-topic-reveal > .g102-eyebrow'); if (kick) kick.textContent = 'YOUR TOPIC'; sound('reveal'); }, 2900);
later(function () { if (valid(seq)) showQuestion('quiz', map(x.next)); }, 4800);
}
function showQuestion(mode, q) {
closeTimer(); clearFx(); scene('question');
if (!q || !num(q.question_id, 0)) { errorView('The house returned no question. Try opening it again.', 'retry'); return; }
S.mode = mode; S.question = q; S.protect = true; S.busy = false; S.pending = null; S.lastTick = 99;
var state = mode === 'vault' ? (S.vault || {}) : (S.quiz || {});
S.totalSeconds = Math.max(1, num(state.question_seconds, num(q.seconds_left, 30) || 30));
S.deadline = Date.now() + Math.max(0, num(q.seconds_left, 0)) * 1000;
var options = Array.isArray(q.options) ? q.options : [];
var position = mode === 'vault' ? 'Day ' + num(q.day_no, 1) + ' of ' + num(q.days, 10) : 'Question ' + num(q.position, 1) + ' of ' + num(q.total, 10);
var at = mode === 'vault' ? num(q.day_no, 1) : num(q.position, 1), total = Math.max(1, Math.min(50, mode === 'vault' ? num(q.days, 10) : num(q.total, 10)));
var progress = Array.apply(null, Array(total)).map(function (_, i) { return '<i class="' + (i < at ? 'on' : '') + '"></i>'; }).join('');
body('<div class="g102-question"><div class="g102-qtop"><div><p class="g102-eyebrow">' + esc(position) + '</p>' +
(mode === 'quiz' ? '<span class="g102-running-pot">YOUR GOLD <b>' + money(q.running_inr) + '</b></span>' : '') + '</div><span class="g102-clock" id="g102-clock" role="timer" style="--progress:1">—</span></div>' +
'<div class="g102-progress" aria-hidden="true">' + progress + '</div><h3>' + esc(q.question) + '</h3>' + (q.tagline ? '<p class="g102-tagline">' + esc(q.tagline) + '</p>' : '') + '<div class="g102-options">' +
options.map(function (text, i) { return '<button type="button" class="g102-option" data-choice="' + i + '" style="--i:' + i + '"><span>' + String.fromCharCode(65 + i) + '</span><p>' + esc(text) + '</p></button>'; }).join('') +
'</div><p class="g102-fine">' + (mode === 'vault' ? 'Your choice is final, and sealed until Day ' + num(q.days, 10) + '.' : 'Your choice is final once the house accepts it.') + '</p></div>');
status(S.rehearsal ? 'Admin rehearsal · no member progress or reward' : '');
tick(); S.timer = setInterval(tick, 100);
}
function tick() {
if (!S.question || !S.open) { closeTimer(); return; }
if (S.busy) return;
var precise = Math.max(0, (S.deadline - Date.now()) / 1000), left = Math.max(0, Math.ceil(precise));
var clock = $('#g102-clock');
if (clock) { clock.textContent = left; clock.setAttribute('aria-label', left + ' seconds left'); clock.classList.toggle('urgent', left <= 5); clock.style.setProperty('--progress', Math.max(0, Math.min(1, precise / S.totalSeconds))); }
if (left <= 5 && left > 0 && left !== S.lastTick) sound('tick'); S.lastTick = left;
if (left <= 0 && !S.busy) { closeTimer(); submitAnswer(-1); }
}
function submitAnswer(choice) {
if (S.busy || !S.question) return;
var q = S.question, mode = S.mode, seq = S.seq;
S.busy = true; S.lastChoice = choice;
$$('.g102-option').forEach(function (b) { b.disabled = true; b.classList.toggle('chosen', num(b.dataset.choice, -2) === choice); });
status(choice < 0 ? 'Time is up. Sealing the missed answer…' : 'Sealing your answer…');
var name = mode === 'vault' ? 'vault_answer' : 'quiz_answer';
var params = mode === 'vault'
? { run_id_in: num(q.run_id, 0), question_id_in: num(q.question_id, 0), choice_in: choice }
: { attempt_id_in: num(q.attempt_id, 0), question_id_in: num(q.question_id, 0), choice_in: choice };
rpc(name, params).then(function (r) {
if (!valid(seq)) return; S.busy = false; closeTimer();
var a = map(r);
if (mode === 'vault') {
S.question = null; S.protect = false;
if (a.finished === true) { vaultResult(q.run_id, seq); }
else { loading('The key has turned.'); vaultHome(seq, true); }
} else {
if (a.late === true || a.correct == null) { showQuizSummary(a.summary || a); return; }
if (a.finished === true && !a.summary) { quizHome(seq); return; }
S.pending = a;
if (a.finished === true && a.summary && a.correct == null) { showQuizSummary(a.summary); return; }
showQuizFeedback(a);
}
}).catch(function (e) {
if (!valid(seq)) return; S.busy = false;
var expired = Date.now() >= S.deadline;
$$('.g102-option').forEach(function (b) { b.disabled = expired; });
var oldRetry = $('.g102-retry-answer'); if (oldRetry) oldRetry.remove();
if (expired) {
closeTimer();
var retry = d.createElement('button'); retry.type = 'button'; retry.className = 'g102-primary g102-retry-answer';
retry.dataset.g102 = 'retry-answer'; retry.textContent = 'Retry the same submission';
var qbox = $('.g102-question'); if (qbox) qbox.appendChild(retry);
}
status(msg(e) + ' Your answer has not been sealed.' + (expired ? ' Retry sends the original timeout/choice; the clock is not extended.' : ''), true);
});
}
function showQuizFeedback(a) {
clearAdvance(); S.protect = true; scene(a.correct ? 'correct' : 'wrong');
var correctIdx = num(a.correct_idx, -1), q = S.question || {}, options = q.options || [], seq = S.seq;
body('<div class="g102-feedback ' + (a.correct ? 'is-correct' : 'is-wrong') + '"><div class="g102-verdict-icon" aria-hidden="true">' + (a.correct ? '✓' : '×') + '</div><p class="g102-eyebrow">' + (a.correct ? (a.golden ? 'Golden answer' : 'Correct') : (S.lastChoice < 0 ? 'Time ran out' : 'Not this one')) + '</p>' +
'<h3>' + (a.correct ? '+' + money(a.amount_inr) + ' in this round' : 'The answer is now open') + '</h3>' +
(correctIdx >= 0 ? '<p>Correct answer: <b>' + esc(options[correctIdx] || String.fromCharCode(65 + correctIdx)) + '</b></p>' : '') +
(a.fact ? '<p class="g102-fact">' + esc(a.fact) + '</p>' : '') +
'<div class="g102-gold"><b>' + money(a.running_inr) + '</b><span>running gold, from the house</span></div>' +
'<button type="button" class="g102-primary" data-g102="next-quiz">' + (a.finished ? 'See the result' : 'Next question') + '</button><div class="g102-auto" aria-hidden="true"><i></i></div><p class="g102-fine">Continues automatically in 4.5 seconds.</p></div>');
status(S.rehearsal ? 'Admin rehearsal · displayed gold is not a member reward' : '');
sound(a.correct ? (a.golden ? 'golden' : 'correct') : (S.lastChoice < 0 ? 'timeout' : 'wrong'));
S.advanceTimer = setTimeout(function () { S.advanceTimer = 0; if (valid(seq) && S.pending === a) nextQuiz(); }, 4500);
}
function nextQuiz() {
clearAdvance(); var a = S.pending; if (!a) return;
if (a.finished === true && a.summary) { showQuizSummary(a.summary); return; }
if (a.next) { showQuestion('quiz', a.next); return; }
errorView('The house returned no next question.', 'retry');
}
function showQuizSummary(summary) {
closeTimer(); clearFx();
var x = map(summary); S.quizSummary = x; readClock(x); S.rehearsal = x.rehearsal === true || S.rehearsal; S.protect = false; S.question = null; S.pending = null;
scene('result'); heading('The round is complete', 'The Golden Knock-off');
body(summaryHTML(x, 'The Golden Knock-off') + '<div class="g102-row">' +
(num(x.total_inr, 0) > 0 && !S.rehearsal ? '<button type="button" class="g102-primary" data-g102="membership">Spend my gold</button>' : '') +
'<button type="button" class="g102-quiet" data-g102="share">Share my score</button><button type="button" class="g102-quiet" data-g102="leave">Done</button></div>');
status(S.rehearsal ? 'Admin rehearsal result — no member reward was created.' : ''); startResultClock();
var total = num(x.questions || x.days, 0); sound(total > 0 && num(x.score, 0) === total ? 'perfect' : num(x.total_inr, 0) > 0 && !S.rehearsal ? 'win' : 'lose');
}
function dayTap(day) {
var s = S.vault || {}, answered = num(s.answered, 0), current = num(s.day_no, 1), phase = String(s.state || '');
if (day <= answered) { status('Day ' + day + ' is sealed. Its answer stays hidden until the vault opens.'); return; }
if (day === current && (phase === 'ready' || phase === 'open')) {
vaultDayTitle(phase === 'ready', S.seq); return;
}
status('Day ' + day + ' is still locked. Day ' + current + ' must turn first' + (s.next_opens_at ? '; the next opening is ' + when(s.next_opens_at) : '') + '.');
}
function action(e) {
if (S.soundOn) audio();
var choice = e.target.closest('[data-choice]');
if (choice && $('#gold102').contains(choice)) { e.preventDefault(); submitAnswer(num(choice.dataset.choice, -1)); return; }
var day = e.target.closest('[data-day]');
if (day && $('#gold102').contains(day)) { e.preventDefault(); dayTap(num(day.dataset.day, 0)); return; }
var b = e.target.closest('[data-g102]'); if (!b) return;
var what = b.dataset.g102; e.preventDefault();
if (what === 'close') askClose();
else if (what === 'sound') toggleSound();
else if (what === 'share') shareScore();
else if (what === 'stay') $('#g102-confirm').hidden = true;
else if (what === 'leave') finishClose();
else if (what === 'retry') { if (S.mode === 'vault') vaultHome(S.seq); else quizHome(S.seq); }
else if (what === 'begin-vault') vaultDayTitle(true, S.seq);
else if (what === 'open-key') vaultDayTitle(false, S.seq);
else if (what === 'vault-next') rehearsalVault('next');
else if (what === 'vault-reset') rehearsalVault('reset');
else if (what === 'begin-quiz') quizStart();
else if (what === 'next-quiz') nextQuiz();
else if (what === 'review-vault') reviewVault();
else if (what === 'skip-ceremony') finishVaultCeremony();
else if (what === 'back-result') showVaultResultSummary(S.vaultResult || {}, true);
else if (what === 'retry-answer') { S.busy = false; submitAnswer(S.lastChoice); }
else if (what === 'membership') { finishClose(); if (w.IVHOUSE102) IVHOUSE102.go('premium'); else if (w.ivoryShow) ivoryShow('premium'); }
}
function paintVaultCard(s) {
var card = $('.card.c-rose'); if (!card) return;
var state = String(s.state || ''), day = num(s.day_no, 1), answered = num(s.answered, 0), days = num(s.days, 10);
var lede = $('.lede', card), kick = $('.vaultfoot .kicker', card), note = $('.vaultfoot .note', card), clock = $('.vaultfoot .clock', card);
if (lede) lede.textContent = state === 'ready' ? 'A fresh ten-day vault is ready.' : state === 'open' ? 'Day ' + day + ' is waiting. One question, one key.' : state === 'sealed' ? 'Day ' + answered + ' is sealed. Well turned.' : state === 'ceremony' ? 'The last key has turned. Open your vault.' : state === 'resting' ? 'Your vault is resting until the next run.' : 'Open to read your Ten-Day Vault.';
if (kick) kick.textContent = state === 'sealed' ? 'Next key' : state === 'ceremony' ? 'The vault is open' : 'Ten daily keys';
if (note) note.textContent = s.next_opens_at && state === 'sealed' ? 'Next key: ' + when(s.next_opens_at) : 'Your answers stay sealed until the final day.';
if (clock) clock.hidden = true;
var bar = $('.keybar', card);
if (bar) bar.innerHTML = Array.apply(null, Array(days)).map(function (_, i) { var n = i + 1; return '<i class="' + (n <= answered ? 'got' : '') + '" title="Day ' + n + (n <= answered ? ' sealed' : '') + '"><span>' + n + '</span></i>'; }).join('');
}
function paintQuizCard(s) {
var card = $('.card.c-gold'); if (!card) return;
var state = String(s.state || ''), lede = $('.lede', card), kick = $('.kicker', card), note = $('.note', card), clock = $('.clock', card);
if (lede) { lede.classList.remove('crossed'); lede.textContent = state === 'ready' ? 'A fresh Golden Knock-off is ready.' : state === 'playing' ? 'Your round is open. Resume from the next question.' : state === 'gold' ? money(s.credit_inr) + ' in golden credit is waiting.' : state === 'dust' ? 'This round’s unspent gold has faded.' : 'Open to read your Golden Knock-off.'; }
if (kick) kick.textContent = state === 'playing' ? 'Round in progress' : state === 'ready' ? 'The topic is sealed' : 'The Golden Knock-off';
if (note) note.textContent = s.next_open_at ? 'Next opening: ' + when(s.next_open_at) : state === 'gold' && s.expires_at ? 'Use the gold by ' + when(s.expires_at) + '.' : 'The house owns every question, clock, answer and reward.';
if (clock) clock.hidden = true;
var bar = $('.coinbar', card);
if (bar) bar.innerHTML = Array.apply(null, Array(num(s.seal_total, 10))).map(function (_, i) { return '<i class="' + (i < num(s.seals, 0) ? 'on' : '') + '"><span>' + (i + 1) + '</span></i>'; }).join('');
}
function refreshCards() {
if (!signed()) return Promise.resolve();
return Promise.all([
rpc('vault_home_state').then(function (r) { paintVaultCard(map(r)); }).catch(function () {}),
rpc('quiz_home_state').then(function (r) { paintQuizCard(map(r)); }).catch(function () {})
]);
}
function ladderStatus(text, bad) {
var bodyEl = $('#sheet-ladder .ladder-body'); if (!bodyEl) return;
var el = $('#g102-ladder-status');
if (!el) { el = d.createElement('p'); el.id = 'g102-ladder-status'; el.className = 'iv-house-status'; bodyEl.insertBefore(el, bodyEl.firstChild); }
el.hidden = !text; el.classList.toggle('bad', !!bad); el.innerHTML = text || '';
}
function loadLadder() {
var bodyEl = $('#sheet-ladder .ladder-body'); if (!bodyEl || !signed()) { if (!signed()) toast('Sign in to read your Ladder.', true); return; }
bodyEl.classList.add('g102-resolving'); ladderStatus('Reading your Ladder…');
rpc('ladder_state').then(function (r) {
var s = map(r); S.ladder = s; renderLadder(s); bodyEl.classList.remove('g102-resolving');
ladderStatus(''); loadCalendar(false);
}).catch(function (e) {
ladderStatus(esc(msg(e)) + '<br><button type="button" class="g102-quiet" data-ladder-retry>Try again</button>', true);
});
}
function renderLadder(s) {
var root = $('#sheet-ladder'); if (!root) return;
var rung = map(s.rung), next = map(s.next), rungs = Array.isArray(s.rungs) ? s.rungs : [];
var eyebrow = $('.ld-card .ld-eyebrow', root), rank = $('.ld-rank', root), points = $('.ld-points', root), nextLine = $('.ld-next', root);
if (eyebrow) eyebrow.textContent = 'Rung ' + num(rung.n, 1) + ' of ' + (rungs.length || 12);
if (rank) rank.textContent = rung.name || 'Pearl';
if (points) points.textContent = num(s.points, 0) + ' climb points';
if (nextLine) nextLine.textContent = next.name ? Math.max(0, num(next.min, 0) - num(s.points, 0)) + ' more to reach ' + next.name : 'The Ivory Crown is yours.';
var base = num(rung.min, 0), target = num(next.min, base), fraction = next.name && target > base ? Math.max(0, Math.min(1, (num(s.points, 0) - base) / (target - base))) : 1;
var bar = $('.ld-card .ld-bar i', root); if (bar) bar.style.width = (fraction * 100).toFixed(1) + '%';
var foot = $('.lh-foot b', root); if (foot) foot.textContent = (rung.name || 'Pearl') + ' · ' + num(s.points, 0);
var list = $('.ld-list', root);
if (list) list.innerHTML = '<div class="ld-rail" aria-hidden="true"></div>' + rungs.slice().sort(function (a, b) { return num(b.min, 0) - num(a.min, 0); }).map(function (r) {
var you = num(r.n, 0) === num(rung.n, -1);
return '<div class="ld-r' + (you ? ' you' : '') + '"><span>' + esc(r.name) + '</span><b>' + (you ? 'you' : num(r.min, 0)) + '</b></div>';
}).join('');
var star = $('.ld-star .bx b', root); if (star) star.textContent = num(s.stars, 0);
var glow = map(s.glow), peal = map(s.peal), streaks = $$('.ld-streak', root);
[[glow, 'Heart glow'], [peal, 'Bell peal']].forEach(function (pair, i) {
var el = streaks[i]; if (!el) return;
var top = $('.ls-top i', el); if (top) top.textContent = num(pair[0].now, 0) + ' now · best ' + num(pair[0].best, 0);
var pills = $('.ls-pills', el), days = Array.isArray(s.milestone_days) ? s.milestone_days : [];
if (pills) pills.innerHTML = days.map(function (n) { return '<span class="' + (num(pair[0].now, 0) >= num(n, 0) ? 'w' : '') + '">' + num(n, 0) + '</span>'; }).join('');
var nextDay = days.filter(function (n) { return num(n, 0) > num(pair[0].now, 0); })[0];
var note = $('.ls-note', el); if (note) note.textContent = nextDay ? (num(nextDay, 0) - num(pair[0].now, 0)) + ' more days to your ' + nextDay + '-day mark.' : 'Every returned milestone is earned.';
});
var marks = Array.isArray(s.marks) ? s.marks : [], markBox = $('.ld-marks', root);
if (markBox) markBox.innerHTML = marks.map(function (m) {
var rarity = ['c','u','r','e','l'][Math.max(0, ['common','uncommon','rare','epic','legendary'].indexOf(String(m.rarity || 'common')))] || 'c';
return '<div class="mk ' + rarity + (m.earned ? ' lit' : '') + '" data-earned="' + (m.earned ? '1' : '0') + '" title="' + esc(m.blurb || '') + '"><span>✦</span><i>' + esc(m.name) + '</i><b>' + num(m.have, 0) + '/' + num(m.target, 1) + '</b></div>';
}).join('') || '<p class="ld-copy">No Marks have been returned.</p>';
var sub = $('.ld-sub', root); if (sub) sub.textContent = num(s.marks_earned, 0) + ' / ' + num(s.marks_total, marks.length);
$$('.mk2-lab,.mk2-grid,.mk2-filters,.ld-card.gift', root).forEach(function (el) { el.hidden = true; });
}
function ensureCalendar() {
var head = $('#sheet-ladder .ld-cal-head'); if (!head) return;
var nav = $$('.cal-nav', head);
nav.forEach(function (el, i) {
if (el.tagName === 'BUTTON') return;
var b = d.createElement('button'); b.type = 'button'; b.className = 'cal-nav'; b.dataset.calMove = i ? '1' : '-1';
b.setAttribute('aria-label', i ? 'Next month' : 'Previous month'); b.textContent = i ? '›' : '‹';
el.parentNode.replaceChild(b, el);
});
if (!S.calY) { var now = new Date(); S.calY = now.getFullYear(); S.calM = now.getMonth() + 1; }
}
function loadCalendar(move) {
ensureCalendar(); if (S.calBusy) return;
if (move) { S.calAligned = true; S.calM += move; while (S.calM < 1) { S.calM += 12; S.calY--; } while (S.calM > 12) { S.calM -= 12; S.calY++; } }
S.calBusy = true;
var y = S.calY, m = S.calM, realign = false, cal = $('#sheet-ladder .ld-cal');
if (cal) cal.setAttribute('aria-busy', 'true');
rpc('ladder_calendar', { y: y, m: m }).then(function (r) {
var x = map(r), todayKey = String(x.today || '').split('T')[0];
if (!S.calAligned && /^\d{4}-\d{2}-\d{2}$/.test(todayKey)) {
var canonical = new Date(todayKey + 'T12:00:00Z'), cy = canonical.getUTCFullYear(), cm = canonical.getUTCMonth() + 1;
S.calAligned = true;
if (cy !== num(x.year, y) || cm !== num(x.month, m)) {
S.calY = cy; S.calM = cm; realign = true;
return;
}
}
S.calAligned = true; renderCalendar(x);
}).catch(function (e) {
var card = $('#sheet-ladder .ld-cal'); if (card) card.innerHTML = '<p class="g102-cal-error">' + esc(msg(e)) + '</p><button type="button" class="g102-quiet" data-cal-retry>Retry this month</button>';
}).then(function () {
S.calBusy = false; var c = $('#sheet-ladder .ld-cal'); if (c) c.setAttribute('aria-busy', 'false');
if (realign) loadCalendar(false);
});
}
function renderCalendar(x) {
var root = $('#sheet-ladder'); if (!root) return;
var y = num(x.year, S.calY), m = num(x.month, S.calM); S.calY = y; S.calM = m;
var title = $('.ld-cal-head b', root); if (title) title.textContent = (MONTHS[m - 1] || '') + ' ' + y;
var cal = $('.ld-cal', root); if (!cal) return;
var byDay = {}; (Array.isArray(x.days) ? x.days : []).forEach(function (r) { byDay[num(r.day, 0)] = r; });
var count = new Date(y, m, 0).getDate(), blanks = Math.max(0, num(x.first_weekday, 1) - 1), todayKey = String(x.today || '').split('T')[0];
var html = '';
for (var b = 0; b < blanks; b++) html += '<span class="c off" aria-hidden="true"></span>';
for (var day = 1; day <= count; day++) {
var row = byDay[day] || {}, key = y + '-' + String(m).padStart(2, '0') + '-' + String(day).padStart(2, '0');
var cls = 'c' + (row.lit ? ' lit' : '') + (row.full ? ' star' : '') + (todayKey && key === todayKey ? ' today' : '');
html += '<span class="' + cls + '" data-date="' + key + '"' + (key === todayKey ? ' aria-current="date"' : '') + '>' + day + '</span>';
}
cal.innerHTML = html;
}
function ladderTap(e) {
var retry = e.target.closest('[data-ladder-retry]'); if (retry) { e.preventDefault(); loadLadder(); return; }
var calRetry = e.target.closest('[data-cal-retry]'); if (calRetry) { e.preventDefault(); loadCalendar(false); return; }
var move = e.target.closest('[data-cal-move]'); if (move) { e.preventDefault(); loadCalendar(num(move.dataset.calMove, 0)); return; }
var filter = e.target.closest('#sheet-ladder .ld-filters .lf'); if (filter) {
e.preventDefault(); var card = filter.closest('.ld-card'), buttons = $$('.lf', card);
buttons.forEach(function (b) { b.classList.toggle('on', b === filter); });
var which = filter.textContent.trim().toLowerCase();
$$('.ld-marks .mk', card).forEach(function (m) { m.hidden = which === 'earned' ? m.dataset.earned !== '1' : which === 'to earn' ? m.dataset.earned === '1' : false; });
}
}
function wrapLadder() {
if (!w.openSheet || w.openSheet.__gold102) return;
var base = w.openSheet;
function wrapped(id) { var r = base.apply(this, arguments); if (id === 'ladder') setTimeout(loadLadder, 30); return r; }
['__p92','__p94','__folio','__house102'].forEach(function (k) { if (base[k]) wrapped[k] = base[k]; });
wrapped.__gold102 = true; w.openSheet = wrapped;
}
function cardTap(e) {
var t = e.target && e.target.closest ? e.target : null; if (!t) return;
var quiz = t.closest('[data-open="knock"]'), vault = t.closest('.card.c-rose');
if (!quiz && !vault) return;
e.preventDefault(); e.stopImmediatePropagation(); openMode(quiz ? 'quiz' : 'vault');
}
function cardKey(e) {
if (e.key !== 'Enter' && e.key !== ' ') return;
if (e.target.closest && e.target.closest('.card.c-rose,[data-open="knock"]')) cardTap(e);
}
function boot() {
shell(); wrapLadder(); ensureCalendar();
d.addEventListener('click', cardTap, true); d.addEventListener('keydown', cardKey, true); d.addEventListener('click', ladderTap, true);
paintVaultCard({ state: '' }); paintQuizCard({ state: '' });
setTimeout(refreshCards, 900);
if (w.IVSESS && IVSESS.on) IVSESS.on(function () { setTimeout(refreshCards, 500); });
}
if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
return { openVault: function () { openMode('vault'); }, openQuiz: function () { openMode('quiz'); }, close: finishClose,
refreshCards: refreshCards, loadLadder: loadLadder, loadCalendar: loadCalendar,
state: function () { return { mode: S.mode, open: S.open, rehearsal: S.rehearsal, vault: S.vault, quiz: S.quiz, calY: S.calY, calM: S.calM }; } };
})();

window.IVLIVE102 = (function () {
'use strict';
var w = window, seq = 0, busy = false, gateReturn = null;
function toast(text, bad) { if (w.ivoryToast) w.ivoryToast(text, !!bad); }
function signed() { try { return !!(w.IVSESS && IVSESS.ident().id); } catch (e) { return false; } }
function discBusy(on) {
['iv-live-disc', 'iv-live-ribbon'].forEach(function (id) {
var disc = document.getElementById(id);
if (disc) { disc.setAttribute('aria-busy', on ? 'true' : 'false'); disc.disabled = !!on; }
});
}
function closeGate() {
var wrap = document.getElementById('sheet-live-plans');
if (wrap) { wrap.classList.remove('show'); wrap.setAttribute('aria-hidden', 'true'); }
if (!document.querySelector('.ivsheet-wrap.show')) document.body.classList.remove('sheet-open');
if (gateReturn && gateReturn.isConnected) { try { gateReturn.focus(); } catch (e) {} }
gateReturn = null;
}
function planName(level) {
return ({ 0: 'Forever Ivory Member', 1: 'Ivory Reader', 2: 'Ivory Listener', 3: 'Ivory Insider', 4: 'Ivory Circle' })[Number(level)] || ('membership level ' + Number(level));
}
function eligiblePlans(row) {
var levels = Array.isArray(row.allowed_tiers) ? row.allowed_tiers : [];
var seen = {}, names = [];
levels.forEach(function (level) { var k = String(level); if (!seen[k]) { seen[k] = true; names.push(planName(level)); } });
if (!names.length && row.tier_name) names.push(String(row.tier_name));
if (!names.length && Number(row.min_tier) > 0 && Number(row.min_tier) < 9) names.push(planName(row.min_tier));
return names;
}
function showGate(row) {
var id = 'sheet-live-plans', wrap = document.getElementById(id);
if (!wrap) {
wrap = document.createElement('div'); wrap.id = id; wrap.className = 'ivsheet-wrap';
wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true'); wrap.setAttribute('aria-hidden', 'true');
wrap.setAttribute('aria-labelledby', 'lv-plan-title');
wrap.innerHTML = '<div class="ivsheet-scrim" data-lv-plan-close></div>' +
'<section class="ivsheet p94-sheet"><span class="ivsheet-grip" aria-hidden="true"></span>' +
'<header class="ivsheet-head"><button class="ivsheet-back" type="button" data-lv-plan-close aria-label="Back">‹</button>' +
'<h2>Ivory is Live</h2><span class="ivsheet-head-sp"></span></header>' +
'<div class="ivsheet-body"><div class="lv-plan-gate"><span class="lv-plan-gate-disc" aria-hidden="true">I</span>' +
'<h3 id="lv-plan-title">A place in this Live</h3><p id="lv-plan-copy"></p>' +
'<p class="lv-plan-eligible" id="lv-plan-eligible"></p>' +
'<button class="dk-btn" id="lv-plan-go" type="button">SEE ELIGIBLE MEMBERSHIP PLANS</button>' +
'<button class="dk-btn lv-plan-later" type="button" data-lv-plan-close>NOT NOW</button></div></div></section>';
(document.body || document.documentElement).appendChild(wrap);
Array.prototype.forEach.call(wrap.querySelectorAll('[data-lv-plan-close]'), function (b) { b.addEventListener('click', closeGate); });
wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); closeGate(); } });
document.getElementById('lv-plan-go').addEventListener('click', function () {
closeGate();
if (w.ivShell && ivShell.shutAll) ivShell.shutAll();
if (w.ivoryShow) ivoryShow('premium');
});
}
var names = eligiblePlans(row), priced = Number(row.price_inr || 0) > 0;
document.getElementById('lv-plan-title').textContent = row.title || 'A place in this Live';
document.getElementById('lv-plan-copy').textContent = priced
? 'This Live has its own ₹' + Number(row.price_inr || 0).toLocaleString('en-IN') + ' door price. The server—not this screen—decides whether your pass or membership opens it.'
: 'Your current membership does not include this Live. Choose an eligible plan, then come back while Ivory is still on air.';
document.getElementById('lv-plan-eligible').textContent = names.length
? 'Included with: ' + names.join(' · ')
: (priced ? 'A Live pass is required for this separately priced room.' : 'The eligible membership will be named at the server door.');
var go = document.getElementById('lv-plan-go');
go.hidden = priced && !names.length;
go.textContent = names.length ? 'SEE ELIGIBLE MEMBERSHIP PLANS' : 'SEE MEMBERSHIP PLANS';
gateReturn = document.activeElement;
if (w.openSheet) w.openSheet('live-plans');
else { wrap.classList.add('show'); wrap.setAttribute('aria-hidden', 'false'); document.body.classList.add('sheet-open'); }
setTimeout(function () { var b = go.hidden ? wrap.querySelector('.lv-plan-later') : go; if (b && b.focus) b.focus(); }, 40);
return false;
}
function watchRow(row) {
if (!row || row.status !== 'live') return false;
if (row.is_entitled === false) return showGate(row);
if (!w.IVLIVE || !IVLIVE.watch) { toast('The full-screen room is still loading. Try again.', true); return false; }
IVLIVE.watch({
id: row.id,
title: row.title || 'Ivory is Live',
sub: row.subtitle || '',
price: Number(row.price_inr || 0),
seatPrice: Number(row.guest_price_inr || 0),
allowed: Array.isArray(row.allowed_tiers) ? row.allowed_tiers : [],
minTier: Number(row.min_tier || 0),
tierName: row.tier_name || '',
hostVideo: row.host_video_enabled !== false,
startedAt: row.started_at || null
});
return true;
}
function openCurrent() {
var mine = ++seq;
if (!signed()) {
toast('Sign in to walk into Ivory’s live room.', true);
if (w.IVOPENING && IVOPENING.open) IVOPENING.open();
return Promise.resolve(false);
}
if (!w.IVSESS || !IVSESS.get) { toast('The session circuit is unavailable.', true); return Promise.resolve(false); }
if (busy) return Promise.resolve(false);
busy = true; discBusy(true);
return IVSESS.get('/rest/v1/live_public?select=id,title,subtitle,status,is_entitled,price_inr,guest_price_inr,allowed_tiers,min_tier,tier_name,host_video_enabled,started_at&status=eq.live&order=started_at.desc&limit=1', { cache: 'no-store' })
.then(function (rows) {
if (mine !== seq) return false;
var row = rows && rows[0];
if (!row) {
toast('Ivory is not live right now.');
if (w.ivoryShow) ivoryShow('live');
return false;
}
return watchRow(row);
}).catch(function (e) {
if (mine === seq) toast((e && e.message) || 'The live room could not be read. Try again.', true);
return false;
}).then(function (result) {
if (mine === seq) { busy = false; discBusy(false); }
return result;
});
}
function boot() {
var old = w.ivLive || {};
w.ivLive = { open: openCurrent, refresh: old.refresh };
w.addEventListener('iv-live-ended', function () { seq++; busy = false; discBusy(false); closeGate(); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
return { open: openCurrent, watchRow: watchRow, closeGate: closeGate, busy: function () { return busy; } };
})();

