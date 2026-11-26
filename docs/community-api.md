# Community API

Use the same origin as the Cloudflare Worker. Public reads require no session. The three account operations use the existing GitHub session cookie. Writes require the browser's same-origin request header. All responses are JSON with caching disabled.

| Method and path | Result |
| --- | --- |
| GET /api/community?cursor=… | Public feed with `posts` and `nextCursor`. |
| GET /api/community/<id> | Public detail as `{ post }`, including full `text`. |
| GET /api/community/mine?cursor=… | The signed-in author's posts, including each private `sourceId`. |
| GET /api/community/mine?source=… | Signed-in author's publication for an archive entry as `{ post }`; `post` is null if absent. |
| POST /api/community | Publish the approved snapshot; returns 201 with `{ post }`. An already-published source returns 409. |
| DELETE /api/community/<id> | Withdraw as author; returns `{ withdrawn: true }`. Unknown or other-author IDs return 404. |

Feed items have `id` (UUID), `title`, `excerpt`, `displayName` (empty means anonymous), `mood`, `thumbnail` (empty or a JPEG data URL), and `createdAt` (Unix milliseconds). Results are newest first, twelve at a time, with an opaque cursor or null. Public responses expose neither account IDs nor private archive IDs.

The POST body accepts `sourceId` (128 characters), `title` (100), `text` (10,000), `displayName` (optional, 40), `mood` (one of the six recorder moods), and `thumbnail` (optional JPEG data URL, 64,000). Limits are JavaScript string lengths. Published snapshots are independent of the private archive, so archive deletion or edits do not silently modify the public post. To change a post, withdraw it and publish again.

The browser routes are `#community` for the feed and `#community/<id>` for details.
