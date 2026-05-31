# AI vs Simulated (Judge Reference)

Glam Studio AI MVP uses **real** media import, playback, and project persistence. **Simulated** paths stand in for ML inference and final encode so Expo Go demos stay reliable. UI labels reflect product intent; this table is the source of truth.

| Feature | User-facing label | Implementation (MVP) | Production path |
| --- | --- | --- | --- |
| Beauty retouch | Retouch presets (Natural, Soft Glow, Studio) | Semi-transparent color tint overlays in `MediaPreview` | On-device portrait ML or cloud retouch API |
| Background replacement | Background AI | Gradient template + cutout-frame compositing; no segmentation | Segmentation model + inpainting / green-screen pipeline |
| Object removal | Object cleanup | Sets `objectRemovalMaskId`; badge overlay only | Brush mask + inpainting (SAM / Remove.bg API) |
| Video trim | Trim window | `editStack.videoTrim` state (seconds 0–10) | Native FFmpeg / AVFoundation trim |
| Video filters | Cinematic, Vivid, Dream, Mono | Tint overlays scaled by `effectIntensity` | LUT / color grading + GPU shaders |
| Video preview | Live preview | Real playback via `expo-video` | Same + frame-accurate scrubber |
| Export | Story 9:16 / Carousel presets | JSON recipe file in app documents (`lib/editor/exportPipeline.ts`) | Server or on-device render to **MP4 / JPEG** |
| Project history | History gallery | Zustand persist → **AsyncStorage** (MMKV optional in custom builds only) | Same schema + cloud sync |
| Media import | Import Photo or Video | Real `expo-image-picker` gallery URI | Same + camera roll write-back |

## What is genuinely real in the demo
- Gallery pick → file URI stored on project
- Video loops in preview (`expo-video`)
- Edit stack mutations (trim, filters, retouch IDs) persist and reload from History
- Export creates a **JSON artifact** on disk (inspectable recipe, not a fake progress spinner)

## What is simulated (by design)
- Segmentation, inpainting, and object removal pixels
- Encoded video/image export (MP4/JPEG)
- Any cloud ML API calls

Full build narrative: `ai-logs/AI-DEV-LOG.md` (iterations 1–8 + prompt excerpts).
