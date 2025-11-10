# How-To Guide

Practical recording scenarios with complete Blueprint and C++ code examples.

## Recording Scenarios

Browse through these common use cases to find solutions for your specific needs:

### 1. [Record Gameplay with a Hotkey](./hotkey-recording)
Press F9 to start recording, F10 to stop, with notifications.

**Best for:** Basic gameplay recording, testing, streaming preparation

---

### 2. [Record Last 30 Seconds (Instant Replay)](./instant-replay)
Continuously record but only save the last 30 seconds when triggered.

**Best for:** Highlight systems, replay features, "save that moment" functionality

---

### 3. [Record Security Camera View](./security-camera)
Record from a specific camera actor placed in the level (CCTV-style).

**Best for:** In-game surveillance systems, security footage, fixed camera recording

---

### 4. [Create a Photo Mode](./photo-mode)
Pause game, take screenshots and videos with free camera control.

**Best for:** Marketing screenshots, cinematic captures, player-created content

---

### 5. [Record a Time-Lapse](./time-lapse)
Capture 1 frame per second for compressed time-lapse videos.

**Best for:** Long gameplay sessions, construction progress, day/night cycles

---

### 6. [Record Multiple Camera Angles](./multi-camera)
Record 4 cameras simultaneously in a split-screen grid layout.

**Best for:** Sports replays, multi-angle footage, broadcast-style recording

---

### 7. [Record Without Voice Chat](./no-voice-chat)
Record gameplay audio but exclude voice chat using submixes.

**Best for:** Multiplayer recordings, content creation, privacy-focused recording

---

### 8. [Automatically Record Boss Fights](./boss-fights)
Start recording when boss fight begins, stop when it ends.

**Best for:** Epic moments, automatic highlight capture, gameplay analysis

---

### 9. [Record Minimap Replay](./minimap-replay)
Record a top-down minimap view to a separate video file.

**Best for:** Tactical analysis, strategy reviews, map awareness training

---

### 10. [Create Crash Recovery System](./crash-recovery)
Save the last 60 seconds of gameplay if the game crashes.

**Best for:** Bug reports, crash analysis, QA testing, post-mortem debugging

---

## Quick Reference

| Scenario | Complexity | Recording Type | Audio |
|----------|------------|----------------|-------|
| Hotkey Recording | ⭐ Easy | Viewport | ✅ |
| Instant Replay | ⭐⭐ Medium | Viewport (Circular Buffer) | ✅ |
| Security Camera | ⭐⭐ Medium | Camera | ❌ |
| Photo Mode | ⭐⭐⭐ Advanced | Camera + Screenshot | ❌ |
| Time-Lapse | ⭐⭐ Medium | Manual Capture | ❌ |
| Multi-Camera | ⭐⭐ Medium | Multi-Camera Grid | ✅ |
| No Voice Chat | ⭐⭐ Medium | Viewport (Submix) | ✅ |
| Boss Fights | ⭐⭐ Medium | Viewport (Auto-triggered) | ✅ |
| Minimap Replay | ⭐⭐⭐ Advanced | Render Target | ❌ |
| Crash Recovery | ⭐⭐⭐⭐ Expert | Circular Buffer (System) | ✅ |

---

## Need More Help?

- [Quick Start Guide](../quick-start) - Basic recording setup
- [API Reference](../api/runtime-video-recorder) - Complete API documentation
- [Troubleshooting](../troubleshooting) - Common issues and solutions
- [Discord Community](https://discord.com/invite/pBDSCBcdgv) - Get help from the community

