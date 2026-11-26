const collection = '/api/community';
const pageSize = 12;
const idPattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
const moods = new Set(['calm', 'joy', 'fear', 'sad', 'strange', 'nostalgia']);
const jpegPattern = /^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]*={0,2}$/;
const feedColumns = 'id, title, excerpt, display_name AS displayName, mood, thumbnail, created_at AS createdAt';

async function readPost(request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return null;
  if (!request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0, raw = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 112000) {
      await reader.cancel();
      return null;
    }
    raw += decoder.decode(value, { stream: true });
  }

  let data;
  try { data = JSON.parse(raw + decoder.decode()); } catch { return null; }
  const { sourceId, title, text, displayName = '', mood, thumbnail = '' } = data ?? {};
  const valid = (value, max, required = true) =>
    typeof value === 'string' && value.length <= max && (!required || Boolean(value.trim()));
  if (!valid(sourceId, 128) || !valid(title, 100) || !valid(text, 10000) ||
      !valid(displayName, 40, false) || !moods.has(mood) ||
      !valid(thumbnail, 64000, false) || (thumbnail && !jpegPattern.test(thumbnail))) return null;
  return { sourceId, title: title.trim(), text: text.trim(), displayName: displayName.trim(), mood, thumbnail };
}

async function listPosts(db, url, json, owner) {
  const filters = [], values = [];
  if (owner) {
    filters.push('owner_id = ?');
    values.push(owner.id);
    const source = url.searchParams.get('source');
    if (source !== null) {
      if (!source || source.length > 128) return json({ error: 'Invalid source' }, 400);
      const post = await db.prepare('SELECT ' + feedColumns + ', source_id AS sourceId FROM community_posts WHERE owner_id = ? AND source_id = ?')
        .bind(owner.id, source).first();
      return json({ post });
    }
  }
  const cursor = url.searchParams.get('cursor');
  if (cursor !== null) {
    const [stamp, id, extra] = cursor.split('.');
    if (!/^\d{1,13}$/.test(stamp) || !idPattern.test(id) || extra !== undefined) {
      return json({ error: 'Invalid cursor' }, 400);
    }
    filters.push('(created_at, id) < (?, ?)');
    values.push(Number(stamp), id);
  }
  const where = filters.length ? ' WHERE ' + filters.join(' AND ') : '';
  const columns = owner ? feedColumns + ', source_id AS sourceId' : feedColumns;
  const { results } = await db.prepare('SELECT ' + columns + ' FROM community_posts' + where + ' ORDER BY created_at DESC, id DESC LIMIT ?')
    .bind(...values, pageSize + 1).all();
  const posts = results.slice(0, pageSize);
  const last = posts.at(-1);
  return json({ posts, nextCursor: results.length > pageSize ? last.createdAt + '.' + last.id : null });
}

export async function handleCommunity(request, url, env, { json, session }) {
  const { pathname } = url;
  const { method } = request;
  const id = pathname.slice(collection.length + 1);
  const db = env.DB;

  if (pathname === collection && method === 'GET') return listPosts(db, url, json);
  if (idPattern.test(id) && method === 'GET') {
    const post = await db.prepare('SELECT ' + feedColumns + ', body AS text FROM community_posts WHERE id = ?').bind(id).first();
    return post ? json({ post }) : json({ error: 'Post not found' }, 404);
  }

  const mine = pathname === collection + '/mine' && method === 'GET';
  const publish = pathname === collection && method === 'POST';
  const withdraw = idPattern.test(id) && method === 'DELETE';
  if (!mine && !publish && !withdraw) return json({ error: 'Not found' }, 404);
  const user = await session(request, env);
  if (!user) return json({ error: 'Sign in required' }, 401);
  if (mine) return listPosts(db, url, json, user);
  if (request.headers.get('origin') !== url.origin) return json({ error: 'Invalid origin' }, 403);

  if (withdraw) {
    const { meta } = await db.prepare('DELETE FROM community_posts WHERE id = ? AND owner_id = ?').bind(id, user.id).run();
    return meta.changes ? json({ withdrawn: true }) : json({ error: 'Post not found' }, 404);
  }

  const draft = await readPost(request);
  if (!draft) return json({ error: 'Invalid post' }, 400);
  const postId = crypto.randomUUID(), createdAt = Date.now();
  const { sourceId, title, text, displayName, mood, thumbnail } = draft;
  const excerpt = Array.from(text.replace(/\s+/gu, ' ')).slice(0, 160).join('');
  const { meta } = await db.prepare(
    'INSERT INTO community_posts (id, owner_id, source_id, title, body, excerpt, display_name, mood, thumbnail, created_at) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(owner_id, source_id) DO NOTHING'
  ).bind(postId, user.id, sourceId, title, text, excerpt, displayName, mood, thumbnail, createdAt).run();
  if (!meta.changes) return json({ error: 'Dream already published' }, 409);
  return json({ post: { id: postId, sourceId, title, text, excerpt, displayName, mood, thumbnail, createdAt } }, 201);
}
