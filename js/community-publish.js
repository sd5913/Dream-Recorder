'use strict';

const publishDialog = $('#communityPublish');
const publishBody = $('#publishBody');
const publishStatus = $('#publishStatus');
const publishWords = (zh, en) => LANG === 'en' ? en : zh;
const publishLabel = () => publishWords('发布到社区', 'Publish to community');
const myPostsLabel = () => publishWords('我的发布', 'My posts');
const withdrawLabel = () => publishWords('撤回', 'Withdraw');
const publishKnown = new Map();
let publishView = 0;

const myPostsButton = document.createElement('button');
myPostsButton.type = 'button';
myPostsButton.className = 'tbtn';
myPostsButton.hidden = true;
$('#archClose').before(myPostsButton);
myPostsButton.onclick = openMyCommunityPosts;

function updateCommunityPublishControls() {
  myPostsButton.hidden = typeof cloudUser === 'undefined' || !cloudUser;
  myPostsButton.textContent = myPostsLabel();
}

function addCommunityPublishAction(card, dream) {
  if (typeof cloudUser === 'undefined' || !cloudUser || dream._preset || dream._legacy) return;
  const action = document.createElement('button');
  action.type = 'button';
  action.className = 'tbtn community-publish-action';
  action.textContent = publishKnown.has(dream.id) ? publishWords('已发布 · 管理', 'Published · Manage') : publishLabel();
  action.onclick = () => openCommunityPublish(dream, action);
  card.append(action);
}

async function publishRequest(path = '', options = {}) {
  const response = await fetch('/api/community' + path, { signal: AbortSignal.timeout(8000), ...options });
  if (!response.ok) {
    const error = new Error('Community request failed');
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function beginPublishView(title) {
  $('#publishTitle').textContent = title;
  publishStatus.textContent = '';
  publishBody.replaceChildren();
  publishBody.setAttribute('aria-busy', 'true');
  if (!publishDialog.open) publishDialog.showModal();
  return ++publishView;
}

function publishViewActive(view) {
  return publishDialog.open && publishView === view;
}

function publishFailure(error) {
  publishStatus.textContent = error.status === 401
    ? publishWords('登录已过期，请重新登录。', 'Your session has expired. Sign in again.')
    : publishWords('操作未完成，请重试。', 'The request could not be completed. Please try again.');
}

$('#publishClose').onclick = () => publishDialog.close();

function makePublishButton(label, handler, className = 'tbtn') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.onclick = handler;
  return button;
}

function makePostLink(post) {
  const link = document.createElement('a');
  link.href = '#community/' + encodeURIComponent(post.id);
  link.textContent = post.title;
  link.onclick = () => {
    publishDialog.close();
    closeArchive();
  };
  return link;
}

function makeWithdrawButton(post, view, onDone) {
  return makePublishButton(withdrawLabel(), async event => {
    if (!confirm(publishWords('撤回后，社区里的这篇梦境将不再公开。继续？', 'Withdraw this dream from the community?'))) return;
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await publishRequest('/' + encodeURIComponent(post.id), { method: 'DELETE' });
      publishKnown.delete(post.sourceId);
      if (publishViewActive(view)) onDone();
    } catch (error) {
      if (!publishViewActive(view)) return;
      if (error.status === 404) {
        publishKnown.delete(post.sourceId);
        onDone();
        return;
      }
      publishFailure(error);
      button.disabled = false;
    }
  });
}

async function openCommunityPublish(dream, action) {
  const view = beginPublishView(publishLabel());
  try {
    const { post } = await publishRequest('/mine?source=' + encodeURIComponent(dream.id));
    if (!publishViewActive(view)) return;
    if (post) {
      publishKnown.set(dream.id, post.id);
      action.textContent = publishWords('已发布 · 管理', 'Published · Manage');
      showPublishedDream(post, dream, action, view);
    } else {
      publishKnown.delete(dream.id);
      action.textContent = publishLabel();
      showPublishForm(dream, action, view);
    }
  } catch (error) {
    if (publishViewActive(view)) publishFailure(error);
  } finally {
    if (publishViewActive(view)) publishBody.removeAttribute('aria-busy');
  }
}

function showPublishedDream(post, dream, action, view) {
  $('#publishTitle').textContent = publishWords('已发布', 'Published');
  const withdraw = makeWithdrawButton(post, view, () => openCommunityPublish(dream, action));
  publishBody.replaceChildren(makePostLink(post), withdraw);
}

function labelledPublishField(labelText, field) {
  const label = document.createElement('label');
  label.append(labelText, field);
  return label;
}

