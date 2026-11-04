/* Pass 98 · one shared APK/web content contract.
   Feed: post_previews. Full posts: open_post. Polls: poll_results + poll_votes.
   No media reference is invented, no locked post is opened by a client-side shortcut. */
window.IVCONTENT = (function () {
  'use strict';
  var IV = window.IVSESS;
  var S = {
    posts: [], polls: {}, mine: {}, voters: {}, adminPosts: {}, fullPosts: {}, previewUrls: {}, previewRetry: {},
    filter: 'all', seq: 0, renderSeq: 0, loading: null, last: 0, err: null,
    openId: null, openSeq: 0, giftReq: 0, voting: {}, viewHour: -1, viewCache: {}
  };
  var LABEL = { video: 'VIDEO', audio: 'AUDIO', blog: 'STORY', image: 'PHOTO', poll: 'POLL' };
  var ACTION = { video: 'Watch', audio: 'Listen', blog: 'Read', image: 'View', poll: 'Vote' };

  function $(id) { return document.getElementById(id); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(v) { return Number(v) || 0; }
  function group(v) { return String(Math.round(num(v))).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function money(v) { return '₹' + group(v); }
  function cleanTitle(v) { return String(v || 'Untitled').replace(/^\[SAMPLE\] /, ''); }
  function house() { return !!(window.ivIsAdmin && window.ivIsAdmin()); }
  function uid() { var id = IV && IV.ident ? IV.ident() : {}; return id && id.id ? id.id : null; }
  function toast(message, bad) { if (window.ivoryToast) window.ivoryToast(message, bad); }
  function locked(p) { return num(p.tier_required) > 0 && p.is_unlocked !== true; }
  function get(path) { return IV.get(path); }
  function call(path, body) { return IV.call(path, body || {}); }
  function encodePath(path) { return String(path || '').split('/').map(encodeURIComponent).join('/'); }
  function safeUrl(url) { return typeof url === 'string' && /^https:\/\//i.test(url) ? url : null; }
  function postById(id) {
    id = Number(id);
    return S.posts.filter(function (p) { return Number(p.id) === id; })[0] || S.adminPosts[id] || null;
  }

  function send(path, body, prefer) {
    var headers = IV.headers();
    headers['Content-Type'] = 'application/json';
    if (prefer) headers.Prefer = prefer;
    return fetch(IV.sb + path, { method: 'POST', headers: headers, body: JSON.stringify(body || {}) })
      .then(function (r) {
        return r.text().then(function (text) {
          var data = null;
          try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
          if (!r.ok) throw new Error((data && (data.message || data.error || data.hint)) || ('The house answered HTTP ' + r.status + '.'));
          return data;
        });
      });
  }

  /* Dart's native 64-bit integer operations, kept exact with BigInt. */
  function noise(id, salt) {
    var h = (BigInt(id) * 2654435761n) ^ (BigInt(salt) * 40503n + 0x9E3779B9n);
    h ^= h >> 13n;
    h &= 0x3FFFFFFFn;
    h = (h * 1274126177n) & 0x3FFFFFFFn;
    h ^= h >> 11n;
    return Number(h & 0x3FFFFFFFn);
  }
  function frac(id, salt) { return (noise(id, salt) % 10000) / 10000; }
  function ceilingFor(id) { return 2300 + noise(id, 7) % 651; }
  function peakDaysFor(id) { return 15 + noise(id, 13) % 5; }
  function dayWeight(id, day) {
    var base = 0.74 + frac(id, 100 + day) * 0.70;
    return day <= 2 ? base * 1.18 : base;
  }
  function seededAt(id, created, now) {
    var ceiling = ceilingFor(id), peakDays = peakDaysFor(id);
    var seed = 28 + noise(id, 23) % 26;
    var hourOne = 186 + noise(id, 31) % 44;
    var minutes = Math.floor((now.getTime() - created.getTime()) / 60000);
    if (minutes < 60) {
      var t = minutes <= 0 ? 0 : minutes / 60;
      return seed + Math.round((hourOne - seed) * t);
    }
    var days = minutes / 1440;
    if (days >= peakDays) {
      var settled = Math.round(ceiling * 0.94);
      var drift = 3 + frac(id, 57) * 9;
      return Math.min(ceiling, settled + Math.round((days - peakDays) * drift));
    }
    var total = 0, d;
    for (d = 1; d <= peakDays; d++) total += dayWeight(id, d);
    var room = Math.round(ceiling * 0.94) - hourOne;
    var wholeDays = Math.floor(days), partDay = days - wholeDays, done = 0;
    for (d = 1; d <= wholeDays; d++) done += dayWeight(id, d);
    done += dayWeight(id, wholeDays + 1) * partDay;
    return hourOne + Math.round(room * (done / total));
  }
  /* Exact frozen-APK member display bloom, not a true server view count.
     Kept so APK/web member cards agree; the admin desk uses true view_count. */
  function viewBloom(p, now) {
    if (!p || p.type === 'poll' || !p.created_at) return null;
    var created = new Date(p.created_at);
    if (!isFinite(created.getTime())) return null;
    now = now || new Date();
    var hours = Math.floor((now.getTime() - created.getTime()) / 3600000);
    if (hours < 0) return num(p.view_count) > 0 ? num(p.view_count) : null;
    var hourKey = Math.floor(now.getTime() / 3600000);
    if (hourKey !== S.viewHour) { S.viewCache = {}; S.viewHour = hourKey; }
    var id = Number(p.id);
    if (S.viewCache[id] == null) S.viewCache[id] = seededAt(id, created, now);
    return S.viewCache[id] + num(p.view_count);
  }
  function relativeTime(p, now) {
    if (!p.created_at) return '';
    var created = new Date(p.created_at), ms = (now || new Date()).getTime() - created.getTime();
    if (!isFinite(ms)) return '';
    var days = Math.floor(ms / 86400000), hours = Math.floor(ms / 3600000), minutes = Math.floor(ms / 60000);
    if (days > 365) return Math.floor(days / 365) + 'y ago';
    if (days > 30) return Math.floor(days / 30) + 'mo ago';
    if (days > 0) return days + 'd ago';
    if (hours > 0) return hours + 'h ago';
    if (minutes > 0) return minutes + 'm ago';
    return 'just now';
  }
  function duration(p) {
    var s = Math.floor(num(p.duration_secs));
    if (s <= 0) return '';
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    function two(n) { return String(n).padStart(2, '0'); }
    return h ? h + ':' + two(m) + ':' + two(sec) : m + ':' + two(sec);
  }

  function pollMaths(options) {
    var total = 0, best = 0, percents = {};
    (options || []).forEach(function (o) { total += num(o.votes); });
    (options || []).forEach(function (o) {
      var pct = total ? Math.round(num(o.votes) * 100 / total) : 0;
      percents[o.option_id] = pct;
      if (pct > best) best = pct;
    });
    return { total: total, best: best, percents: percents };
  }
  function tally(total) { return total === 1 ? '1 member has answered' : group(total) + ' members have answered'; }

  function pollMarkup(p, detail, admin) {
    var options = S.polls[p.id] || [], mine = S.mine[p.id], maths = pollMaths(options);
    var isLocked = admin ? false : locked(p), revealed = admin || (!isLocked && (house() || mine != null));
    var question = String(p.summary || '').trim() || cleanTitle(p.title);
    var shown = detail ? options : options.slice(0, 4);
    var html = '<div class="iv-poll' + (detail ? ' detail' : '') + '" data-iv-poll="' + Number(p.id) + '">' +
      '<span class="iv-type-pill">POLL</span>' +
      (question !== cleanTitle(p.title) ? '<p class="iv-poll-label">' + esc(cleanTitle(p.title)) + '</p>' : '') +
      '<h3 class="iv-poll-question">' + esc(question) + '</h3>' +
      '<p class="iv-poll-state">' + esc(isLocked ? 'Open the post to answer' : ((admin || house()) ? tally(maths.total) : (mine != null ? 'You answered' : 'Tap an option — nobody sees your name'))) + '</p>' +
      '<div class="iv-poll-options">';
    if (!options.length) html += '<p class="iv-poll-empty">The options are still arriving.</p>';
    shown.forEach(function (o) {
      var pct = maths.percents[o.option_id] || 0, selected = Number(mine) === Number(o.option_id);
      var lead = revealed && maths.total > 0 && pct === maths.best;
      html += '<button type="button" class="iv-poll-option' + (selected ? ' mine' : '') + (lead ? ' lead' : '') + '"' +
        (admin ? ' disabled' : ' data-iv-vote="' + Number(p.id) + ':' + Number(o.option_id) + '"') +
        ' style="--pct:' + (revealed ? pct : 0) + '%"' +
        ' aria-pressed="' + (selected ? 'true' : 'false') + '">' +
        '<span class="iv-poll-fill" aria-hidden="true"></span><span class="iv-poll-name">' + esc(o.label) + '</span>' +
        '<span class="iv-poll-number">' + (revealed ? pct + '%' + ((admin || house()) ? ' · ' + group(o.votes) : '') : '') + '</span></button>';
      if (detail && house() && S.voters[p.id] && (S.voters[p.id][o.option_id] || []).length) {
        html += '<p class="iv-voters">Voted: ' + esc(S.voters[p.id][o.option_id].join(', ')) + '</p>';
      }
    });
    html += '</div>';
    if (!detail && options.length > 4) {
      html += '<button type="button" class="iv-poll-more" data-iv-post-open="' + Number(p.id) + '">View all ' + options.length + ' options</button>';
    }
    if (revealed && !house()) html += '<p class="iv-poll-tally">' + esc(tally(maths.total)) + '</p>';
    if (detail && house()) html += '<p class="iv-house-counts">Only the house sees exact counts and voter names. Members see percentages after answering.</p>';
    return html + '</div>';
  }

  function card(p, compact) {
    var type = LABEL[p.type] ? p.type : 'unknown', isLocked = locked(p), views = viewBloom(p);
    if (type === 'poll') {
      return '<article class="iv-post-card iv-poll-card" data-iv-kind="poll" data-iv-post-open="' + Number(p.id) + '">' + pollMarkup(p, false) + '</article>';
    }
    var access = isLocked ? (num(p.price_inr) > 0 ? money(p.price_inr) : (p.tier_name || 'MEMBERS')) : 'Unlocked';
    var state = access ? '<span class="iv-state-pill' + (isLocked ? ' locked' : '') + '">' + esc(access) + '</span>' : '';
    var dur = duration(p);
    return '<article class="iv-post-card iv-kind-' + type + (compact ? ' compact' : '') + (isLocked ? ' is-locked' : '') + '"' +
      ' data-iv-kind="' + type + '" data-iv-post-open="' + Number(p.id) + '" tabindex="0" role="button" aria-label="' + esc((ACTION[type] || 'Open') + ': ' + cleanTitle(p.title)) + '">' +
      '<div class="iv-post-art" data-iv-art="' + Number(p.id) + '">' +
        '<span class="iv-art-mark" aria-hidden="true">' + esc((LABEL[type] || 'POST').slice(0, 1)) + '</span>' +
        '<img data-iv-thumb="' + Number(p.id) + '" alt="" loading="lazy" decoding="async" hidden>' +
        '<span class="iv-card-pills"><span class="iv-type-pill">' + esc(LABEL[type] || 'POST') + '</span>' + state + '</span>' +
        (dur ? '<span class="iv-duration">' + esc(dur) + '</span>' : '') +
      '</div><div class="iv-post-copy"><h3>' + esc(cleanTitle(p.title)) + '</h3>' +
      (p.summary ? '<p>' + esc(p.summary) + '</p>' : '') +
      '<div class="iv-post-meta"><span>' + esc(relativeTime(p)) + '</span>' +
      (views != null && views > 0 ? '<span>·</span><span data-iv-views="' + Number(p.id) + '">' + esc(group(views) + (views === 1 ? ' view' : ' views')) + '</span>' : '') +
      '<b>' + esc(ACTION[type] || 'Open') + '<i aria-hidden="true">→</i></b></div></div></article>';
  }

  function filtered() {
    if (S.filter === 'all') return S.posts;
    return S.posts.filter(function (p) {
      if (S.filter === 'story') return p.type === 'blog' || p.type === 'image';
      if (S.filter === 'voice') return p.type === 'audio';
      if (S.filter === 'cinema') return p.type === 'video';
      if (S.filter === 'poll') return p.type === 'poll';
      return true;
    });
  }
  function emptyMarkup() {
    return '<div class="iv-feed-empty"><b>The shelf is open.</b><p>Nothing has been published under this heading yet.</p></div>';
  }
  function errorMarkup() {
    return '<div class="iv-feed-empty"><b>The shelf did not answer.</b><p>' + esc(S.err || 'Check your connection and try once more.') + '</p>' +
      '<button type="button" data-iv-content-retry>Try again</button></div>';
  }
  function renderHome() {
    var box = document.querySelector('#home-screen .hp-recent .pcards');
    if (!box) return;
    if (S.err && !S.posts.length) { box.innerHTML = errorMarkup(); return; }
    if (!S.posts.length) { box.innerHTML = S.loading ? '<div class="iv-feed-loading">Opening the shared shelf…</div>' : emptyMarkup(); return; }
    box.innerHTML = S.posts.slice(0, 2).map(function (p) { return card(p, true); }).join('');
  }
  function renderLibrary() {
    var box = $('lib-feed');
    if (!box) return;
    if (S.err && !S.posts.length) { box.innerHTML = errorMarkup(); return; }
    if (!S.posts.length) { box.innerHTML = S.loading ? '<div class="iv-feed-loading">Opening the shared shelf…</div>' : emptyMarkup(); return; }
    var rows = filtered();
    box.innerHTML = (rows.length ? rows.map(function (p) { return card(p, false); }).join('') : emptyMarkup()) +
      (S.err ? '<p class="iv-feed-stale">The last refresh did not answer; the last good shelf is still here.</p>' : '');
  }
  function renderAll() {
    S.renderSeq++;
    renderHome(); renderLibrary(); renderOpenPoll();
    hydrateThumbs();
  }
  function renderOpenPoll() {
    var p = postById(S.openId);
    if (!p || p.type !== 'poll') return;
    var body = $('iv-post-body');
    if (body && $('sheet-post') && $('sheet-post').classList.contains('show')) body.innerHTML = detailMarkup(p, false);
  }

  function previewRef(p) {
    var hasThumb = p.thumb_ref != null && String(p.thumb_ref).trim();
    return {
      source: !hasThumb && p.cover_ref ? p.cover_source : p.thumb_source,
      ref: !hasThumb && p.cover_ref ? p.cover_ref : p.thumb_ref
    };
  }
  function setThumb(id, url) {
    if (!safeUrl(url)) return;
    Array.prototype.forEach.call(document.querySelectorAll('img[data-iv-thumb="' + Number(id) + '"]'), function (img) {
      img.hidden = false; img.src = url;
      img.onload = function () { img.classList.add('ready'); };
      img.onerror = function () {
        img.hidden = true; img.classList.remove('ready');
        delete S.previewUrls[id]; S.previewRetry[id] = true;
      };
      var mark = img.parentNode && img.parentNode.querySelector('.iv-art-mark');
      if (mark) mark.classList.add('behind');
    });
  }
  function hydrateThumbs() {
    if (!S.posts.length) return;
    var b2ids = [], jobs = [];
    S.posts.forEach(function (p) {
      if (p.type === 'poll') return;
      if (safeUrl(p.thumbnail_url)) setThumb(p.id, p.thumbnail_url);
      var ref = previewRef(p), raw = String(ref.ref || '').trim();
      if (!raw) return;
      var cached = S.previewUrls[p.id];
      if (cached) { setThumb(p.id, cached); return; }
      if (safeUrl(raw)) { setThumb(p.id, raw); return; }
      if (ref.source === 'youtube') { setThumb(p.id, 'https://img.youtube.com/vi/' + encodeURIComponent(raw) + '/hqdefault.jpg'); return; }
      if (ref.source === 'supabase') { setThumb(p.id, IV.sb + '/storage/v1/object/public/media/' + encodePath(raw)); return; }
      if (p.is_unlocked !== true) return;
      if (ref.source === 'b2') { b2ids.push(Number(p.id)); return; }
      if (ref.source === 'r2' && window.IVSTORE) {
        jobs.push(IVSTORE.open({ rail: 'r2', key: raw, postId: Number(p.id), field: 'thumb', fresh: !!S.previewRetry[p.id] }).then(function (url) {
          if (url) { S.previewUrls[p.id] = url; S.previewRetry[p.id] = false; setThumb(p.id, url); }
        }).catch(function () {}));
      }
    });
    if (b2ids.length && window.IVSTORE) {
      jobs.push(IVSTORE.fn('b2-media', { op: 'sign_previews', post_ids: b2ids.slice(0, 50) }).then(function (d) {
        (d.items || []).forEach(function (item) {
          if (item && safeUrl(item.url)) { S.previewUrls[item.id] = item.url; S.previewRetry[item.id] = false; setThumb(item.id, item.url); }
        });
      }).catch(function () {}));
    }
    Promise.all(jobs).catch(function () {});
  }

  function refresh(force) {
    if (!IV || !IV.get) return Promise.resolve([]);
    if (S.loading && !force) return S.loading;
    var seq = ++S.seq;
    S.err = null;
    S.loading = get('/rest/v1/post_previews?select=*&order=created_at.desc&limit=50').then(function (rows) {
      rows = Array.isArray(rows) ? rows : [];
      var pollIds = rows.filter(function (p) { return p.type === 'poll'; }).map(function (p) { return Number(p.id); });
      var jobs = [Promise.resolve([]), Promise.resolve([])];
      if (pollIds.length) {
        var ids = pollIds.join(',');
        jobs[0] = get('/rest/v1/poll_results?select=*&post_id=in.(' + ids + ')&order=sort_order.asc').catch(function () { return []; });
        if (uid()) jobs[1] = get('/rest/v1/poll_votes?select=post_id,option_id&post_id=in.(' + ids + ')&user_id=eq.' + encodeURIComponent(uid())).catch(function () { return []; });
      }
      return Promise.all(jobs).then(function (extra) {
        if (seq !== S.seq) return S.posts;
        S.posts = rows; S.polls = {}; S.mine = {};
        (extra[0] || []).forEach(function (o) {
          if (!S.polls[o.post_id]) S.polls[o.post_id] = [];
          S.polls[o.post_id].push(o);
        });
        (extra[1] || []).forEach(function (v) { S.mine[v.post_id] = Number(v.option_id); });
        S.last = Date.now(); S.err = null; S.loading = null;
        renderAll(); refreshOpenGifts();
        return rows;
      });
    }).catch(function (e) {
      if (seq === S.seq) { S.err = e && e.message ? e.message : String(e); S.loading = null; renderAll(); }
      return S.posts;
    });
    return S.loading;
  }

  function loadOnePoll(id) {
    var jobs = [get('/rest/v1/poll_results?select=*&post_id=eq.' + Number(id) + '&order=sort_order.asc')];
    if (uid()) jobs.push(get('/rest/v1/poll_votes?select=post_id,option_id&post_id=eq.' + Number(id) + '&user_id=eq.' + encodeURIComponent(uid()) + '&limit=1'));
    return Promise.all(jobs).then(function (r) {
      S.polls[id] = r[0] || [];
      if (r[1] && r[1][0]) S.mine[id] = Number(r[1][0].option_id);
      renderAll();
    });
  }
  function vote(id, optionId) {
    var p = postById(id);
    if (!p) return;
    if (locked(p)) { openPost(id); return; }
    if (!uid()) { toast('Sign in to answer this poll.', true); return; }
    if (S.voting[id]) return;
    var before = S.mine[id];
    S.voting[id] = true; S.mine[id] = Number(optionId); renderAll();
    send('/rest/v1/poll_votes?on_conflict=post_id,user_id',
      { post_id: Number(id), option_id: Number(optionId), user_id: uid() },
      'resolution=merge-duplicates,return=minimal')
      .then(function () {
        /* A later read failure must never be reported as a failed write. */
        return loadOnePoll(id).catch(function () {
          toast('Your answer is saved. The standing will refresh in a moment.');
        });
      })
      .catch(function (e) {
        S.mine[id] = before; toast((e && e.message) || 'Your answer did not save. Try once more.', true); renderAll();
      })
      .then(function () { S.voting[id] = false; renderAll(); });
  }

  function ensureSheet() {
    if ($('sheet-post')) return;
    var wrap = document.createElement('div');
    wrap.className = 'ivsheet-wrap iv-post-wrap'; wrap.id = 'sheet-post';
    wrap.setAttribute('aria-hidden', 'true'); wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', 'Ivory post');
    wrap.innerHTML = '<div class="ivsheet-scrim" data-close></div><section class="ivsheet iv-post-sheet">' +
      '<span class="ivsheet-grip" aria-hidden="true"></span><header class="ivsheet-head">' +
      '<button class="ivsheet-back" data-close aria-label="Back"><svg viewBox="0 0 24 24"><path d="M14.4 5.6L8 12l6.4 6.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<h2 id="iv-post-heading">From Ivory</h2><span class="ivsheet-head-sp"></span></header>' +
      '<div class="ivsheet-body iv-post-body" id="iv-post-body"></div></section>';
    document.body.appendChild(wrap);
  }
  function closePost() {
    S.openSeq++; S.giftReq++; S.openId = null;
    var body = $('iv-post-body');
    if (body) {
      Array.prototype.forEach.call(body.querySelectorAll('video,audio'), function (m) { try { m.pause(); } catch (e) {} });
      body.innerHTML = '';
    }
    var wrap = $('sheet-post');
    if (wrap) { wrap.classList.remove('show'); wrap.setAttribute('aria-hidden', 'true'); }
    if (!document.querySelector('.ivsheet-wrap.show')) document.body.classList.remove('sheet-open');
  }
  function showSheet(heading) {
    ensureSheet(); closePost();
    $('iv-post-heading').textContent = heading || 'From Ivory';
    if (window.openSheet) window.openSheet('post');
    else { $('sheet-post').classList.add('show'); $('sheet-post').setAttribute('aria-hidden', 'false'); }
  }
  function detailMarkup(p, admin) {
    var html = '<article class="iv-post-detail' + (admin ? ' admin' : '') + '">' +
      '<div class="iv-detail-kicker">' + esc(LABEL[p.type] || 'POST') + (admin ? ' · TRUE DESK VIEW' : '') + '</div>' +
      '<h1>' + esc(cleanTitle(p.title)) + '</h1>' +
      (p.summary && p.type !== 'poll' ? '<p class="iv-detail-summary">' + esc(p.summary) + '</p>' : '');
    if (p.type === 'poll') return html + pollMarkup(p, true, !!admin) + '</article>';
    html += '<div class="iv-detail-media" id="iv-detail-media"><p>Opening the media…</p></div>';
    if (p.body) html += '<div class="iv-detail-body">' + esc(p.body) + '</div>';
    html += '<p class="iv-detail-meta">' + esc(relativeTime(p)) + ' · ' + esc(group(admin ? num(p.view_count) : (viewBloom(p) || num(p.view_count)))) + (admin ? ' true views' : ' views') + '</p>';
    if (!admin) html += '<section class="iv-post-gifts" data-iv-post-gifts="' + Number(p.id) + '" aria-label="Gifters on this post" aria-live="polite"><p class="iv-gift-loading">Reading the confirmed gifters…</p></section>';
    return html + '</article>';
  }
  function lockedMarkup(p) {
    var access = num(p.price_inr) > 0 ? money(p.price_inr) + ' to open, or free from ' + (p.tier_name || 'the higher tiers') :
      (p.tier_name ? 'Available to ' + p.tier_name + ' members' : 'Available to members');
    return '<div class="iv-locked-detail"><span aria-hidden="true">✦</span><h1>' + esc(cleanTitle(p.title)) + '</h1>' +
      '<p>' + esc(access) + '</p>' + (p.summary ? '<blockquote>' + esc(p.summary) + '</blockquote>' : '') +
      '<p class="iv-lock-note">The media link for a locked post never reaches this screen. Access is checked by the house, not by this browser.</p>' +
      (num(p.price_inr) > 0 ? '<button type="button" class="iv-primary" data-iv-buy="' + Number(p.id) + '">OPEN THIS ONE · ' + esc(money(p.price_inr)) + '</button>' : '') +
      '<button type="button" class="iv-secondary" data-iv-plans>SEE THE PLANS</button></div>';
  }
  function buy(p) {
    closePost();
    if (!window.IVPAY) { toast('The pay door did not load. Try once more.', true); return; }
    IVPAY.open({ purpose: 'post_unlock', postId: Number(p.id), amount: num(p.price_inr), label: cleanTitle(p.title),
      eyebrow: 'One post, yours for good', heading: 'Open this one, <em>once.</em>',
      sub: cleanTitle(p.title), amountNote: 'one payment · this post only',
      note: 'Paid once. This post stays open for you after the house confirms it.',
      doneTitle: 'It is with the house.', doneLine: 'The moment it is confirmed, this post opens for you and stays open.',
      onPaid: function () { refresh(true); } });
  }

  function signSupabase(ref) {
    var buckets = ['vault', 'media'], index = 0;
    function attempt() {
      if (index >= buckets.length) return IV.sb + '/storage/v1/object/public/media/' + encodePath(ref);
      var bucket = buckets[index++];
      return send('/storage/v1/object/sign/' + bucket + '/' + encodePath(ref), { expiresIn: 3600 })
        .then(function (d) {
          var signed = d && (d.signedURL || d.signedUrl || d.url);
          if (!signed) throw new Error('No signed link');
          if (safeUrl(signed)) return signed;
          if (signed.indexOf('/storage/v1/') === 0) return new URL(signed, IV.sb).href;
          if (signed.charAt(0) === '/') return IV.sb + '/storage/v1' + signed;
          return IV.sb + '/storage/v1/' + signed;
        }).catch(function () { return attempt(); });
    }
    return attempt();
  }
  function resolveMedia(p, field, fresh) {
    field = field || 'media';
    var source = field === 'thumb' ? p.thumb_source : p.media_source;
    var ref = field === 'thumb' ? p.thumb_ref : (p.media_ref || p.media_url);
    ref = String(ref || '').trim();
    if (source === 'youtube') {
      var y = String(ref || '').match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      var id = y ? y[1] : ref;
      return Promise.resolve({ kind: 'embed', url: /^[A-Za-z0-9_-]{11}$/.test(id) ? 'https://www.youtube-nocookie.com/embed/' + id : null });
    }
    if (source === 'vimeo') {
      var v = String(ref).match(/vimeo\.com\/(?:video\/)?(\d+)/), vid = v ? v[1] : ref;
      return Promise.resolve({ kind: 'embed', url: /^\d+$/.test(vid) ? 'https://player.vimeo.com/video/' + vid : null });
    }
    if (source === 'dailymotion') {
      var dm = String(ref).match(/dailymotion\.com\/video\/([A-Za-z0-9]+)/), did = dm ? dm[1] : ref;
      return Promise.resolve({ kind: 'embed', url: /^[A-Za-z0-9]+$/.test(did) ? 'https://www.dailymotion.com/embed/video/' + did : null });
    }
    if (source === 'telegram_channel') {
      var parts = ref.split(':'), link = safeUrl(ref) || (parts.length === 2 ? 'https://t.me/c/' + parts.map(encodeURIComponent).join('/') : null);
      return Promise.resolve({ kind: 'external', url: link });
    }
    if (!ref) return Promise.resolve({ kind: 'none', url: null });
    if (safeUrl(ref)) return Promise.resolve({ kind: 'url', url: ref });
    if (source === 'supabase') return signSupabase(ref).then(function (url) { return { kind: 'url', url: url }; });
    if ((source === 'b2' || source === 'r2') && window.IVSTORE) {
      return IVSTORE.open({ rail: source, key: ref, postId: Number(p.id), field: field, fresh: !!fresh })
        .then(function (url) { return { kind: 'url', url: safeUrl(url) }; })
        .catch(function () { return { kind: 'none', url: null }; });
    }
    return Promise.resolve({ kind: 'none', url: null });
  }
  function mediaMarkup(p, media) {
    if (!media || !media.url) return '<div class="iv-media-missing"><b>The media did not open just now.</b><p>The words are still here. Try the media again without losing your place.</p><button type="button" data-iv-retry-media>Try the media again</button></div>';
    var url = esc(media.url), title = esc(cleanTitle(p.title));
    if (media.kind === 'embed') return '<div class="iv-embed"><iframe src="' + url + '" title="' + title + '" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
    if (media.kind === 'external') return '<a class="iv-primary iv-external" href="' + url + '" target="_blank" rel="noopener noreferrer">OPEN THE POST</a>';
    if (p.type === 'video') return '<video class="iv-full-media" src="' + url + '" controls playsinline preload="metadata">Your browser cannot play this film.</video>';
    if (p.type === 'audio') return '<audio class="iv-audio" src="' + url + '" controls preload="metadata">Your browser cannot play this voice note.</audio>';
    if (p.type === 'image' || p.type === 'blog' || p.type === 'poll') return '<img class="iv-full-media" src="' + url + '" alt="' + title + '" decoding="async">';
    return '<a class="iv-primary iv-external" href="' + url + '" target="_blank" rel="noopener noreferrer">OPEN THE MEDIA</a>';
  }
  function fillMedia(p, seq, fresh) {
    var box = $('iv-detail-media');
    if (!box || p.media_source === 'none' || (!p.media_ref && !p.media_url)) {
      if (box) box.remove();
      return Promise.resolve();
    }
    return resolveMedia(p, 'media', !!fresh).then(function (media) {
      if (seq !== S.openSeq || Number(S.openId) !== Number(p.id)) return;
      box = $('iv-detail-media');
      if (box) {
        box.innerHTML = mediaMarkup(p, media);
        var element = box.querySelector('img,video,audio');
        if (element) element.addEventListener('error', function () {
          if (seq === S.openSeq && Number(S.openId) === Number(p.id)) box.innerHTML = mediaMarkup(p, null);
        }, { once: true });
      }
    }).catch(function () {
      if (seq === S.openSeq && box) box.innerHTML = mediaMarkup(p, null);
    });
  }
  function fillGifts(p, seq) {
    var box = document.querySelector('#iv-post-body [data-iv-post-gifts="' + Number(p.id) + '"]');
    if (!box) return Promise.resolve(null);
    var req = ++S.giftReq, id = Number(p.id);
    box.setAttribute('aria-busy', 'true');
    if (!window.IVGIFTS || !IVGIFTS.wall || !IVGIFTS.wallHTML) {
      box.innerHTML = '<p class="iv-gift-loading">The names on this post could not be loaded just now.</p>';
      box.setAttribute('aria-busy', 'false'); return Promise.resolve(null);
    }
    return IVGIFTS.wall('post', id).then(function (rows) {
      if (req !== S.giftReq || seq !== S.openSeq || Number(S.openId) !== id) return null;
      box = document.querySelector('#iv-post-body [data-iv-post-gifts="' + id + '"]');
      if (!box) return null;
      box.innerHTML = '<div class="iv-gift-wall">' + IVGIFTS.wallHTML(rows, 'post') + '</div>' +
        (rows === null ? '<button type="button" class="iv-gift-retry" data-iv-gift-retry="' + id + '">Try the names again</button>' : '') +
        '<button type="button" class="iv-gift-send" data-iv-gift="' + id + '">send a gift</button>';
      box.setAttribute('aria-busy', 'false');
      return rows;
    }).catch(function () {
      if (req === S.giftReq && seq === S.openSeq && box) {
        box.innerHTML = '<p class="iv-gift-loading">The names on this post could not be loaded just now.</p><button type="button" class="iv-gift-retry" data-iv-gift-retry="' + id + '">Try the names again</button>';
        box.setAttribute('aria-busy', 'false');
      }
      return null;
    });
  }
  function refreshOpenGifts() {
    var p = S.fullPosts[S.openId], wrap = $('sheet-post');
    if (!p || p.type === 'poll' || !wrap || !wrap.classList.contains('show')) return Promise.resolve(null);
    return fillGifts(p, S.openSeq);
  }

  function openAdmin(id) {
    var p = S.adminPosts[id];
    if (!p) return;
    showSheet('The desk · true preview');
    S.openId = Number(id); var seq = ++S.openSeq;
    $('iv-post-body').innerHTML = detailMarkup(p, true);
    fillMedia(p, seq);
  }
  function openPost(id) {
    var p = postById(id);
    if (!p) return;
    if (locked(p)) {
      if (num(p.price_inr) > 0) { buy(p); return; }
      showSheet('A members-only post'); S.openId = Number(id); S.openSeq++;
      $('iv-post-body').innerHTML = lockedMarkup(p); return;
    }
    if (p.type === 'poll') {
      showSheet('The poll'); S.openId = Number(id); var pollSeq = ++S.openSeq;
      $('iv-post-body').innerHTML = detailMarkup(p, false);
      if (house()) call('/rest/v1/rpc/poll_voters', { post_id_in: Number(id) }).then(function (rows) {
        if (pollSeq !== S.openSeq) return;
        var voters = {};
        (rows || []).forEach(function (r) {
          if (!voters[r.option_id]) voters[r.option_id] = [];
          voters[r.option_id].push(r.member_name || 'A member');
        });
        S.voters[id] = voters; renderOpenPoll();
      }).catch(function () {});
      return;
    }
    showSheet(LABEL[p.type] === 'STORY' ? 'The story' : 'From Ivory');
    S.openId = Number(id); var seq = ++S.openSeq;
    $('iv-post-body').innerHTML = '<div class="iv-feed-loading">Opening this post…</div>';
    call('/rest/v1/rpc/open_post', { post_id_in: Number(id) }).then(function (result) {
      if (seq !== S.openSeq) return;
      var full = Array.isArray(result) ? result[0] : result;
      if (!full) throw new Error('This post is not available to your membership yet.');
      S.fullPosts[full.id] = full;
      $('iv-post-body').innerHTML = detailMarkup(full, false);
      fillGifts(full, seq);
      fillMedia(full, seq).then(function () {
        /* The APK awaits its signing attempts, then counts only if still open. */
        if (seq !== S.openSeq) return;
        call('/rest/v1/rpc/increment_view', { post_id_in: Number(id) }).then(function () {
          if (Date.now() - S.last > 4000) refresh(true);
        }).catch(function () {});
      });
    }).catch(function (e) {
      if (seq !== S.openSeq) return;
      $('iv-post-body').innerHTML = '<div class="iv-feed-empty"><b>This post did not open.</b><p>' + esc((e && e.message) || 'Try once more.') + '</p><button type="button" data-iv-post-open="' + Number(id) + '">Try again</button></div>';
    });
  }

  /* The desk uses the same rows and real media, but never the member view bloom
     and never increments a view just because Ivory previews her own post. */
  function hydrateAdmin(pane, posts) {
    if (!pane) return;
    S.adminPosts = {};
    (posts || []).forEach(function (p) { S.adminPosts[p.id] = p; });
    var pollIds = (posts || []).filter(function (p) { return p.type === 'poll'; }).map(function (p) { return Number(p.id); });
    var pollJob = pollIds.length ? get('/rest/v1/poll_results?select=*&post_id=in.(' + pollIds.join(',') + ')&order=sort_order.asc').catch(function () { return []; }) : Promise.resolve([]);
    pollJob.then(function (rows) {
      var byPost = {};
      (rows || []).forEach(function (o) { if (!byPost[o.post_id]) byPost[o.post_id] = []; byPost[o.post_id].push(o); });
      Object.keys(byPost).forEach(function (id) { S.polls[id] = byPost[id]; });
      Array.prototype.forEach.call(pane.querySelectorAll('[data-iv-admin-content]'), function (box) {
        var id = Number(box.getAttribute('data-iv-admin-content')), p = S.adminPosts[id];
        if (!p) return;
        var html = '<div class="iv-admin-contract"><span>' + esc(LABEL[p.type] || 'POST') + '</span><span>' + esc(p.media_source || 'none') + '</span><span>post ' + id + '</span></div>';
        if (p.body) html += '<p class="iv-admin-body">' + esc(String(p.body).slice(0, 180)) + (String(p.body).length > 180 ? '…' : '') + '</p>';
        if (p.type === 'poll') {
          html += '<div class="iv-admin-poll">' + (byPost[id] || []).map(function (o) {
            return '<div><span>' + esc(o.label) + '</span><b>' + group(o.votes) + ' votes</b></div>';
          }).join('') + '</div>';
        }
        html += '<button type="button" class="iv-admin-preview" data-iv-admin-open="' + id + '">PREVIEW THE ACTUAL POST</button>';
        box.innerHTML = html;
      });
    });
  }

  function prepare() {
    var home = document.querySelector('#home-screen .hp-recent .pcards');
    if (home && !home.getAttribute('data-iv-shared')) { home.setAttribute('data-iv-shared', '1'); home.innerHTML = '<div class="iv-feed-loading">Opening the shared shelf…</div>'; }
    var lib = $('lib-feed');
    if (lib && !lib.getAttribute('data-iv-shared')) { lib.setAttribute('data-iv-shared', '1'); lib.innerHTML = '<div class="iv-feed-loading">Opening the shared shelf…</div>'; }
    ensureSheet();
  }
  function visibleContent() {
    var screen = document.body.dataset.screen || '';
    return screen === 'home' || screen === 'explore' || !!document.querySelector('#home-screen:not(.hidden),#explore-screen:not(.hidden),#sheet-post.show');
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target : null;
    if (!t) return;
    var voteButton = t.closest('[data-iv-vote]');
    if (voteButton) {
      e.preventDefault(); e.stopPropagation();
      var parts = voteButton.getAttribute('data-iv-vote').split(':'); vote(parts[0], parts[1]); return;
    }
    var adminOpen = t.closest('[data-iv-admin-open]');
    if (adminOpen) { e.preventDefault(); e.stopPropagation(); openAdmin(adminOpen.getAttribute('data-iv-admin-open')); return; }
    var gift = t.closest('[data-iv-gift]');
    if (gift) {
      e.preventDefault(); e.stopPropagation();
      if (window.IVGIFTS && IVGIFTS.open) IVGIFTS.open('post', { refId: Number(gift.getAttribute('data-iv-gift')), onEnd: refreshOpenGifts });
      return;
    }
    var giftRetry = t.closest('[data-iv-gift-retry]');
    if (giftRetry) { e.preventDefault(); e.stopPropagation(); refreshOpenGifts(); return; }
    var buyButton = t.closest('[data-iv-buy]');
    if (buyButton) { e.preventDefault(); e.stopPropagation(); buy(postById(buyButton.getAttribute('data-iv-buy'))); return; }
    if (t.closest('[data-iv-plans]')) {
      e.preventDefault(); e.stopPropagation(); closePost(); if (window.ivoryShow) window.ivoryShow('premium'); return;
    }
    if (t.closest('[data-iv-content-retry]')) { e.preventDefault(); e.stopPropagation(); refresh(true); return; }
    if (t.closest('[data-iv-retry-media]')) {
      e.preventDefault(); e.stopPropagation(); var rp = S.fullPosts[S.openId] || S.adminPosts[S.openId] || postById(S.openId); if (rp) { var box = $('iv-detail-media'); if (box) box.innerHTML = '<p>Opening the media…</p>'; fillMedia(rp, S.openSeq, true); } return;
    }
    var chip = t.closest('#explore-screen .chip[data-f]');
    if (chip) { S.filter = chip.getAttribute('data-f') || 'all'; setTimeout(renderLibrary, 0); return; }
    var open = t.closest('[data-iv-post-open]');
    if (open) { e.preventDefault(); e.stopPropagation(); openPost(open.getAttribute('data-iv-post-open')); return; }
    if (t.closest('#sheet-post [data-close]')) closePost();
  }, true);
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.matches && e.target.matches('.iv-post-card[data-iv-post-open]')) {
      e.preventDefault(); openPost(e.target.getAttribute('data-iv-post-open'));
    }
    if (e.key === 'Escape' && $('sheet-post') && $('sheet-post').classList.contains('show')) closePost();
  }, true);
  window.addEventListener('iv-content-changed', function () { refresh(true); });
  window.addEventListener('iv-gift-sent', function (e) {
    var d = e && e.detail || {};
    if (d.surface === 'post' && Number(d.refId) === Number(S.openId)) refreshOpenGifts();
  });
  window.addEventListener('focus', function () { if (Date.now() - S.last > 45000) refresh(true); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && Date.now() - S.last > 45000) refresh(true); });
  if (IV && IV.on) IV.on(function () { S.previewUrls = {}; S.previewRetry = {}; refresh(true); });
  setInterval(function () {
    if (document.hidden) return;
    var deskStories = $('st');
    if (deskStories) deskStories.dispatchEvent(new CustomEvent('iv-content-refresh'));
    window.dispatchEvent(new CustomEvent('iv-content-refresh'));
    if (!visibleContent()) return;
    refresh(true);
  }, 60000);

  prepare(); refresh();
  var priorShow = window.ivoryShow;
  if (typeof priorShow === 'function' && !priorShow.__ivContent) {
    var wrapped = function (name) {
      var result = priorShow.apply(this, arguments);
      if (name === 'home' || name === 'explore') refresh(true);
      else if ($('sheet-post') && $('sheet-post').classList.contains('show')) closePost();
      return result;
    };
    wrapped.__ivContent = true; window.ivoryShow = wrapped;
  }

  return {
    refresh: refresh, open: openPost, openAdmin: openAdmin, close: closePost,
    hydrateAdmin: hydrateAdmin, state: S, viewBloom: viewBloom, noise: noise,
    pollMaths: pollMaths, resolveMedia: resolveMedia, prepare: prepare
  };
})();
