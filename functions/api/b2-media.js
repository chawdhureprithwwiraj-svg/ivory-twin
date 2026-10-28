// CC.244 - the house's own door to the B2 vault.
//
// Same wound as r2-vault: the Supabase edge function answers a CORS
// preflight with a bare 405 and no Access-Control-Allow-Origin, so a
// browser cannot call it. That is why images and covers resolved to
// nothing on the web and every card wore a flat placeholder.
//
// This door, on our own origin, carries the letter from Cloudflare
// where no browser check applies. Nothing secret is stored here -
// the caller's own Authorization and apikey pass straight through.

const ENDPOINT =
  'https://soephrftgddbwkzwjddj.supabase.co/functions/v1/b2-media';

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function onRequestPost(context) {
  try {
    const request = context.request;
    const headers = new Headers();
    const ct = request.headers.get('content-type');
    if (ct) headers.set('content-type', ct);
    for (const name of ['authorization', 'apikey', 'x-client-info']) {
      const v = request.headers.get(name);
      if (v) headers.set(name, v);
    }
    const body = await request.text();
    const res = await fetch(ENDPOINT, { method: 'POST', headers, body });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = { error: text.slice(0, 400) };
    }
    return json({ status: res.status, data });
  } catch (e) {
    return json({ status: 0, data: { error: 'the door jammed: ' + e } });
  }
}

function json(obj) {
  return new Response(JSON.stringify(obj), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}
