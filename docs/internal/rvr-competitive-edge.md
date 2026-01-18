# RVR Competitive Edge

Why Amazon Games, Riot Games, and 50+ studios chose RVR over alternatives.

---

## Quick Comparison

| Capability | NVIDIA ShadowPlay | OBS | RVR |
|------------|-------------------|-----|-----|
| Mobile (iOS/Android) | ❌ | ❌ | ✅ |
| Headless / CI/CD | ❌ | ❌ | ✅ |
| Works on all GPUs | ❌ NVIDIA only | ✅ | ✅ |
| In-engine integration | ❌ | ❌ | ✅ |
| Game event triggers | ❌ | ❌ | ✅ |
| Zero dependencies | ❌ | ❌ FFmpeg | ✅ |

---

## Why Not NVIDIA ShadowPlay?

1. **No mobile** — ShadowPlay is Windows-only. RVR works on iOS, Android, macOS, Linux, VR.

2. **Cannot run headless** — ShadowPlay needs a display and user interaction. RVR runs in CI/CD pipelines and device farms.

3. **No programmatic control** — ShadowPlay needs a human pressing Alt+F10. RVR triggers from code when crashes or test failures occur.

4. **NVIDIA hardware required** — QA teams use diverse hardware. Can't require NVIDIA on every machine.

5. **External capture only** — ShadowPlay captures final pixels. RVR captures from inside the engine (specific cameras, render targets, pre-UI).

6. **Consumer software** — ShadowPlay is for gamers sharing clips, not enterprise QA with support and SLAs.

---

## Why Not OBS?

1. **External process** — OBS is a separate app that must be managed. RVR embeds in the game.

2. **FFmpeg dependency** — OBS depends on FFmpeg (licensing complexity). RVR has zero external dependencies.

3. **No mobile** — Desktop only.

4. **No game integration** — OBS captures screen. RVR triggers on game events and accesses internal cameras.

---

## RVR Unique Capabilities

- **Mobile QA recording** — The only in-engine recorder for iOS and Android
- **CI/CD integration** — Runs in automated test pipelines, headless
- **Event triggers** — Auto-capture on crash, test failure, achievement
- **Multi-camera** — Capture any render target, spectator view, minimap
- **Cross-platform** — Same API on Windows, Mac, Linux, iOS, Android, VR

---

## One-liner

> "ShadowPlay is for gamers. RVR is for QA teams that need mobile, automation, and proof."
