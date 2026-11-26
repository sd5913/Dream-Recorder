'use strict';

Object.assign(STR.zh, {
  communityDetail: '社区梦境', communityBack: '返回社区', communityShare: '复制链接',
  communityShareLink: '可分享的梦境链接', communityCopied: '链接已复制。',
  communityCopyManually: '选中链接后可手动复制。', communityDreamLoading: '正在加载梦境…',
  communityDreamMissing: '这篇梦境已撤回或不存在。', communityDreamUnavailable: '暂时无法读取这篇梦境。',
  communityPictureHint: '滑动或拖动画面，也可以按空格拨动文字。'
});
Object.assign(STR.en, {
  communityDetail: 'Community dream', communityBack: 'Back to community', communityShare: 'Copy link',
  communityShareLink: 'Shareable dream link', communityCopied: 'Link copied.',
  communityCopyManually: 'Copy the selected link to share it.', communityDreamLoading: 'Loading dream…',
  communityDreamMissing: 'This dream was withdrawn or does not exist.', communityDreamUnavailable: 'This dream could not be loaded.',
  communityPictureHint: 'Move through the image or press Space to stir the words.'
});

const communityDream = $('#communityDream');
const communityDreamCanvas = $('#communityDreamCanvas');
const communityDreamContext = communityDreamCanvas.getContext('2d');
const communityDreamContent = $('#communityDreamContent');
const communityDreamShare = $('#communityDreamShare');
const communityDreamLink = $('#communityDreamLink');
const communityDreamShareStatus = $('#communityDreamShareStatus');
const communityDreamStatus = $('#communityDreamStatus');
const communityDreamTitle = $('#communityDreamTitle');
const communityDreamPrefix = '#community/';
let communityDreamRequest, communityDreamFrame = 0;
let communityDreamParts = [], communityDreamWidth = 0, communityDreamHeight = 0, communityDreamScale = 1;
let communityDreamLast = 0;

function setCommunityDreamMessage(node, key) {
  if (key) node.dataset.i18n = key;
  else delete node.dataset.i18n;
  node.textContent = key ? tx(key) : '';
}

function sizeCommunityDream() {
  if (communityDreamContent.hidden) return;
  const { width, height } = communityDreamCanvas.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  communityDreamWidth = width;
  communityDreamHeight = height;
  communityDreamScale = Math.min(width, height) * .44;
  communityDreamCanvas.width = Math.round(width * ratio);
  communityDreamCanvas.height = Math.round(height * ratio);
  communityDreamContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  communityDreamContext.textAlign = 'center';
  communityDreamContext.textBaseline = 'middle';
  communityDreamContext.font = `${clamp(communityDreamScale * .045, 6, 11)}px ${FONT}`;
}
new ResizeObserver(sizeCommunityDream).observe(communityDreamCanvas);

function drawCommunityDream(now) {
  const context = communityDreamContext;
  const dt = Math.min(.033, (now - communityDreamLast) / 1000);
  const reduced = reduce;
  communityDreamLast = now;
  context.clearRect(0, 0, communityDreamWidth, communityDreamHeight);
  for (const particle of communityDreamParts) {
    particle.vx = (particle.vx - particle.dx * 32 * dt) * Math.exp(-7 * dt);
    particle.vy = (particle.vy - particle.dy * 32 * dt) * Math.exp(-7 * dt);
    particle.dx += particle.vx * dt;
    particle.dy += particle.vy * dt;

    const x = communityDreamWidth / 2 + particle.ux * communityDreamScale + particle.dx;
    const y = communityDreamHeight / 2 + particle.uy * communityDreamScale + particle.dy;
    const drift = reduced ? 0 : Math.sin(now * .0008 + particle.ph) * 1.2;
    context.save();
    context.translate(x + drift, y + drift * .5);
    context.rotate(particle.ang);
    context.globalAlpha = particle.opacity;
    context.fillStyle = particle.css;
    context.fillText(particle.t, 0, 0);
    context.restore();
  }
  communityDreamFrame = requestAnimationFrame(drawCommunityDream);
}

function stirCommunityDream(x, y) {
  const range = Math.max(26, communityDreamScale * .33);
  for (const particle of communityDreamParts) {
    const dx = communityDreamWidth / 2 + particle.ux * communityDreamScale + particle.dx - x;
    const dy = communityDreamHeight / 2 + particle.uy * communityDreamScale + particle.dy - y;
    const distance = Math.hypot(dx, dy);
    if (distance >= range) continue;
    const strength = (1 - distance / range) * (reduce ? 24 : 78);
    particle.vx = clamp(particle.vx + Math.cos(Math.atan2(dy, dx)) * strength, -170, 170);
    particle.vy = clamp(particle.vy + Math.sin(Math.atan2(dy, dx)) * strength, -170, 170);
  }
}

