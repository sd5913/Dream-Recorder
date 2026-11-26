import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import worker from '../worker/index.mjs';

function environment() {
  const rows = new Map();
  return {
    GITHUB_CLIENT_ID: 'local-client',
    GITHUB_CLIENT_SECRET: 'local-secret',
    SESSION_SECRET: 'a-test-secret-longer-than-thirty-two-characters',
    APP_URL: 'http://127.0.0.1:8787',
    ASSETS: { fetch: () => new Response('page') },
    DB: { prepare(sql) {
      let args;
      return {
        bind(...values) { args = values; return this; },
        async first() { return rows.has(args[0]) ? { body: rows.get(args[0]) } : null; },
        async run() { rows.set(args[0], args[1]); return { success: true }; }
      };
    } }
  };
}
const url = path => 'http://127.0.0.1:8787' + path;
const call = (env, path, options) => worker.fetch(new Request(url(path), options), env);
test('verified accounts read only their own archive and reject unsigned writes', async () => {
  const env = environment(), originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, options) => {
    if (String(input).includes('access_token')) return Response.json({ access_token: JSON.parse(options.body).code === 'second' ? 'second-token' : 'first-token' });
    if (String(input) === 'https://api.github.com/user') {
      return Response.json(options.headers.authorization.includes('first-token')
        ? { id: 101, login: 'dream-reader' }
        : { id: 202, login: 'second-reader' });
    }
    if (String(input) === 'https://api.github.com/user/101') return Response.json({ id: 101, login: 'dream-reader' });
    throw Error('unexpected fetch');
  };
  try {
    const begin = await call(env, '/api/auth/github');
    const authorize = new URL(begin.headers.get('location'));
    assert.equal(authorize.searchParams.get('prompt'), 'select_account');
    const state = authorize.searchParams.get('state');
    const stateCookie = begin.headers.get('set-cookie').split(';')[0];
    const callback = await call(env, '/api/auth/github/callback?state=' + state + '&code=code', { headers: { cookie: stateCookie } });
    assert.equal(callback.status, 302);
    const sessionCookie = callback.headers.getSetCookie().find(x => x.startsWith('dream_session=')).split(';')[0];
    const profile = async cookie => (await (await call(env, '/api/me', { headers: { cookie } })).json()).user;
    assert.deepEqual(await profile(sessionCookie), { id: '101', login: 'dream-reader' });
    const previousSession = '101.' + (Date.now() + 60000);
    const previousSignature = createHmac('sha256', env.SESSION_SECRET).update(previousSession).digest('base64url');
    assert.deepEqual(await profile('dream_session=' + previousSession + '.' + previousSignature), { id: '101', login: 'dream-reader' });
    assert.equal(await profile(sessionCookie.replace('dream-reader', 'second-reader')), null);
    const put = await call(env, '/api/archive', { method: 'PUT', headers: { cookie: sessionCookie, origin: url(''), 'content-type': 'application/json' }, body: JSON.stringify({ entries: [{ id: 'a', text: 'moon', emo: 'calm', ts: 1 }] }) });
    assert.equal(put.status, 200);
    assert.equal((await (await call(env, '/api/archive', { headers: { cookie: sessionCookie } })).json()).entries[0].text, 'moon');
    const secondBegin = await call(env, '/api/auth/github');
    const secondState = new URL(secondBegin.headers.get('location')).searchParams.get('state');
    const secondCallback = await call(env, '/api/auth/github/callback?state=' + secondState + '&code=second', { headers: { cookie: secondBegin.headers.get('set-cookie').split(';')[0] } });
    const secondCookie = secondCallback.headers.getSetCookie().find(x => x.startsWith('dream_session=')).split(';')[0];
    assert.deepEqual((await (await call(env, '/api/archive', { headers: { cookie: secondCookie } })).json()).entries, []);
    assert.equal((await call(env, '/api/archive', { method: 'PUT', headers: { origin: url('') }, body: '{"entries":[]}' })).status, 401);
    assert.equal((await call(env, '/api/archive', { method: 'PUT', headers: { cookie: sessionCookie, origin: 'https://attacker.example' }, body: '{"entries":[]}' })).status, 403);
    assert.equal((await call(env, '/api/archive')).status, 401);
    assert.equal((await call(env, '/api/auth/github/callback?state=wrong&code=code', { headers: { cookie: stateCookie } })).status, 400);
  } finally { globalThis.fetch = originalFetch; }
});

test('cancelled GitHub authorization returns to the entry screen', async () => {
  const env = environment();
  const begin = await call(env, '/api/auth/github');
  const state = new URL(begin.headers.get('location')).searchParams.get('state');
  const stateCookie = begin.headers.get('set-cookie').split(';')[0];
  const callback = await call(env, '/api/auth/github/callback?error=access_denied&state=' + state, { headers: { cookie: stateCookie } });
  assert.equal(callback.status, 302);
  assert.equal(callback.headers.get('location'), '/?loginFailed=1');
  assert.match(callback.headers.get('set-cookie'), /^dream_oauth_state=;.*Max-Age=0/);
});
