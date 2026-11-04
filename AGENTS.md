# Dream Recorder · Project spec for AI coding tools

Read this first. It is the brief for any AI coding assistant (Claude Code, Cursor, Copilot, etc.) working on this repo. Same text is in `CLAUDE.md` / `AGENTS.md` / `.cursorrules` so every tool picks it up.

## 1. What this is

A mobile-first web app. The user types or speaks a dream; the words of that dream are arranged along stroke paths to form a picture of dream objects/scenes (sea, moon, door, stairs, flight...). Touch/drag pushes words away; a spring pulls them back. Emotion changes colour and motion. Dreams can be saved to a local archive.

Visual reference: a typography video where lines of a poem form a sunflower; touching scatters the words and they spring back. Our twist: the words come from the user's own dream and form dream-related scenes.

Course context: group project for "Designing Multimedia Entertainment". Marking: creative idea 25%, code 50%, execution (steady increments, documented weekly progress) 25%. Full brief: `docs/assignment-requirements.txt`.

## 2. Hard constraints

- Plain static site: `index.html` + `css/style.css` + `js/*.js` (Canvas 2D). No build step, no npm dependencies, no backend, no API keys. Scripts are classic `<script>` files that share one global scope, so load order in `index.html` matters. Keep it runnable by opening `index.html` (or `python3 -m http.server`).
- Must work on phone screens (test at 390x844) and desktop.
- No third-party images, audio files or datasets (credits must stay clean). Sound is synthesised with WebAudio.
- Never commit secrets or private data.
- Do not use warm yellow as a UI colour in the app chrome (user preference); content colours are emotion-driven.
- Keep README.md "Credits" and PROGRESS.md up to date when you change things.

## 3. Architecture (js/ files, in load order)

| File | Purpose |
| --- | --- |
| `js/core.js` | DOM helpers, canvas context, seeded RNG (`hash`, `rng`). |
| `js/emotion.js` | `EMO` table (calm, joy, fear, sad, strange, nostalgia: hue, sway, tremble, rainbow, mix) and `detectEmotion`. |
| `js/geometry.js` | Stroke helpers (`S`, `arcP`, `ellP`, `bez`, `spiralP`, `offs`), `hatch()` scanline polygon fill (even-odd, holes), `hatchDiscs`. |
| `js/scenes/sky.js` | `SC` + `def(name, zh, cat, kw, build)`; sun, moon, stars, cloud, rain. `cat` is sky / hero / ground; `kw` is the keyword regex source. |
| `js/scenes/world.js` | sea, fish, flight, house, door, stairs, tree, forest, mountain. |
| `js/scenes/things.js` | fire, eye, cat, butterfly, flower, snake, falling, road, city, paper, person, swirl fallback, `detectScenes`. |
| `js/compose.js` | `compose()`: up to 3 matched scenes into sky / hero / ground rows, tries candidate layouts, keeps the largest scale. |
| `js/words.js` | `tokenize()` (Intl.Segmenter, merges CJK) and `layoutWords()` (words along strokes by arc length; deterministic per text). |
| `js/particles.js` | Particle state, emotion tint, `spawn`, `retire`. |
| `js/canvas.js` | Font loading and `resize()`. |
| `js/sound.js` | `Snd` WebAudio soundscape, off by default. |
| `js/archive.js` | localStorage archive (`dream-recorder-v1`, 24 entries, JPEG thumbnails). |
| `js/dream.js` | `commit(text, src, forceEmo, instant)`: detect keywords and emotion, compose, layout, animate. |
| `js/pointer.js` | Pointer tracking for touch repulsion. |
| `js/loop.js` | `frame()`: spring towards target, pointer repulsion plus swirl, angular spring, emotion sway / tremble / hue. |
| `js/ui.js` | Samples, emotion chips, input form, microphone (SpeechRecognition), archive buttons, toast. |
| `js/main.js` | Boot: resize handler, first dream, test hook `window.__dream = { commit, ptr, n }`, start the loop. |

Keyword matching: CJK uses substring; ASCII uses `\bword(?:s|es|ing|ed)?\b`. Font size is `clamp(U*0.042, 7, 12)` px.

## 4. How to add a scene

1. Call `def('name', '中文名', 'sky|hero|ground', 'kw1|kw2|中文词', build)`.
2. `build` returns strokes in a normalised box; reuse helpers (`hatch`, spirals, beziers).
3. Check the keywords do not collide with other scenes (e.g. "楼梯" must not trigger city).
4. Test with `__dream.commit('your dream text')` and screenshot at 390x844.

## 5. Requirements checklist (what "done" means)

Functional
- [x] Input by text, optional voice
- [x] Keywords choose scenes, words form the picture
- [x] Touch repulsion with spring return
- [x] Emotion selection and auto detection
- [x] Optional sound
- [x] Local archive
- [ ] Playtest with at least one other person and record feedback in PROGRESS.md
- [ ] Deployed demo (GitHub Pages) linked from README
- [ ] More robust keyword understanding (synonyms; optional LLM later, behind a user-supplied key, never committed)

Ideas for upcoming weeks (adjust with tutor)
- 12 Nov, integrated core experience: polish scene composition, more scenes, better onboarding.
- 19 Nov, playtest: collect feedback, fix top 3 issues.
- 26 Nov, delivery candidate: deploy, README final, performance on low-end phones.
- 3 Dec, final review.

## 6. Working style for the AI

- Make small, focused changes; one feature per commit with a clear message.
- After each change, run the page in a browser (e.g. Playwright at 390x844), check the console for errors and look at a screenshot.
- Do not rewrite the whole file for a small change.
- Explain what you changed and why in plain language so teammates can follow.
