# Weekly process

Each week: goal, done, evidence, tutor feedback, blockers, next goal with owners.

## 5 Nov 2026 · First working interaction

- **Goal:** one working interaction.
- **Done:** web prototype. Dream text becomes a scene made of words; touch pushes words away and they spring back; 6 emotions change colour and motion; local archive.
- **Evidence:** screenshots of sunflower/sea/moon, sea/flight, stars/stairs/door scenes; tested at 390×844 in Chromium.
- **Tutor feedback:** _fill in after meeting_
- **Blockers / questions:** _fill in_
- **Next goal (12 Nov, integrated core experience):** _owners to fill in_

## 12 Nov 2026 · Integrated core experience

Early work (started 5 Nov, branch `feat/lexicon`): many dream elements were not recognised.
- **Plan:** (1) move keywords to a lexicon file and expand them, with a measurable test; (2) never fall back to a plain swirl: choose default scenes from the emotion, show unmatched words as drifting dust, show what was recognised, and log misses during playtests.
- **Done:** `js/lexicon.js` (about 3x more words, Chinese and English), strongest-match scene selection, emotion fallback, dust words, "识别到" line and a "少了什么？" button that stores missed dreams locally, `tests/coverage.js` with 80 sample dreams.
- **Evidence** (80 sample dreams written by us, with the scenes a person would expect; `dev` and `holdout` were seen while expanding, `fresh` was written afterwards and not tuned on):

| Set | No-match dreams before | after | Recall before | after | Precision before | after |
| --- | --- | --- | --- | --- | --- | --- |
| dev (40) | 2 | 0 | 73% | 96% | 77% | 81% |
| holdout (20) | 2 | 0 | 76% | 89% | 90% | 84% |
| fresh (20) | 5 | 3 | 64% | 82% | 85% | 90% |

  The 3 remaining no-match dreams now get an emotion-based picture instead of a swirl. Recall = wanted scenes that were drawn; precision = drawn scenes that were wanted.
- **Known gaps:** single common words still cause wrong scenes (e.g. 水蓝 draws the sea); the sample set is small and written by the team, so playtest dreams are the real test.