function stirFromPointer(event) {
  const rect = communityDreamCanvas.getBoundingClientRect();
  stirCommunityDream(event.clientX - rect.left, event.clientY - rect.top);
}
communityDreamCanvas.addEventListener('pointerdown', stirFromPointer);
communityDreamCanvas.addEventListener('pointermove', stirFromPointer);
communityDreamCanvas.addEventListener('keydown', event => {
  if (event.key !== ' ' && event.key !== 'Enter') return;
  event.preventDefault();
  const point = communityDreamParts[Math.floor(communityDreamParts.length / 2)];
  if (point) stirCommunityDream(
    communityDreamWidth / 2 + point.ux * communityDreamScale,
    communityDreamHeight / 2 + point.uy * communityDreamScale
  );
});

function stopCommunityDreamPicture() {
  cancelAnimationFrame(communityDreamFrame);
  communityDreamParts = [];
}

async function openCommunityDream(id) {
  communityDreamRequest?.abort();
  stopCommunityDreamPicture();
  const request = new AbortController();
  communityDreamRequest = request;
  communityDream.setAttribute('aria-label', tx('communityDetail'));
  communityDream.removeAttribute('aria-labelledby');
  communityDreamContent.hidden = communityDreamShare.hidden = communityDreamLink.hidden = true;
  setCommunityDreamMessage(communityDreamShareStatus, '');
  setCommunityDreamMessage(communityDreamStatus, 'communityDreamLoading');
  communityDream.scrollTop = 0;
  if (!communityDream.open) communityDream.showModal();

  try {
    if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(id)) {
      setCommunityDreamMessage(communityDreamStatus, 'communityDreamMissing');
      return;
    }
    const response = await fetch('/api/community/' + encodeURIComponent(id), {
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(8000)])
    });
    if (request.signal.aborted) return;
    if (response.status === 404) {
      setCommunityDreamMessage(communityDreamStatus, 'communityDreamMissing');
      return;
    }
    if (!response.ok) throw new Error('Community dream unavailable');
    const { post } = await response.json();
    if (request.signal.aborted) return;

    communityDreamTitle.textContent = post.title;
    const date = new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: 'medium' }).format(post.createdAt);
    const author = post.displayName || (LANG === 'en' ? 'Anonymous' : '匿名');
    $('#communityDreamMeta').textContent = [author, emoName(post.mood), date].join(' · ');
    $('#communityDreamText').textContent = post.text;
    communityDream.setAttribute('aria-labelledby', 'communityDreamTitle');
    communityDreamContent.hidden = communityDreamShare.hidden = false;
    setCommunityDreamMessage(communityDreamStatus, '');

    await ensureFont(post.text);
    if (request.signal.aborted) return;
    communityDreamParts = exampleWords(post.text, post.mood, 800)
      .map(part => ({ ...part, dx: 0, dy: 0, vx: 0, vy: 0 }));
    sizeCommunityDream();
    communityDreamLast = performance.now();
    communityDreamFrame = requestAnimationFrame(drawCommunityDream);
  } catch {
    if (!request.signal.aborted) setCommunityDreamMessage(communityDreamStatus, 'communityDreamUnavailable');
  }
}

function renderCommunityDreamRoute() {
  if (location.hash.startsWith(communityDreamPrefix)) {
    openCommunityDream(location.hash.slice(communityDreamPrefix.length));
  } else {
    communityDreamRequest?.abort();
    stopCommunityDreamPicture();
    if (communityDream.open) communityDream.close();
  }
}

function backToCommunity() {
  location.hash = 'community';
}
$('#communityDreamBack').onclick = backToCommunity;
communityDream.addEventListener('cancel', event => {
  event.preventDefault();
  backToCommunity();
});
communityDreamShare.onclick = async () => {
  const url = new URL(location.href);
  url.search = '';
  try {
    await navigator.clipboard.writeText(url.href);
    setCommunityDreamMessage(communityDreamShareStatus, 'communityCopied');
  } catch {
    communityDreamLink.value = url.href;
    communityDreamLink.hidden = false;
    communityDreamLink.select();
    setCommunityDreamMessage(communityDreamShareStatus, 'communityCopyManually');
  }
};
addEventListener('hashchange', renderCommunityDreamRoute);
document.addEventListener('DOMContentLoaded', renderCommunityDreamRoute);
