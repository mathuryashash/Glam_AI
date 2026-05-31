# Submission Checklist

Use this before sending the project to judges or reviewers.

## Artifacts to include

- [ ] **Screenshots** — follow [`SCREENSHOTS.md`](./SCREENSHOTS.md); save files under `docs/judging/screenshots/` (create folder if needed)
- [ ] **Loom walkthrough** — record using [`LOOM-WALKTHROUGH.md`](./LOOM-WALKTHROUGH.md); paste URL here: _______________
- [ ] **Reflection** — [`REFLECTION.md`](./REFLECTION.md) filled in (AI usage, tradeoffs, what you’d ship next)
- [ ] **Architecture** — [`../ARCHITECTURE.md`](../ARCHITECTURE.md) reviewed (entry point, MVP scope, what is simulated)

## Pre-submit commands

Run from project root (`the ai video app/`):

```bash
npm run typecheck
npm test
```

- [ ] `typecheck` exits 0
- [ ] `test` exits 0 (or note known failures below)

Known test notes (if any): _______________

## Demo script (honest bullets)

Say these out loud in the Loom — do not oversell MVP scope:

1. App opens to **editor home** (`/(editor)`); import photo or video from gallery
2. **Photo**: retouch preset, background template, object cleanup — **preview overlays**, not real segmentation
3. **Video**: trim window + filters + intensity — **state/metadata**, source video plays in full
4. **Export**: generates **JSON metadata artifacts** in app documents (Story / Carousel presets), not re-encoded media
5. **History**: projects persist via **AsyncStorage** (Zustand persist); reopen and continue editing
6. Call out explicitly: no native transcode, no on-device ML inference in this build

## Environment for judges

- [ ] `.env.example` copied; optional keys can stay blank for editor demo
- [ ] Optional lean boot: `EXPO_PUBLIC_EDITOR_ONLY=true` in `.env` skips Sentry/PostHog/RevenueCat init
- [ ] Start app: `npm start` → Expo Go or dev build

## Final sanity check

- [ ] No secrets committed (`.env` gitignored)
- [ ] Tab bar visible on main screens
- [ ] At least two projects in History for the walkthrough
- [ ] Loom under ~3 minutes; link is viewable without login
