/* Pass 104 · Wheel-owned Image / Voice Bank media.
   This module deliberately does not depend on IVROOMS.vault or IVSTORE. */
(function () {
  'use strict';
  if (window.IVBANK104) return;
  var H = window.IVHOUSE104;
  var cache = {};
  var WEB_DOOR = 'https://ivory-twin.pages.dev/api/';
  var MIME = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', heic: 'image/heic',
    mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', wav: 'audio/wav', ogg: 'audio/ogg', oga: 'audio/ogg',
    opus: 'audio/ogg', flac: 'audio/flac', amr: 'audio/amr'
  };
  var MIME_ALIAS = {
    'image/jpg': 'image/jpeg', 'image/pjpeg': 'image/jpeg', 'image/x-png': 'image/png',
    'audio/mp3': 'audio/mpeg', 'audio/x-mp3': 'audio/mpeg', 'audio/x-m4a': 'audio/mp4',
    'audio/x-wav': 'audio/wav', 'audio/wave': 'audio/wav', 'audio/x-flac': 'audio/flac',
    'audio/x-aac': 'audio/aac'
  };
  var IMAGE_TYPES = { 'image/jpeg': 1, 'image/png': 1, 'image/webp': 1, 'image/gif': 1, 'image/heic': 1 };
  var AUDIO_TYPES = { 'audio/mpeg': 1, 'audio/mp4': 1, 'audio/aac': 1, 'audio/wav': 1,
    'audio/ogg': 1, 'audio/flac': 1, 'audio/amr': 1 };
  function isProjectPagesHost(host) {
    return /^(?:[a-z0-9-]+\.)*ivory-twin\.pages\.dev$/i.test(String(host || ''));
  }
  function endpoint(name) {
    try {
      /* Preview Pages deployments must stay same-origin; their Functions deny POSTs. */
      if (isProjectPagesHost(location.hostname) || /^ivoryhouse\.dpdns\.org$/i.test(location.hostname)) return '/api/' + name;
    } catch (e) {}
    return WEB_DOOR + name;
  }
  function fn(name, body) {
    if (!window.IVSESS) return Promise.reject(new Error('Sign in as the house first.'));
    function request(retried) {
      var headers = IVSESS.headers();
      headers['Content-Type'] = 'application/json';
      return fetch(endpoint(name), { method: 'POST', headers: headers, body: JSON.stringify(body || {}) })
        .then(function (r) {
          return r.text().then(function (text) {
            var j = null;
            try { j = text ? JSON.parse(text) : null; } catch (e) { j = { raw: text }; }
            var wrapped = j && typeof j === 'object' && Object.prototype.hasOwnProperty.call(j, 'status') && Object.prototype.hasOwnProperty.call(j, 'data');
            var status = wrapped ? Number(j.status) || 0 : r.status;
            var data = wrapped ? j.data : j;
            if (!r.ok || status !== 200) {
              var why = data && (data.error || data.message || data.raw);
              var err = new Error(String(why || (status ? 'The storage door answered HTTP ' + status + '.' : 'The storage door did not answer.')));
              err.status = status || r.status;
              if (err.status === 401 && !retried && IVSESS.renew) return IVSESS.renew().then(function () { return request(true); });
              throw err;
            }
            return data || {};
          });
        });
    }
    return request(false);
  }
  function pathOf(row) {
    row = row && (row._bank || row);
    return String(row && (row.path || row.ref || row.key) || '').trim();
  }
  function railOf(row) {
    row = row && (row._bank || row) || {};
    var named = String(row.rail || row.storage || row.source || '').toLowerCase();
    if (named === 'r2' || named === 'r2pub' || named === 'b2') return named;
    var path = pathOf(row);
    if (/^images\//.test(path)) return 'r2pub';
    if (/^vault\//.test(path)) return 'r2';
    return 'b2';
  }
  function open(row, fresh) {
    var path = pathOf(row);
    if (/^https:\/\//i.test(path)) return Promise.resolve(path);
    if (!path) return Promise.reject(new Error('This bank row has no file key. Reopen the bank and try again.'));
    var rail = railOf(row), key = rail + '|' + path;
    if (!fresh && cache[key] && cache[key].t > Date.now() - 240000) return Promise.resolve(cache[key].url);
    var body = rail === 'b2'
      ? { op: 'object_get', key: path, kind: row._kind || row.kind || '', bank_id: row.id == null ? null : row.id }
      : { op: 'get', key: path };
    return fn(rail === 'b2' ? 'b2-media' : 'r2-vault', body).then(function (data) {
      var url = data && data.url;
      if (!url || !/^https:\/\//i.test(url)) throw new Error('The storage door returned no readable address for this file.');
      cache[key] = { url: url, t: Date.now() };
      return url;
    });
  }
  function viewer(row, kind) {
    var path = pathOf(row);
    var d = H.sheet({
      title: row.title || row.fname || (kind === 'voice' ? 'A voice from Ivory' : 'An image from Ivory'),
      lede: 'A short-lived private address. Close it when you are done.', className: 'p104-media-view',
      html: '<p class="p104-state" data-state aria-live="polite">Reading the file…</p><div class="p104-media-body" data-media></div>' +
        '<div class="p104-actions"><button type="button" class="p104-btn quiet" data-retry>TRY AGAIN</button></div>'
    });
    function read() {
      var state = d.body.querySelector('[data-state]'), host = d.body.querySelector('[data-media]');
      state.textContent = 'Asking for a fresh, short-lived address…';
      host.innerHTML = '';
      open(row, true).then(function (url) {
        if (!d.veil.isConnected) return;
        state.textContent = 'The storage address is signed; waiting for the file bytes…';
        var media;
        if (kind === 'voice') {
          media = document.createElement('audio'); media.controls = true; media.preload = 'metadata'; media.className = 'p104-audio';
          media.addEventListener('loadedmetadata', function () { if (d.veil.isConnected) state.textContent = 'Audio is ready. Press play to hear it.'; });
          media.addEventListener('playing', function () { if (d.veil.isConnected) state.textContent = 'Audio is playing.'; });
        } else {
          media = document.createElement('img'); media.alt = row.title || row.fname || 'Bank image'; media.className = 'p104-image';
          media.addEventListener('load', function () { if (d.veil.isConnected) state.textContent = 'The picture bytes loaded.'; }, { once: true });
        }
        media.addEventListener('error', function () {
          if (!d.veil.isConnected) return;
          var code = media.error && media.error.code;
          var detail = kind === 'voice'
            ? 'The signed address returned, but this browser could not load or decode the audio. No playback was confirmed.'
            : 'The signed address returned, but this browser could not load or decode the image.';
          state.textContent = 'The file bytes did not open.';
          host.innerHTML = '<p class="p104-error">' + H.esc(detail + (code ? ' Browser media error ' + code + '.' : '')) + '</p>';
        }, { once: true });
        media.src = url;
        host.appendChild(media);
      }).catch(function (e) {
        if (!d.veil.isConnected) return;
        state.textContent = 'The file did not open.';
        host.innerHTML = '<p class="p104-error">' + H.esc((e && e.message) || 'The storage door refused this file.') + '</p>';
      });
    }
    d.body.querySelector('[data-retry]').addEventListener('click', read);
    read();
    return d;
  }
  function safe(name) {
    var s = String(name || 'file').replace(/[^A-Za-z0-9._-]/g, '_');
    if (s.length > 120) s = s.slice(s.length - 120);
    return s || 'media.bin';
  }
  function mimeOf(file) {
    var ext = String((file && file.name) || '').toLowerCase().split('.').pop();
    var declared = String((file && file.type) || '').trim().toLowerCase().split(';')[0];
    var guessed = MIME[ext] || '';
    if (MIME_ALIAS[declared]) declared = MIME_ALIAS[declared];
    if (!declared || declared === 'application/octet-stream' || declared === 'binary/octet-stream' || declared === 'application/x-octet-stream') {
      return guessed || declared || 'application/octet-stream';
    }
    return declared;
  }
  function putRaw(url, file, type, progress) {
    return new Promise(function (resolve, reject) {
      var x = new XMLHttpRequest();
      x.open('PUT', url, true);
      if (type) x.setRequestHeader('Content-Type', type);
      x.upload.onprogress = function (e) { if (progress && e.lengthComputable) progress(e.loaded / e.total); };
      x.onload = function () {
        if (x.status >= 200 && x.status < 300) { if (progress) progress(1); resolve(x.status); }
        else reject(new Error('B2 refused the file (HTTP ' + (x.status || 'unknown') + ').'));
      };
      x.onerror = function () { reject(new Error('The upload received no readable HTTP response. This can be a connection or B2 CORS issue; no bank row was written.')); };
      x.onabort = function () { reject(new Error('The upload was cancelled before B2 confirmed it; no bank row was written.')); };
      x.send(file);
    });
  }
  function uploadOne(file, kind, progress) {
    if (!file || !(Number(file.size) > 0)) return Promise.reject(new Error('That file is empty. Pick it again.'));
    var image = kind === 'image', size = Number(file.size);
    if (!image && kind !== 'voice' && kind !== 'audio') return Promise.reject(new Error('Choose either an image or a voice file.'));
    var type = mimeOf(file);
    if (image && (!IMAGE_TYPES[type] || size > 48 * 1048576)) return Promise.reject(new Error('Choose a JPEG, PNG, WebP, GIF or HEIC image under 48 MB.'));
    if (!image && !AUDIO_TYPES[type]) return Promise.reject(new Error('Choose an MP3, M4A, AAC, WAV, OGG, FLAC or AMR file for the Voice Bank.'));
    if (size > 5000000000) return Promise.reject(new Error('B2 single-file uploads must be under 5 GB.'));
    var name = safe(file.name);
    return fn('b2-media', { op: 'put', kind: image ? 'image' : 'audio', name: name, size: size, content_type: type })
      .then(function (signed) {
        if (!signed || !signed.key || !signed.url || !/^https:\/\//i.test(signed.url)) throw new Error('B2 did not return a secure HTTPS upload link and object key.');
        return putRaw(signed.url, file, type, progress).then(function () { return signed; });
      }).then(function (signed) {
        return H.api('/rest/v1/rpc/wheel_bank_add', {
          kind: image ? 'image' : 'voice',
          title: image ? 'An image from Ivory' : 'A voice from Ivory',
          path: signed.key,
          fname_in: String(file.name || name), bytes_in: size, mime_in: type
        }).then(function (r) {
          if (!r || r.ok !== true) throw new Error((r && (r.why || r.error)) || 'The bank refused the row.');
          return r;
        }).catch(function (e) {
          throw new Error(((e && e.message) || 'The bank refused the row.') + ' B2 may already hold the uploaded bytes, but no bank row was confirmed; nothing was automatically deleted.');
        });
      });
  }

  function upload(files, kind, onProgress) {
    files = Array.prototype.slice.call(files || []);
    var done = 0, failed = 0, errors = [];
    return files.reduce(function (chain, file, index) {
      return chain.then(function () {
        if (onProgress) onProgress({ current: index + 1, total: files.length, name: file.name, done: done, failed: failed });
        return uploadOne(file, kind, function (fraction) {
          if (onProgress) onProgress({ current: index + 1, total: files.length, name: file.name, fraction: fraction, done: done, failed: failed });
        }).then(function () { done++; }).catch(function (e) { failed++; errors.push((file.name || 'File') + ': ' + ((e && e.message) || 'refused')); });
      });
    }, Promise.resolve()).then(function () { return { done: done, failed: failed, errors: errors }; });
  }
  function set(rows) {
    return H.api('/rest/v1/rpc/wheel_bank_set', { payload: rows }).then(function (r) {
      if (!r || r.ok !== true) throw new Error((r && (r.why || r.error)) || 'The bank refused the change.');
      return r;
    });
  }
  function drop(id, kind) {
    return H.api('/rest/v1/rpc/wheel_bank_drop', { bid: Number(id), kind: kind }).then(function (r) {
      if (!r || r.ok !== true) throw new Error((r && (r.why || r.error)) || 'The bank refused the change.');
      return r;
    });
  }
  window.IVBANK104 = { open: open, viewer: viewer, upload: upload, uploadOne: uploadOne, set: set, drop: drop, railOf: railOf, pathOf: pathOf, _fn: fn };
})();
