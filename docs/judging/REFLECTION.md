# Reflection

## What was easy
- Reframing routing into an editor-first architecture was straightforward because Expo Router already separated app areas.
- Building a serializable project model made history and re-open workflows simple once the state boundary was clear.

## What was difficult
- True mobile video processing inside Expo remains the largest implementation risk under tight deadlines.
- Balancing “AI wow factor” with deterministic behavior required explicit trade-offs per feature.

## What I would change next
- Add a production render backend for real encoded video output and progress tracking.
- Introduce undo/redo timeline snapshots and brush-based object mask editing.
- Add E2E smoke tests for import -> edit -> export -> history loop on device.

## Key trade-off accepted
- We chose reliability and clear product UX over native-heavy rendering complexity to optimize for judged demo quality.

## Submission gaps (pending)
- **Screenshots:** checklist is in `docs/judging/SCREENSHOTS.md`; PNG files go in `docs/judging/screenshots/` (`01-home.png` … `06-history.png`). Images not yet committed — author will capture on device and add before final submit.
- **Loom walkthrough:** script is ready in `docs/judging/LOOM-WALKTHROUGH.md`; recording URL placeholder still empty.
- **AI transparency:** standalone judge table at `docs/judging/AI-VS-SIMULATED.md` mirrors `ai-logs/AI-DEV-LOG.md`.

## Ethics of demo AI / honest labeling
- Features labeled “AI” in the UI (Background AI, Photo AI, object cleanup) represent **product intent**, not live model inference in this MVP.
- Preview effects are **deterministic compositing** (tints, gradients, cutout framing) so demos never fail mid-judge because an API timed out.
- Export writes **JSON recipe files**, not rendered MP4/JPEG — we say so in the Loom script and judging docs rather than implying encoded output.
- Production path for each feature is documented in the AI vs simulated tables so reviewers can separate demo scaffolding from roadmap.

## Failure story: MMKV in Expo Go + Metro on Windows
1. **MMKV:** Early plan used `react-native-mmkv` for fast project persistence. Opening History in **Expo Go** crashed — MMKV requires native code not present in the stock client. Fix: pivot to **AsyncStorage** in `projectStore.ts`; keep MMKV as optional in `docs/PUBLISHING.md` for custom builds only.
2. **Metro watcher:** On Windows, `expo start` failed when Metro tried to watch optional `@sentry/cli-darwin` (and sibling) packages pulled in by `@sentry/react-native/metro`. Fix: extend `metro.config.js` `blockList` to ignore those platform-specific CLI paths. Dev server then starts reliably.

## What changed after judge feedback
- Archived unrelated Nebula astrology build log to `ai-logs/archive/` so submission logs match this editor MVP.
- Expanded AI dev log with iterations 5–8, prompt excerpts, and an explicit real-vs-simulated matrix.
- Added Loom segment calling out JSON export vs production MP4/JPEG.
- Structured screenshot filenames and folder for consistent judging pack assembly.
- Added standalone `AI-VS-SIMULATED.md` for quick reviewer scanning.
