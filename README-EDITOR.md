# Glam Studio AI (Mobile Editor MVP)

AI photo + video editor built on Expo Router.

## Prerequisites

- Node.js 20+
- npm 10+
- **Expo Go SDK 54** on your phone (this project targets Expo SDK 54)
- Android Studio / Xcode for emulators (optional)

## Setup

```bash
cd "d:\8xengineer\the ai video app"
npm install
```

## Run the app

```bash
npm start
```

Then:

- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Scan the QR code with **Expo Go** on a physical device

## Test the full flow

1. **Home** — opens `/(editor)` with module cards (Photo, Video, Export, History).
2. **Import** — tap “Import Photo or Video”, pick from gallery, grant media permission.
3. **Photo** — apply retouch preset, toggle background removal, pick a template, run object cleanup.
4. **Video** — import a short clip; adjust trim window and filters; change intensity.
5. **Export** — generate Story (9:16) or Carousel presets; outputs save as metadata artifacts under app documents.
6. **History** — reopen a project or delete it; edits persist via AsyncStorage.

## Quality checks

```bash
npm run typecheck
npm test
```

## Judging artifacts

- `docs/judging/SCREENSHOTS.md` — screenshot checklist
- `docs/judging/LOOM-WALKTHROUGH.md` — demo script
- `docs/judging/REFLECTION.md` — build reflection
- `docs/judging/AI-VS-SIMULATED.md` — what is AI vs demo simulation (for judges)
- `ai-logs/AI-DEV-LOG.md` — AI development log with prompt iterations

## Troubleshooting

- **Expo Go SDK mismatch** — install Expo Go that matches **SDK 54** (this project uses `expo ~54`). If the QR scan fails or the app crashes on launch, update Expo Go from the App Store / Play Store.
- **Supabase warning in Metro** — optional for the editor MVP. Missing `EXPO_PUBLIC_SUPABASE_*` env vars may log warnings; editor flows do not require Supabase.
- **Export output is JSON, not media** — Export Lab writes `editor-recipe-v1` recipe files under app documents, not rendered PNG/MP4 files.

## Notes

- Video export uses a **deterministic JSON recipe artifact** (not full native transcoding) for demo stability.
- Project state stores **file URIs only** (no base64 blobs in storage). Persistence uses **AsyncStorage** so the app runs in **Expo Go** without custom native builds.
