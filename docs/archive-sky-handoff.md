# Archive / 3D sky integration handoff

Base: `7e624e78e48bec075aab1a929ecbce89bb219639`. Prepared 18 November 2026. This source is a local handoff, not a deployed release.

## Scope

- Existing archive data is validated. Storage errors report failure; quota retry drops thumbnails, and unsuccessful save/delete attempts preserve the current memory state.
- Archive controls now have a real sky implementation (`js/sky.js`): 3D world positions, perspective/dolly, viewer-facing silhouettes, particle thickness and depth ordering, gradient light sprites, soft gas, drag inertia, keyboard navigation, list fallback and reopening.
- `buildList` computes stable per-scene lighting fields. `tint` and the common frame loop apply the softer palette and edge opacity to every picture.
- `wordDrift` gives individual phrases small independent translation and rotation. Reopened archives, samples, live typing and future generated dreams share this renderer; no named-dream exception enables these effects.
- Existing thumbnails are cached snapshots. Reopening a record renders its current picture; new saved thumbnails/exports capture the updated appearance.
- `js/demo.js` is optional synthetic review data in a separate storage key. Production startup remains `index.html` without query parameters.

## Automated tests

Run `node tests/run.js` with Node 18+. It checks syntax, local script references and six regression suites. No npm install or external service is needed. The accompanying handoff contains exact run output; browser-only checks are reported separately.

## Browser acceptance checks

1. At desktop and 390×844, open an existing legacy archive entry and a newly generated dream. Each should have soft central light, fading edges and small independent phrase drift.
2. Switch all six moods; the palette should change while keeping the shared gradient and stable outline.
3. Push words by mouse/touch; after release they should spring back to the gently moving target.
4. Generate two dreams quickly, then open the archive immediately. Both should be retained; reload to verify storage.
5. With browser storage blocked, a save must report failure. It must not show a success toast or append a phantom record.
6. Open Sky. Drag through a large angle; silhouettes should face the viewer while positions, sizes and overlaps exhibit perspective. Zoom, select/fly to a dream, and reopen it.
7. Use left/right and Enter on the sky canvas, and test the list view.
8. Export a picture and inspect its colour/words/caption. Toggle language and sound; verify optional voice input on a supporting browser.

## Limits and follow-up

The rendering uses 3D mathematics projected through Canvas 2D; it does not add a WebGL/Three.js dependency. Old shapes without snapshots are reconstructed from current rules and can differ from their old thumbnail. Recognition is heuristic, and no pixel-identical restoration is claimed.

External-person playtest feedback, final identity details, PR approval and deployment are still team actions. Historical tests in PROGRESS are not relabelled as current manual playtests. The course assignment is supplied in `docs/assignment-requirements.txt`; the submitting teammate should follow its repository-URL and course-platform instructions.