function showPublishForm(dream, action, view) {
  const form = document.createElement('form');
  const title = document.createElement('input');
  title.name = 'title';
  title.required = true;
  title.maxLength = 100;
  title.value = dream.text.trim().replace(/\s+/gu, ' ').slice(0, 45);
  const body = document.createElement('textarea');
  body.name = 'text';
  body.required = true;
  body.maxLength = 10000;
  body.value = dream.text;
  const name = document.createElement('input');
  name.name = 'displayName';
  name.maxLength = 40;
  name.placeholder = publishWords('匿名', 'Anonymous');

  const notice = document.createElement('p');
  notice.textContent = publishWords(
    '标题、正文、显示名和所选缩略图会对所有人公开。你可以先删掉正文里的私人信息，原档案不会改变。',
    'The title, text, display name and any selected thumbnail will be public. You can remove private details here; your archive stays intact.'
  );
  form.append(notice,
    labelledPublishField(publishWords('公开标题', 'Public title'), title),
    labelledPublishField(publishWords('公开正文', 'Public text'), body),
    labelledPublishField(publishWords('显示名（选填）', 'Display name (optional)'), name));

  const includeThumb = document.createElement('input');
  includeThumb.type = 'checkbox';
  const jpeg = typeof dream.thumb === 'string' && dream.thumb.length <= 64000 && /^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]*={0,2}$/.test(dream.thumb);
  if (jpeg) {
    const thumbnail = document.createElement('img');
    thumbnail.className = 'publish-thumb';
    thumbnail.alt = publishWords('公开缩略图预览', 'Public thumbnail preview');
    thumbnail.src = dream.thumb;
    thumbnail.hidden = true;
    includeThumb.onchange = () => { thumbnail.hidden = !includeThumb.checked; };
    body.addEventListener('input', () => {
      includeThumb.disabled = body.value !== dream.text;
      if (includeThumb.disabled) includeThumb.checked = false;
      includeThumb.onchange();
    });
    const label = labelledPublishField(publishWords('附上原梦境缩略图（选填）', 'Include the original thumbnail (optional)'), includeThumb);
    label.className = 'publish-check';
    label.prepend(includeThumb);
    form.append(label, thumbnail);
  }

  const submit = document.createElement('button');
  submit.className = 'publish-primary';
  submit.textContent = publishWords('确认发布', 'Confirm publication');
  form.append(submit);
  form.onsubmit = async event => {
    event.preventDefault();
    if (!title.value.trim() || !body.value.trim()) {
      publishStatus.textContent = publishWords('请填写标题和正文。', 'Enter a title and text.');
      return;
    }
    submit.disabled = true;
    publishStatus.textContent = '';
    try {
      const { post } = await publishRequest('', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sourceId: dream.id, title: title.value, text: body.value, displayName: name.value,
          mood: EMO[dream.emo] ? dream.emo : 'calm',
          thumbnail: jpeg && includeThumb.checked && body.value === dream.text ? dream.thumb : ''
        })
      });
      publishKnown.set(dream.id, post.id);
      action.textContent = publishWords('已发布 · 管理', 'Published · Manage');
      if (publishViewActive(view)) showPublishedDream(post, dream, action, view);
    } catch (error) {
      if (!publishViewActive(view)) return;
      if (error.status === 409) { openCommunityPublish(dream, action); return; }
      publishFailure(error);
      submit.disabled = false;
    }
  };
  publishBody.append(form);
}

function openMyCommunityPosts() {
  const view = beginPublishView(myPostsLabel());
  const list = document.createElement('ul');
  const more = makePublishButton(publishWords('加载更多', 'Load more'), () => load(cursor));
  let cursor = null;
  more.hidden = true;
  publishBody.append(list, more);

  async function load(next) {
    more.disabled = true;
    publishStatus.textContent = '';
    try {
      const { posts, nextCursor } = await publishRequest('/mine' + (next ? '?cursor=' + encodeURIComponent(next) : ''));
      if (!publishViewActive(view)) return;
      cursor = nextCursor;
      for (const post of posts) {
        publishKnown.set(post.sourceId, post.id);
        const row = document.createElement('li');
        row.append(makePostLink(post), makeWithdrawButton(post, view, () => {
          row.remove();
          renderArchive();
          if (!list.childElementCount && !cursor) publishStatus.textContent = publishWords('你还没有发布梦境。', 'You have no published dreams.');
        }));
        list.append(row);
      }
      more.hidden = !cursor;
      more.textContent = publishWords('加载更多', 'Load more');
      if (!list.childElementCount) publishStatus.textContent = publishWords('你还没有发布梦境。', 'You have no published dreams.');
    } catch (error) {
      if (!publishViewActive(view)) return;
      publishFailure(error);
      more.hidden = false;
      more.textContent = publishWords('重试', 'Retry');
    } finally {
      more.disabled = false;
      if (publishViewActive(view)) publishBody.removeAttribute('aria-busy');
    }
  }
  load(null);
}
