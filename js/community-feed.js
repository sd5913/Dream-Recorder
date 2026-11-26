'use strict';

Object.assign(STR.zh, {
  communityEntry: '社区', communityHosted: '打开线上社区',
  communityAnonymous: '匿名', communityLoading: '正在加载社区梦境…',
  communityEmpty: '社区里还没有公开梦境。', communityUnavailable: '暂时无法读取社区。',
  communityMore: '加载更多', communityRetry: '重试'
});
Object.assign(STR.en, {
  communityEntry: 'Community', communityHosted: 'Open the hosted community',
  communityAnonymous: 'Anonymous', communityLoading: 'Loading community dreams…',
  communityEmpty: 'There are no public dreams yet.', communityUnavailable: 'The community is unavailable right now.',
  communityMore: 'Load more', communityRetry: 'Retry'
});

const communityFeed = $('#communityFeed');
const communityFeedList = $('#communityFeedList');
const communityFeedStatus = $('#communityFeedStatus');
const communityFeedMore = $('#communityFeedMore');
const communityFeedHosted = $('#communityFeedHosted');
let communityFeedRequest, communityFeedCursor = null;

function communityFeedMessage(key) {
  if (key) communityFeedStatus.dataset.i18n = key;
  else delete communityFeedStatus.dataset.i18n;
  communityFeedStatus.textContent = key ? tx(key) : '';
}

function communityFeedCard(post) {
  const item = document.createElement('li');
  const anchor = document.createElement('a');
  anchor.className = 'community-feed-card';
  anchor.href = '#community/' + encodeURIComponent(post.id);
  const artwork = document.createElement(post.thumbnail ? 'img' : 'span');
  if (post.thumbnail) {
    artwork.src = post.thumbnail;
    artwork.alt = '';
    artwork.loading = 'lazy';
  } else {
    artwork.className = 'community-feed-art';
    artwork.textContent = '✦';
    artwork.setAttribute('aria-hidden', 'true');
  }
  const title = document.createElement('strong');
  title.textContent = post.title;
  const summary = document.createElement('p');
  summary.textContent = post.excerpt;
  const meta = document.createElement('p');
  meta.className = 'community-feed-meta';
  const date = new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: 'medium' }).format(post.createdAt);
  meta.textContent = [post.displayName || tx('communityAnonymous'), emoName(post.mood), date].join(' · ');
  anchor.append(artwork, title, summary, meta);
  item.append(anchor);
  return item;
}

async function loadCommunityFeed(cursor) {
  communityFeedRequest?.abort();
  const request = new AbortController();
  communityFeedRequest = request;
  communityFeedMore.hidden = true;
  communityFeedHosted.hidden = true;
  communityFeedMessage('communityLoading');
  try {
    const query = cursor ? '?cursor=' + encodeURIComponent(cursor) : '';
    const response = await fetch('/api/community' + query, {
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(8000)])
    });
    if (!response.ok) throw new Error('Community feed unavailable');
    const { posts, nextCursor } = await response.json();
    if (request.signal.aborted) return;
    for (const post of posts) communityFeedList.append(communityFeedCard(post));
    communityFeedCursor = nextCursor;
    communityFeedMessage(communityFeedList.childElementCount ? '' : 'communityEmpty');
    communityFeedMore.textContent = tx('communityMore');
    communityFeedMore.hidden = !nextCursor;
  } catch {
    if (request.signal.aborted) return;
    communityFeedMessage('communityUnavailable');
    communityFeedHosted.hidden = location.hostname !== 'sd5913.github.io';
    communityFeedMore.textContent = tx('communityRetry');
    communityFeedMore.hidden = false;
  }
}

function renderCommunityFeedRoute() {
  if (location.hash !== '#community') {
    communityFeedRequest?.abort();
    if (communityFeed.open) communityFeed.close();
    return;
  }
  if (communityFeed.open) return;
  communityFeedCursor = null;
  communityFeedList.replaceChildren();
  communityFeed.showModal();
  loadCommunityFeed(null);
}

function dismissCommunityFeed() {
  const next = new URL(location.href);
  next.hash = '';
  history.replaceState(history.state, '', next);
  renderCommunityFeedRoute();
}

$('#btnCommunity').onclick = () => { location.hash = 'community'; };
$('#communityFeedClose').onclick = dismissCommunityFeed;
communityFeedMore.onclick = () => loadCommunityFeed(communityFeedCursor);
communityFeed.addEventListener('cancel', event => {
  event.preventDefault();
  dismissCommunityFeed();
});
addEventListener('hashchange', renderCommunityFeedRoute);
document.addEventListener('DOMContentLoaded', renderCommunityFeedRoute);
