# Dream Recorder

- [Try Dream Recorder with GitHub sign-in or guest access](https://dream-recorder.final-work.workers.dev/) · Cloudflare-hosted app.
- [GitHub Pages demo](https://sd5913.github.io/Dream-Recorder/) · Published from the `main` branch.

Dream Recorder turns a dream into a picture made from its own words. The words follow the outlines of objects and scenes, drift gently, and spring back after touch or drag. Saved dreams can be explored as camera-facing nebulae in a perspective-projected 3D archive.

Course: Designing Multimedia Entertainment · Group project 2026 · Repository: [sd5913/Dream-Recorder](https://github.com/sd5913/Dream-Recorder)

## Audience and interaction

For people who want to keep the feeling of a dream as well as its events. Type a dream in Chinese or English, or use optional browser voice input. Keyword and concept rules choose scenes; the dream's words form the picture. Every recognised dream also draws images from the abstract deck chosen for its mood until the composition has at least three elements; dreams without recognised scenes keep the three-card mood spread. Six moods change the palette and motion. The interface can be switched between Chinese and English.

- All scene drawings and all six moods use a softer colour palette with brighter centres and fading edges.
- Every phrase has independent, small drifting movement and slight rotation while the overall picture remains anchored.
- These are shared rendering rules for both reopened archive entries and future generated dreams.
- Text typed into the input previews live. Press **Draw / 生成** to save; samples and live previews alone do not create archive entries.
- Sound is synthesised with WebAudio and starts off. PNG export saves the current picture locally.

## Run

Use a modern browser. The app is a static HTML/CSS/JavaScript project with Canvas 2D: no build, package installation, backend or API key is required.

1. Open `index.html`, or serve this folder with `python -m http.server 8000` and open [localhost:8000](http://localhost:8000).
2. The normal archive includes the six original example dreams alongside saved entries.
3. Choose **Continue as guest** to use the browser-local archive. Old `index.html?demo` links open the archive after you enter.



## Archive

User submissions are saved after the picture settles, or earlier when another dream or the archive is opened. Records stay in the same browser and origin: new entries use `dream-recorder-v1`. Existing records from the earlier `dream-recorder-demo-v1` key remain visible in the same archive without rewriting either store. Up to 24 new personal entries are retained, alongside existing legacy entries and the original examples.

- **Sky:** drag to orbit, use the wheel to move nearer/farther, select a nebula to fly to it, then select it again or press **Open / 打开**.
- The scene uses 3D positions, particle depth and camera perspective, rendered through Canvas 2D. Each dream silhouette faces the viewer while its position changes with the camera.
- **Keyboard:** focus the sky canvas, use left/right to select and Enter to open. A list view is also available.
- Existing records without shape snapshots are reconstructed using the scene rules.
- Storage failures display an error. A quota retry removes thumbnails before retrying; failed writes/deletions do not replace the current in-memory records.

## Testing

Node.js 18 or newer is recommended **for tests only**. From this source folder run:

```text
node tests/run.js
```

This checks JavaScript syntax and script references, then runs:
- `classify.js`: 96 classification cases.
- `coverage.js`: 104 team-written dreams; measures recall and precision.
- `tarot.js`: the 31 abstract cards and repeatable mood/energy spreads.
- `archive.js`: invalid data, successful saves, quota fallback, blocked saves and deletions.
- `sky.js`: 12 camera-facing rotation cases, near/far perspective, dolly and clipping.
- `appearance.js`: all six moods and six source hues, fading edges, bounded independent drift, named white colour, and both motion-preference modes.

Automated browser checks, the manual review checklist and limitations are documented in [docs/archive-sky-handoff.md](docs/archive-sky-handoff.md). Automated examples do not replace another person's playtest.

## Structure

```text
index.html             page and ordered classic scripts
css/style.css          responsive layout
js/                    shared rendering, words, physics, archive, sky, UI, audio, export
js/scenes/             scene drawing rules
js/demo.js             the six original examples in the normal archive
tests/                 portable Node test scripts and sample dreams
docs/                  assignment brief, mapping docs and handoff checks
PROCESS.md            retained project history and latest integration notes
```

## Team contributions and review

The original README credits WeiYing with the concept and initial prototype; the existing progress notes associate member C with WINN06 / Wei Ying. The account-based record below is verified against PR metadata, changed files and commits on 18 November 2026.

| GitHub account | Merged PRs | Contribution supported by those PRs |
| --- | --- | --- |
| JingyiChen888 (A) | [#1](https://github.com/sd5913/Dream-Recorder/pull/1), [#6](https://github.com/sd5913/Dream-Recorder/pull/6), [#7](https://github.com/sd5913/Dream-Recorder/pull/7) | composition and render hooks; bilingual UI; staged pictures, word morphing, background, sound and PNG export |
| WINN06 (C) | [#2](https://github.com/sd5913/Dream-Recorder/pull/2), [#8](https://github.com/sd5913/Dream-Recorder/pull/8) | animals, icons and everyday objects; 31 abstract cards and mood/energy spreads |
| Yawnz2Zn (B) | [#4](https://github.com/sd5913/Dream-Recorder/pull/4) | shared lexicon, vocabulary expansion, scene mapping and mapping documentation |
| LiZihui-Lucy (D) | [#5](https://github.com/sd5913/Dream-Recorder/pull/5) | dust words, abstract/concept/combo symbols, evidence captions, miss log and recognition tests |

This follow-up package adds archive reliability, the missing star-sky implementation, global soft gradients and phrase drift. It preserves earlier scene/lexicon/card work and does not attribute the seven merged PRs to the person submitting this follow-up.

Review and planning records: [pull requests](https://github.com/sd5913/Dream-Recorder/pulls), [issues](https://github.com/sd5913/Dream-Recorder/issues), and [PROCESS.md](PROCESS.md). No unverified Project-board link is claimed.

## Platforms and limitations

- Designed for phones and desktops. Voice input depends on browser SpeechRecognition support and microphone access.
- Recognition is rule-based, not an AI interpretation of a dream. The 31 abstract-card meanings are team design conventions, not psychological diagnoses.
- Storage is browser-local, capped at 24 entries, and not synced across devices. Private mode, clearing site data or storage restrictions can affect retention.
- Old archive thumbnails are cached images; reopening an entry rebuilds its picture with the current shared colour and motion rules.
- Reduced-motion mode uses smaller, slower idle drift while suppressing larger entry effects and trembling.
- Visual restoration was reconstructed from a reference and user feedback. It is not a recovered original implementation or a pixel-identical certification.
- Actual external-person playtest feedback and final publication are still to be recorded.

## Optional account archive

The entry screen offers **Sign in with GitHub** and **Continue as guest**. On
GitHub Pages, sign-in opens the team’s Cloudflare Worker. Guests stay on the
current site and save dreams in that browser. Standalone copies without an
account service can continue as guests. The Cloudflare Worker
uses the Week 11 pattern: GitHub OAuth verifies identity, a signed session
cookie identifies the account, and D1 stores its archive under the immutable
numeric GitHub ID. GitHub itself does not hold the dreams.

The team's Worker is at [dream-recorder.final-work.workers.dev](https://dream-recorder.final-work.workers.dev/).
The Worker and D1 database were created on 23 Nov 2026, and the first D1
migration was applied. The Worker requires the OAuth App and deployment
secrets below for GitHub sign-in.

The Week 11 deployment workflow is in `.github/workflows/deploy.yml`. An
administrator must create a Cloudflare D1 database and GitHub OAuth App.
Set the OAuth App homepage to the HTTPS Worker origin and its callback to
that origin plus `/api/auth/github/callback`. Add these eight repository
Actions secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
`CLOUDFLARE_D1_DATABASE_ID`, `CLOUDFLARE_WORKER_NAME`, `APP_URL`,
`OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, and `SESSION_SECRET` (at least
32 characters). `APP_URL` must be the exact HTTPS Worker origin. Never
commit secret values. The workflow injects the D1 ID and Worker name into
an ignored temporary config, checks code, migrates remote D1, then deploys
the Worker with OAuth and session secrets.
For local development, use a separate OAuth App and ignored `.dev.vars`:
`npm ci`, `npm run build`, `npm run db:local`, `npm run dev:cloud`.
After the secrets are configured, the workflow runs on a push to `main`, or
an administrator can run it manually from GitHub Actions. If secrets are
missing, an automatic run skips deployment; a manual run reports the missing
names and fails. Test the deployed Worker URL using two GitHub accounts:
account A saves and reloads a dream; account B sees only B's records; a
signed-out request to `/api/archive` is rejected. GitHub Pages guest archives are stored separately from archives on the Worker
because the two sites have different origins.

Sign-out ends the Dream Recorder session. The next GitHub sign-in opens
GitHub’s account picker, where you can select an account or sign in.

Signed-out records stay local. After login, cloud data and a local cache
are scoped to that GitHub ID. Existing signed-out entries are imported only
when the user selects **Import local archive**, so a shared browser does not
silently copy another person's dreams into the signed-in account.

## Credits

- Scene paths, typography, particles and sound are generated by project code; no third-party images, recorded audio, datasets or reference-video footage are included.
- Fonts: Google Fonts when available, with system fallbacks.
- The GitHub mark identifies the GitHub sign-in option.
- AI assistance: Claude helped with the original prototype and pitch slides, as credited in the existing project. Codex helped integrate earlier picture/motion and abstract-card work, prepare the archive/sky restoration, and build the optional account archive, entry screen and related checks. Concept, direction, review and submission decisions remain with the team.
- The typography idea was inspired by a reference video of words forming a sunflower; its footage/assets are not shipped.

### 19 Nov archive-sky entry fix

The archive sky requires js/sky.js after js/archive.js and before js/ui.js. tests/sky.js now checks this entry and load order, in addition to the projection math, to catch omissions during later merges. This follow-up restores both the sky script and the js/demo.js entry for the original six examples inside the normal archive, retaining the typical-dream scene module and existing saved records. Codex helped diagnose and verify the regression; repository/deployment results are tracked in the fix PR.

### Unified archive

The original six examples appear inside the ordinary Archive together with saved dreams. There is no separate Example sky/My archive option. Built-in examples are generated in memory; stored copies of the same example are not duplicated, and both existing personal and older demo-key records remain visible. Built-in examples are read-only; saved records retain their normal deletion controls. Opening the app writes no example data or migrations to browser storage. Old `?demo` links open the same archive after entry.
