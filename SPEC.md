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
| `js/i18n.js` | Interface language (zh / en): `STR` text table, `tx(key)`, `emoName`, `sceneName`, `applyLang`, `setLang`. Only the interface is translated; dreams can be typed in either language. Add new UI text to both languages here. |
| `js/lexicon.js` | **Keyword lexicon** `LEX` (scene -> words), `LEX_WEIGHT`, `EMO_FALLBACK` (default scenes per emotion when nothing matches), `matchScenes`, `pickScenes`. Edit this file to teach the app new words. |
| `js/emotion.js` | `EMO` table (calm, joy, fear, sad, strange, nostalgia: hue, sway, tremble, rainbow, mix) and `detectEmotion`. |
| `js/geometry.js` | Stroke helpers (`S`, `arcP`, `ellP`, `bez`, `spiralP`, `offs`), `hatch()` scanline polygon fill (even-odd, holes), `hatchDiscs`. |
| `js/scenes/sky.js` | `SC` + `def(name, zh, cat, kw, build)`; sun, moon, stars, cloud, rain. `cat` is sky / hero / ground; `kw` is the keyword regex source. |
| `js/scenes/world.js` | sea, fish, flight, house, door, stairs, tree, forest, mountain. |
| `js/scenes/things.js` | fire, eye, cat, butterfly, flower, snake, falling, road, city, paper, person, swirl, and `detectScenes(text, emotion)` (keywords; one symbol if there is room, concept words first, unclassified nouns last; emotion fallback if nothing matches). |
| `js/scenes/animals.js` | Side-view animals: elephant, horse, tiger, lion, deer, rabbit, bear, dog/wolf, generic beast. |
| `js/scenes/objects.js` | 39 everyday-object archetypes (cup, bottle, phone, chair, shirt, car, ...). Words and the head-word rule live in `lexicon.js`. |
| `js/scenes/icons.js` | Objects and symbols: heart, clock, key, boat, bridge, tower, candle, umbrella, feather, crown, skull, hourglass. |
| `js/symbols.js` | Abstract symbols for words not in the lexicon (`symbolBuild`, `ensureSymbol`, `symbolWords` finds likely nouns) and colour words (`TONES`, `detectTone`). |
| `js/compose.js` | `compose()`: up to 3 scenes, tries every order and row split that keeps sky above hero above ground, keeps the layout with the largest scale that fits the free screen area. |
| `js/words.js` | `tokenize()` (Intl.Segmenter, merges CJK), `layoutWords()` (words along strokes by arc length; deterministic per text), `unmatchedTokens()` and `dustWords()` (words that matched no scene drift around the picture as dim dust), `buildList()` (picture + dust). |
| `js/particles.js` | Particle state, emotion tint, `spawn`, `retire`. |
| `js/canvas.js` | Font loading and `resize()`. |
| `js/sound.js` | `Snd` WebAudio soundscape, off by default. |
| `js/misses.js` | Local log of dreams the app did not understand (`missList`, `logMiss`), for improving the lexicon after playtests. |
| `js/archive.js` | localStorage archive (`dream-recorder-v1`, 24 entries, JPEG thumbnails). |
| `js/dream.js` | `commit(text, src, forceEmo, instant)`: detect keywords and emotion, compose, layout, animate. |
| `js/pointer.js` | Pointer tracking for touch repulsion. |
| `js/loop.js` | `frame()`: spring towards target, pointer repulsion plus swirl, angular spring, emotion sway / tremble / hue. |
| `js/ui.js` | Samples, emotion chips, input form, microphone (SpeechRecognition), archive buttons, toast. |
| `js/main.js` | Boot: resize handler, first dream, test hook `window.__dream = { commit, ptr, n }`, start the loop. |

Keyword matching: CJK uses substring; ASCII uses `\bword(?:s|es|ing|ed)?\b`. Font size is `clamp(U*0.042, 7, 12)` px.

## 4. Testing the lexicon

`node tests/classify.js` checks the object / combo / concept / unclassified decision on 96 words. The full mapping logic is in `docs/mapping-logic.md`.

`node tests/coverage.js` (or `-v` for per-dream detail) checks `tests/dreams.json` and reports no-match rate, recall and precision of the chosen scenes. When you add words, run it before and after. The `fresh` set was written after the lexicon expansion without tuning to it; add new real playtest dreams as a new set instead of tuning on old ones.

## 5. How to add a scene

1. Add the words to `LEX` in `js/lexicon.js`, then call `def('name', '中文名', 'sky|hero|ground', LEX.name, build)`.
2. `build` returns strokes in a normalised box; reuse helpers (`hatch`, spirals, beziers).
3. Check the keywords do not collide with other scenes (e.g. "楼梯" must not trigger city).
4. Test with `__dream.commit('your dream text')` and screenshot at 390x844.

## 6. Requirements checklist (what "done" means)

Functional
- [x] Input by text, optional voice
- [x] Keywords choose scenes, words form the picture
- [x] Touch repulsion with spring return
- [x] Emotion selection and auto detection
- [x] Optional sound
- [x] Local archive
- [ ] Playtest with at least one other person and record feedback in PROGRESS.md
- [ ] Deployed demo (GitHub Pages) linked from README
- [x] Broader keyword understanding: lexicon with synonyms, emotion fallback, unmatched words as dust, "what did we miss?" log
- [x] 89 elements (animals, 39 everyday-object archetypes found by head word), evidence-based abstract symbols (concept table, else "unclassified" and logged), colour words, larger pictures
- [ ] Optional LLM matching later, behind a user-supplied key, never committed

Ideas for upcoming weeks (adjust with tutor)
- 12 Nov, integrated core experience: polish scene composition, more scenes, better onboarding.
- 19 Nov, playtest: collect feedback, fix top 3 issues.
- 26 Nov, delivery candidate: deploy, README final, performance on low-end phones.
- 3 Dec, final review.

## 7. Working style for the AI

- Make small, focused changes; one feature per commit with a clear message.
- After each change, run the page in a browser (e.g. Playwright at 390x844), check the console for errors and look at a screenshot.
- Do not rewrite the whole file for a small change.
- Explain what you changed and why in plain language so teammates can follow.
