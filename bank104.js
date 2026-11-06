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
  function endpoint(name) {
    try {
      if (/^(ivory-twin\.pages\.dev|ivoryhouse\.dpdns\.org)$/i.test(location.hostname)) return '/api/' + name;
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
        state.textContent = 'The file is open.';
        var media;
        if (kind === 'voice') {
          media = document.createElement('audio'); media.controls = true; media.preload = 'metadata'; media.className = 'p104-audio';
        } else {
          media = document.createElement('img'); media.alt = row.title || row.fname || 'Bank image'; media.className = 'p104-image';
        }
        media.src = url;
        media.addEventListener('error', function () {
          state.textContent = 'The file did not open.';
          host.innerHTML = '<p class="p104-error">The address was signed, but the file bytes would not load. Try a fresh address.</p>';
        }, { once: true });
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
    var ext = String(file.name || '').toLowerCase().split('.').pop();
    return file.type || MIME[ext] || 'application/octet-stream';
  }
  function putRaw(url, file, type, progress) {
    return new Promise(function (resolve, reject) {
      var x = new XMLHttpRequest();
      x.open('PUT', url, true);
      if (type) x.setRequestHeader('Content-Type', type);
      x.upload.onprogress = function (e) { if (progress && e.lengthComputable) progress(e.loaded / e.total); };
      x.onload = function () {
        if (x.status >= 200 && x.status < 300) { if (progress) progress(1); resolve(); }
        else reject(new Error('B2 refused the file (HTTP ' + x.status + ').'));
      };
      x.onerror = function () { reject(new Error('B2 could not be reached.')); };
      x.send(file);
    });
  }
  function uploadOne(file, kind, progress) {
    var image = kind === 'image';
    var type = mimeOf(file);
    if (!file || !file.size) return Promise.reject(new Error('That file is empty. Pick it again.'));
    if (image && (!/^image\//.test(type) || file.size > 48 * 1048576)) return Promise.reject(new Error('Choose a JPEG, PNG, WebP or GIF image under 48 MB.'));
    if (!image && !/^audio\//.test(type) && !MIME[String(file.name || '').toLowerCase().split('.').pop()]) return Promise.reject(new Error('Choose an audio file for the Voice Bank.'));
    if (file.size > 5000000000) return Promise.reject(new Error('B2 single-file uploads must be under 5 GB.'));
    var name = safe(file.name);
    return fn('b2-media', { op: 'put', kind: image ? 'image' : 'audio', name: name, size: file.size, content_type: type })
      .then(function (signed) {
        if (!signed.url || !signed.key) throw new Error('B2 did not return an upload link.');
        return putRaw(signed.url, file, type, progress).then(function () { return signed; });
      }).then(function (signed) {
        return H.api('/rest/v1/rpc/wheel_bank_add', {
          kind: image ? 'image' : 'voice',
          title: image ? 'An image from Ivory' : 'A voice from Ivory',
          path: signed.key,
          fname_in: String(file.name || name), bytes_in: file.size, mime_in: type
        }).then(function (r) {
          if (!r || r.ok !== true) throw new Error((r && (r.why || r.error)) || 'The bank refused the row. The uploaded bytes were not called banked.');
          return r;
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
