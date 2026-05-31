# Loom Walkthrough Script

## Recording URL

<!-- Paste Loom link here: https://loom.com/... -->

## 1) 20-second intro
- Product: Glam Studio AI (mobile photo + video editor)
- Positioning: hybrid AI architecture for stable demo reliability
- Core value: one-tap enhancements and creator-ready exports

## 2) End-to-end demo flow
1. Open Home and explain module map (Photo, Video, Export, History)
2. Import a photo from gallery
3. Apply retouch preset + background template + object removal action
4. Switch to Export and generate Story + Carousel output
5. Import a short video
6. Adjust trim window and filter intensity
7. Export video metadata artifact
8. Open History and re-open both projects

### Export honesty beat (~15 seconds)
- Say explicitly: **"Exports save JSON recipe files in MVP — production would render MP4/JPEG."**
- Optional: open Files / share sheet or mention path under app documents (`editor-exports/`) so judges know output is a structured recipe, not a encoded video file yet.

## 3) Technical highlight (30-40s)
- `projectStore` is serializable and URI-based only
- `CanvasContainer` centralizes aspect fit/interaction alignment
- Video editing is timeline-state driven to avoid unstable native pipeline risk

## 4) Close
- Mention judging artifacts: screenshots pack, AI logs, reflection
- Mention what is real vs simulated in this MVP (see `docs/judging/AI-VS-SIMULATED.md`)