Round 2 (5 Nov, after the tutor's example "white elephant" was not recognised):
- **Problem:** a bigger lexicon alone cannot cover every dream object.
- **Done:** 23 new scenes (elephant, horse, tiger, lion, deer, rabbit, bear, dog/wolf, generic beast; heart, clock, key, boat, bridge, tower, candle, umbrella, feather, crown, skull, hourglass), lexicon roughly doubled again, abstract symbols for unknown nouns (8 shape families chosen from the word itself, shown as "词（象征）"), colour words tint the picture (white elephant is drawn in white), and the composition now uses the free screen area (pictures were too small; every order of sky/hero/ground and row split is tried).
- **Evidence:** `node tests/coverage.js` on 104 sample dreams (expectations updated for the new scenes): recall 91%, precision 88%, 2 dreams with no match (they now get emotion defaults or symbols). Round-2 dreams (24) were written by us using the new vocabulary, so they only show the new scenes work, not how well the lexicon generalises; playtest dreams are the real test. Frame rate stayed at 60 fps in headless Chrome with up to about 1000 particles.
- **Known gaps:** noun finding for unknown words is a heuristic (looks after 的, 一只, a/the), animals and icons are simple outlines, and three large scenes in one picture get crowded.
- **Next:** playtest with other people (19 Nov), read the miss log, add words, re-run `node tests/coverage.js` and record the numbers.

Round 3 (12 Nov, feedback: the abstract symbols felt arbitrary and real life has endless products):
- **Problem:** symbol shapes came from a hash of the word, so "手机" and "孤独" got random shapes with no reason behind them.
- **Done:** (1) 39 everyday-object archetypes (cup, bottle, bowl, pot, box, bag, phone, laptop, TV, camera, chair, table, sofa, clothes, dress, hat, shoe, knife, hammer, scissors, car, bicycle, ball, egg, coin, cake, bread, picture, piano, guitar, music, hand, tooth, mouth, foot, gear...). (2) Head-word rule: the last part of a compound names the object (保温杯 → cup, `paper bag` → bag). (3) A documented concept table for abstract ideas (memory → ripple, loneliness → orbit, secret → knot...). (4) Only words with no evidence get a hash shape, labelled "（未归类）" and sent to the miss log. (5) The caption shows the reason.
- **Evidence:** `node tests/classify.js`: 88 words, 100% after tuning; the unseen batch of 32 was 30/32 on its first run (行李箱 and 月饼 were wrong and then fixed), so honest accuracy is about 94%. `node tests/coverage.js` on 104 dreams: recall 90%, precision 89% (expectations extended with the legitimate new objects, e.g. 手机, 牙齿). Visual grids of all 40 drawings checked at 390×844; no JS errors across the 104 dreams.
- **Known gaps:** objects are generic (every bottle looks alike); concept symbols only appear when the dream has room for a third picture; the concept table is our own convention and playtesters may disagree.

Round 3b (12 Nov, idea from the team: combine existing images like tarot cards):
- **Done:** `COMBO` table: 27 abstract words drawn as two existing pictures (time = hourglass + moon, wedding = dress + heart, betrayal = knife + heart...). Order of evidence is now lexicon, object head word, combo card, concept shape, unclassified. The caption says "（组合：…）". Written up in `docs/mapping-logic.md`.
- **Evidence:** `node tests/classify.js` 96 words; the combo words were written together with the table, so that part only proves the rules run. No JS errors across 104 dreams in Chromium.
- **Known gaps:** small pictures such as the hourglass get lost among dust words; the table is hand-written.

Round 4 (16 Nov, English version of the program):
- **Done:** `js/i18n.js` with a Chinese and an English text table; a language button (`EN` / `中`) switches the whole interface live: buttons, placeholder, sample dreams, mood names, scene names, the evidence line under the picture, archive texts and toasts. It starts in the browser language and remembers the choice in localStorage. The caption is now rebuilt by `renderCaption()` so it can change language without redrawing the dream.
- **Evidence:** Chromium at 390×844 and 1440×900: switching to English translates the controls, samples, caption and archive, then switching back restores Chinese; no page errors. Classification and coverage checks still pass.
- **Known gaps:** only the interface is translated (the Chinese and English keyword lists were already both in the lexicon); the app text on the pitch slides and the Chinese docs are not translated.

Round 5 (18 Nov, member A picture and motion):
- **Done:** unified colour palette per dream, staged scene composition with depth, word transitions between dreams, a living background, mood-specific synthesized sound, live preview while typing, preservation of a pending archive save when another dream starts, and local PNG export.
- **Evidence:** Chromium at 390×844 and 1440×900 generated dreams without page errors; live preview updated after typing, a quick second submission retained the first archive entry, and a settled dream exported as a visible PNG. Syntax checks and the existing classification and coverage scripts passed.
- **Next:** group review of this branch, then integrate the next member's changes in the agreed order.

Round 6 (18 Nov, member C / Wei Ying / WINN06, abstract deck):
- **Done:** integrated the supplied C files after A's PR #7 was merged. Added 31 abstract cards with drawing paths, layer, energy and mood affinities; moved symbol drawing into `js/tarot.js`. Dreams without a concrete scene or combo now receive a sky/centre/ground spread based on mood and motion words. Concept mappings are retained, while unknown nouns can label the selected card. Mood words and common English verbs are filtered out of symbol candidates.
- **Evidence:** JavaScript syntax and `git diff --check` passed. `node tests/classify.js`: 96/96. `node tests/coverage.js`: 104 dreams, recall 90%, precision 89%. `node tests/tarot.js`: all 31 cards drew without errors; all 18 sample spreads had distinct cards in the correct layers and repeatable selection; 18/18 centre cards ranked among the five most compatible with the chosen mood. These are automated checks on team-written examples, not user playtest results.
- **Blocker:** browser visual and interaction checks are pending because the available browser could not access the local test page.
- **Next:** C and a teammate review the fallback picture on phone and desktop, try different moods and a recognised-object dream, then merge C before B begins.


## 18 November 2026 — Archive and sky follow-up, ready for teammate review

Status: local handoff; not committed, pushed, merged or deployed. Based on main `7e624e78e48bec075aab1a929ecbce89bb219639`. GitHub review on this date confirmed PRs #1, #2, #4, #5, #6, #7 and #8 were merged. Earlier “pending” notes above describe their historical state.

### Goal and changes
- Fix archive saves/deletions that silently fail. Validate stored data, retry without thumbnails on quota pressure, commit memory only after storage succeeds, and flush pending saves before opening the archive.
- Restore the missing sky behaviour behind the existing archive controls: perspective-projected 3D positions, camera-facing dream silhouettes, local particle depth, graduated star glow, soft gas, orbit/zoom/focus/re-entry, keyboard selection and list fallback.
- Apply soft centre-to-edge colour gradients and independent gentle phrase drift in the shared renderer. Both reopened old records and all newly generated dreams use these rules. Keep named colour cues and touch/spring interaction.
- In the browser's reduced-motion environment, keep a smaller/slower idle drift and suppress larger entry effects/trembling.
- Add portable storage, sky and appearance regression tests and a single Node test runner; refresh README/credits and retain earlier history.

### Review evidence
- Previous browser runs at 1440×900 / 390×844 exercised save, immediate archive flush, list, reload, storage denial and legacy entries.
- Sky browser runs at 1280×800 / 390×844 checked actual pointer drag, focus, re-entry and camera-facing geometry at 12 rotations.
- Colour checks at 1920×920 / 390×844 switched all six moods without page errors.
- Shared-effect checks reopened six synthetic legacy records (door, house/cat, sea/flying, falling, abstract and white elephant), then submitted a fresh dream through the real form. All sampled phrases moved, shared fading colours remained present, and there were no page errors. The mobile run checked two legacy records plus a fresh submission, under reduced-motion media.
- A final Node run and archived output are included with this handoff. Browser reports and selected generated screenshots/recordings are evidence, not a substitute for external-person playtesting.

### Ownership and next steps
- Earlier work remains credited to the PR authors in README; this follow-up package is separate from those merged contributions.
- Receiving teammate: apply the reviewed patch to the named base (or reconcile newer changes), run `node tests/run.js`, perform the browser checklist, then open a reviewable PR.
- Team: verify real names/student IDs for submission, record a real person's playtest and any tutor feedback, and confirm the hosted version after a later deployment. Do not mark these as completed from automated checks.

## 19 Nov 2026 — Restore archive sky script entry

- Reproduced a missing-function error when opening the archive after the typical-dream merge: index.html omitted js/sky.js although the sky implementation remained in the repository.
- Restored js/sky.js after archive.js and js/demo.js after main.js; both entries were removed in the typical-dream merge. Retained js/scenes/typical.js and all newer dream content.
- The user's screenshot confirmed the six-nebula example at ?demo. Restored that existing preset initialization without changing archive keys, deleting records, or populating real-user archives.
- Added an entry-point regression check to tests/sky.js. It fails against the broken HTML and passes with the restored script.
- All six Node suites and the scene registry check passed. Desktop (1280x800) and phone (390x844) browser runs reproduced the error before the fix, then checked three legacy nebulae, focus/re-entry and list switching without page errors. New classroom/elevator/ghost scene definitions were retained.
- This update was requested for direct GitHub integration. The fix PR records the merge and deployment verification outcome.

## 19 Nov 2026 — Make example sky visible from the public homepage

- Follow-up inspection of the public root page showed an Archive 0 view. Unlike the earlier screenshot at ?demo, the normal route intentionally does not seed demo records; no visible example-sky route made this distinction confusing.
- Added explicit bilingual Example sky / My archive links on the normal sample row and archive header. Six preset dreams remain separate from real archives; no existing records are reset or migrated.
- Restored non-blocking online font loading, which had also been reverted by the typical-scenes merge.
- Added static regressions for the visible entry and font-loading mode; preserved sky/demo script guards and typical dream scenes. This follow-up is tracked in its PR and deployment checks.

## 19 Nov 2026 — Optional account archive

- Added a Cloudflare Worker with GitHub OAuth, signed sessions and D1 storage keyed by immutable GitHub user ID. The current static site remains usable with browser-local records.
- Signed-in accounts have separate local caches. Importing old signed-out records requires an explicit click, avoiding silent transfer between people using one browser.
- Node tests cover two-account isolation, unsigned writes, invalid OAuth state and cross-origin writes. Existing scene and archive suites still pass.
- Real GitHub sign-in, remote D1 and cross-device recovery require the team's OAuth App and Cloudflare configuration; they have not been tested in a deployed environment.

## 19 Nov 2026 — Correct unified archive behaviour

- User clarified that the six original examples belong inside the normal archive, not behind another option. Removed the extra links and their layout/text changes from the preceding update.
- The normal archive now combines the six built-in examples with saved personal entries and older demo-key entries. A saved copy of an example suppresses its built-in duplicate. Both existing stores are read without startup writes, resets or migrations; new saves use the existing personal key.
- Build example geometry synchronously without committing a temporary dream or changing the visible picture. Sky and list use the same entries. Old ?demo links open this same archive for compatibility.
- Tests cover six defaults with no writes, preservation of two personal plus six old examples, no duplicate presets and a future save appearing in the unified archive. All six suites and the scene registry checks pass. Browser and deployment results are tracked in the follow-up PR.


