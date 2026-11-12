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

- **Member C contribution:** imported the supplied scene package in three focused commits: 9 animals, 12 icons and 39 everyday-object archetypes, plus their staged script includes in `index.html`. The supplied application files are preserved without edits.
- **Evidence:** all three new JavaScript modules pass syntax checks. Chromium previews were run after each import (steps 1–2 at 390×844; step 3 at 1440×900); the existing page renders, but the new modules report `LEX is not defined` because `js/lexicon.js` is absent from both this package and current `main`.
- **Blockers:** this is a draft contribution, pending the team's prerequisite work. Supply the shared lexicon and update scene registration/detection so modules loaded after `things.js` receive keyword matchers. Reconcile overlapping keywords (for example, the current cat scene also matches dog) and preserve teammates' changes to `index.html` during integration. A's PR #1 is still open at import time.
- **Next:** integrate the prerequisite team work, then test new scene generation on phone and desktop before marking the PR ready or merging. Functional checks of the 60 new scenes are pending.
## 19 Nov 2026 · Playtest and feedback
## 26 Nov 2026 · Delivery candidate (deployment)
## 3 Dec 2026 · Final tutor delivery review
