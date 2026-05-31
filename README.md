# Glam Studio AI

AI-assisted mobile photo and video editor for creators — built as an Expo Router MVP with real import, preview, and project persistence. **Demo scope:** preview overlays and JSON recipe exports; not a full on-device ML or transcoding pipeline.

**Repository:** [github.com/mathuryashash/Glam_AI](https://github.com/mathuryashash/Glam_AI)

---

## Features

| Area | What works in this build |
| --- | --- |
| **Import** | Gallery pick via `expo-image-picker`; projects store file URIs |
| **Photo** | Retouch presets, background template preview, object cleanup marker |
| **Video** | Trim window, filter presets, intensity control; live playback |
| **Export** | Story (9:16) and Carousel presets → `editor-recipe-v1` JSON artifacts |
| **History** | Reopen or delete projects; edits persist across sessions |

For what is simulated vs. production-ready, see [docs/judging/AI-VS-SIMULATED.md](docs/judging/AI-VS-SIMULATED.md).

---

## Tech stack

| Layer | Packages |
| --- | --- |
| Framework | Expo SDK **54**, React Native **0.81**, React **19** |
| Routing | Expo Router **6** |
| State | Zustand + `@react-native-async-storage/async-storage` |
| Media | `expo-image`, `expo-video`, `expo-image-picker`, `expo-file-system` |
| UI | NativeWind, Reanimated, Gesture Handler, Lucide icons |
| Quality | TypeScript, Jest + `jest-expo` |

The repo also includes legacy template modules (Supabase, RevenueCat, PostHog, Sentry) for future product expansion; the **editor demo** does not require them.

---

## Prerequisites

- **Node.js** 20+ and **npm** 10+
- **Expo Go** matching **SDK 54** on a physical device (or Android Studio / Xcode for emulators)

---

## Quick start

```bash
git clone https://github.com/mathuryashash/Glam_AI.git
cd Glam_AI
npm install
npm start
```

Then press `a` (Android), `i` (iOS simulator), or scan the QR code with Expo Go.

**Optional — lean editor boot** (skips Sentry, PostHog, RevenueCat init):

```bash
# .env or shell
EXPO_PUBLIC_EDITOR_ONLY=true
```

Copy `.env.example` if you need a starting point. **Do not commit `.env`** — it may contain secrets.

The app opens at `/(editor)` (editor home). Full walkthrough: [README-EDITOR.md](README-EDITOR.md).

---

## Project structure

```
app/
  index.tsx              → redirects to editor
  (editor)/              → Home, Import, Photo, Video, Export, History
lib/
  editor/
    projectStore.ts      → Zustand persist (AsyncStorage)
    photoPipeline.ts     → retouch / BG / object state
    videoPipeline.ts     → trim / filters
    exportPipeline.ts    → JSON recipe artifacts
components/editor/
  EditorShell.tsx        → shared chrome
  CanvasContainer.tsx    → aspect frame
  MediaPreview.tsx       → live preview overlays
docs/
  ARCHITECTURE.md        → data flow and MVP boundaries
  judging/               → submission, screenshots, AI honesty
ai-logs/
  AI-DEV-LOG.md          → build log and prompt iterations
```

---

## AI and demo honesty

UI labels reflect product intent. The MVP uses **real** gallery import, video playback, and persisted edit stacks. **Simulated** paths stand in for segmentation, inpainting, and final encode so Expo Go demos stay reliable.

| Document | Purpose |
| --- | --- |
| [docs/judging/AI-VS-SIMULATED.md](docs/judging/AI-VS-SIMULATED.md) | Feature-by-feature: simulated vs. production path |
| [ai-logs/AI-DEV-LOG.md](ai-logs/AI-DEV-LOG.md) | How the app was built with AI assistance |

---

## Documentation

| Doc | Description |
| --- | --- |
| [README-EDITOR.md](README-EDITOR.md) | Developer guide — setup, test flow, troubleshooting |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Editor architecture and data flow |
| [docs/judging/SUBMISSION.md](docs/judging/SUBMISSION.md) | Pre-submit checklist for judges |
| [docs/judging/SCREENSHOTS.md](docs/judging/SCREENSHOTS.md) | Screenshot checklist |
| [docs/judging/LOOM-WALKTHROUGH.md](docs/judging/LOOM-WALKTHROUGH.md) | Demo script |
| [docs/judging/REFLECTION.md](docs/judging/REFLECTION.md) | Build reflection |

**Screenshots:** add captures under `docs/judging/screenshots/` (folder may be empty until you record the demo).

---

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android (dev client / emulator) |
| `npm run ios` | Run on iOS (macOS) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Jest unit tests |

---

## License

Private contest / portfolio submission (8x Engineer). License not specified in-repo — contact the maintainer before redistribution.

---

## Related links

- **GitHub:** https://github.com/mathuryashash/Glam_AI
- **Deep dive:** [README-EDITOR.md](README-EDITOR.md)
