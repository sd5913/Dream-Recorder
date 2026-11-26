import { readFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';

const origin = 'https://dream.example';
const secret = 'community-test-session-secret-independent-of-production';
const path = '/api/community';

function setup() {
  const database = new DatabaseSync(':memory:');
  database.exec(readFileSync(new URL('../migrations/0002_community_posts.sql', import.meta.url), 'utf8'));
  const DB = { prepare(sql) {
    const statement = database.prepare(sql);
    return { bind(...args) {
      return {
        async first() { return statement.get(...args) ?? null; },
        async all() { return { results: statement.all(...args) }; },
        async run() { return { meta: statement.run(...args) }; }
      };
    } };
  } };
  return (route, { method = 'GET', account, body, from = origin } = {}) => {
    const headers = { origin: from };
    if (account) {
      const value = account + '.' + (Date.now() + 60000);
      headers.cookie = 'dream_session=' + value + '.' + createHmac('sha256', secret).update(value).digest('base64url');
    }
    if (body) headers['content-type'] = 'application/json';
    return worker.fetch(new Request(origin + route, { method, headers, body: body && JSON.stringify(body) }), { DB, SESSION_SECRET: secret });
  };
}

const dream = { sourceId: 'archive-1', title: 'Moon at sea', text: 'A moon was floating over the waves.', displayName: 'Night Owl', mood: 'calm' };

test('only the explicit snapshot is public and only its owner can withdraw it', async () => {
  const request = setup();
  const publish = (account, body = dream, from) => request(path, { account, body, from, method: 'POST' });
  assert.equal((await publish(undefined)).status, 401);
  assert.equal((await publish('101', dream, 'https://other.example')).status, 403);
  assert.equal((await publish('101', { ...dream, thumbnail: 'https://other.example/image.png' })).status, 400);
  assert.equal((await publish('101', { ...dream, text: 'x'.repeat(10001) })).status, 400);
  const created = await publish('101', { ...dream, privateField: 'must stay private' });
  assert.equal(created.status, 201);
  const { post } = await created.json();
  assert.equal((await publish('101')).status, 409);
  const { posts } = await (await request(path)).json();
  assert.deepEqual(Object.keys(posts[0]).sort(), ['createdAt', 'displayName', 'excerpt', 'id', 'mood', 'thumbnail', 'title']);
  const detail = await (await request(path + '/' + post.id)).json();
  assert.equal(detail.post.text, dream.text);
  assert.equal(detail.post.sourceId, undefined);
  assert.equal(detail.post.ownerId, undefined);
  assert.equal(detail.post.privateField, undefined);
  assert.equal((await request(path + '/mine')).status, 401);
  assert.equal((await (await request(path + '/mine?source=archive-1', { account: '101' })).json()).post.id, post.id);
  assert.equal((await (await request(path + '/mine?source=archive-1', { account: '202' })).json()).post, null);
  assert.equal((await request(path + '/' + post.id, { method: 'DELETE', account: '202' })).status, 404);
  assert.equal((await request(path + '/' + post.id, { method: 'DELETE', account: '101' })).status, 200);
  assert.equal((await request(path + '/' + post.id)).status, 404);
  assert.deepEqual((await (await request(path)).json()).posts, []);
});

test('cursor pagination returns each post exactly once', async () => {
  const request = setup();
  for (let i = 0; i < 15; i++) {
    assert.equal((await request(path, { method: 'POST', account: '101', body: { ...dream, sourceId: String(i) } })).status, 201);
  }
  const first = await (await request(path)).json();
  const second = await (await request(path + '?cursor=' + encodeURIComponent(first.nextCursor))).json();
  assert.equal(first.posts.length, 12);
  assert.equal(second.nextCursor, null);
  assert.equal(new Set([...first.posts, ...second.posts].map(post => post.id)).size, 15);
  assert.equal((await request(path + '?cursor=bad')).status, 400);
});
