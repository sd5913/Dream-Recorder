# Dream Recorder

A mobile-first web app that turns a recorded dream into a picture made of the dream's own words. Words follow paths to form dream objects and scenes (sea, moon, door, stairs, flight…). Touch pushes the words away and they spring back.

Course: Designing Multimedia Entertainment · Group project 2026 (sd5913)

## Who it is for and what they do

- **Audience:** people who want to keep the feeling of a dream, not just the events, shortly after waking or when looking back at old dreams.
- **What they do:** type or speak a dream (or a few keywords), optionally pick an emotion.
- **How it responds:** keywords select scenes from a library of 26 elements; the user's own words are laid along the scene's strokes; emotion changes colour and motion; touching or dragging scatters the words; the result can be saved to a local archive.

## Multimedia

- Real-time typography animation (HTML5 Canvas, spring physics)
- Emotion-driven colour and motion
- Optional WebAudio soundscape (off by default; touching words plays notes)
- Optional voice input (browser speech recognition)

## Prerequisites

A modern browser (Chrome, Edge, Safari or Firefox). No build step, no dependencies, no secrets or API keys. Fonts are loaded from Google Fonts when online; the app falls back to system fonts offline.

## Run it

1. Clone the repository.
2. Open `index.html` in a browser, or serve the folder: `python3 -m http.server 8000` then visit http://localhost:8000.

## Project structure

```
index.html        page markup, loads the scripts in order
css/style.css     layout and theme
js/               core, emotion, geometry, scenes/, compose, words, particles,
                  canvas, sound, archive, dream, pointer, loop, ui, main
docs/             assignment brief
SPEC.md           project spec for AI coding tools (also CLAUDE.md, AGENTS.md, .cursorrules)
PROGRESS.md       weekly progress and tutor feedback
```
3. Live demo: https://sd5913.github.io/Dream-Recorder/

## Platforms and limitations

- Designed for phone screens, also works on desktop.
- Voice input only appears in browsers that support SpeechRecognition.
- Keyword matching is rule-based: 26 scenes, Chinese and English keywords; unmatched text becomes a swirl.
- The archive is stored in the browser's localStorage (24 entries) and is not synced between devices.

## Project management

- Board: _link GitHub Project here_
- Weekly progress and tutor feedback: [PROGRESS.md](PROGRESS.md)

## Team and contributions

| Member | Role / ownership |
| --- | --- |
| WeiYing | Concept, prototype, scene library |
| _add teammates_ | _add_ |

## Credits

- Code: original, written for this project.
- Fonts: system fonts only in the app.
- No third-party images, audio files or datasets. All visuals are generated from the user's text; sound is synthesised with WebAudio.
- **AI use:** Claude (Anthropic) helped write and test the prototype code and the pitch slides. The concept, direction and design decisions are the team's.
- The visual idea was inspired by a typography reference video (words forming a sunflower); no footage or assets from it are used.
