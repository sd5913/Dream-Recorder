const encoder = new TextEncoder();
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const cookies = request => Object.fromEntries((request.headers.get('cookie') || '').split(';').map(x => x.trim().split('=').map(decodeURIComponent)).filter(x => x.length === 2));
const secure = url => url.protocol === 'https:' ? '; Secure' : '';
const cookie = (name, value, url, maxAge) => `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure(url)}`;
const b64 = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const random = () => b64(crypto.getRandomValues(new Uint8Array(24)));
async function key(secret) {
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters');
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function sign(value, secret) { return b64(new Uint8Array(await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(value)))); }
async function session(request, env) {
  const raw = cookies(request).dream_session;
  if (!raw) return null;
  const pieces = raw.split('.');
  if (pieces.length !== 3 || !/^\d+$/.test(pieces[0]) || !/^\d+$/.test(pieces[1]) || Number(pieces[1]) < Date.now()) return null;
  const value = pieces.slice(0, 2).join('.');
  const signature = await sign(value, env.SESSION_SECRET);
  if (signature !== pieces[2]) return null;
  return { id: pieces[0] };
}
const redirect = (where, headers = {}) => new Response(null, { status: 302, headers: { location: where, 'cache-control': 'no-store', ...headers } });
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      if (!env.DB) return json({ error: 'Database is not configured' }, 503);
      if (url.pathname === '/api/auth/github' && request.method === 'GET') {
        if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return json({ error: 'GitHub sign-in is not configured' }, 503);
        const state = random();
        const callback = new URL('/api/auth/github/callback', env.APP_URL || url.origin).href;
        const destination = new URL('https://github.com/login/oauth/authorize');
        destination.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
        destination.searchParams.set('redirect_uri', callback);
        destination.searchParams.set('state', state);
        destination.searchParams.set('scope', 'read:user');
        destination.searchParams.set('prompt', 'select_account');
        return redirect(destination.href, { 'set-cookie': cookie('dream_oauth_state', state, url, 600) });
      }
      if (url.pathname === '/api/auth/github/callback' && request.method === 'GET') {
        const state = cookies(request).dream_oauth_state;
        if (!state || state !== url.searchParams.get('state')) return json({ error: 'Invalid OAuth state' }, 400);
        const retryLogin = () => redirect('/?loginFailed=1', { 'set-cookie': cookie('dream_oauth_state', '', url, 0) });
        if (url.searchParams.has('error') || !url.searchParams.get('code')) return retryLogin();
        const callback = new URL('/api/auth/github/callback', env.APP_URL || url.origin).href;
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code: url.searchParams.get('code'), redirect_uri: callback }) });
        const token = await tokenResponse.json();
        if (!tokenResponse.ok || !token.access_token) return retryLogin();
        const profileResponse = await fetch('https://api.github.com/user', { headers: { authorization: `Bearer ${token.access_token}`, accept: 'application/vnd.github+json', 'user-agent': 'Dream-Recorder' } });
        const profile = await profileResponse.json();
        if (!profileResponse.ok || !Number.isSafeInteger(profile.id)) return retryLogin();
        const expires = Date.now() + 30 * 86400000;
        const value = `${profile.id}.${expires}`;
        const headers = new Headers({ location: '/', 'cache-control': 'no-store' });
        headers.append('set-cookie', cookie('dream_session', `${value}.${await sign(value, env.SESSION_SECRET)}`, url, 30 * 86400));
        headers.append('set-cookie', cookie('dream_oauth_state', '', url, 0));
        return new Response(null, { status: 302, headers });
      }
      if (url.pathname === '/api/me' && request.method === 'GET') {
        const user = await session(request, env);
        return json({ user, available: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) });
      }
      if (url.pathname === '/api/auth/logout' && request.method === 'POST') return new Response(null, { status: 204, headers: { 'set-cookie': cookie('dream_session', '', url, 0), 'cache-control': 'no-store' } });
      if (url.pathname === '/api/archive') {
        const user = await session(request, env);
        if (!user) return json({ error: 'Sign in required' }, 401);
        if (request.method === 'GET') {
          const row = await env.DB.prepare('SELECT body FROM archives WHERE github_id = ?').bind(user.id).first();
          return json({ entries: row ? JSON.parse(row.body) : [] });
        }
        if (request.method === 'PUT') {
          if (request.headers.get('origin') !== url.origin) return json({ error: 'Invalid origin' }, 403);
          const raw = await request.text();
          if (raw.length > 1500000) return json({ error: 'Archive is too large' }, 413);
          let entries;
          try { entries = JSON.parse(raw).entries; } catch { return json({ error: 'Invalid JSON' }, 400); }
          if (!Array.isArray(entries) || entries.length > 24 || entries.some(x => !x || typeof x.id !== 'string' || typeof x.text !== 'string' || !x.text.trim() || x.text.length > 10000 || !Number.isFinite(x.ts))) return json({ error: 'Invalid archive' }, 400);
          await env.DB.prepare('INSERT INTO archives (github_id, body, updated_at) VALUES (?, ?, ?) ON CONFLICT(github_id) DO UPDATE SET body = excluded.body, updated_at = excluded.updated_at').bind(user.id, JSON.stringify(entries), Date.now()).run();
          return json({ saved: true });
        }
      }
      return json({ error: 'Not found' }, 404);
    } catch (error) {
      console.error('Dream Recorder API error', error instanceof Error ? error.message : 'unknown');
      return json({ error: 'Service unavailable' }, 503);
    }
  }
};
