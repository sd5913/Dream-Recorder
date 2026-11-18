# Weekly progress

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

