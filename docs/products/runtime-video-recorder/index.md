# Runtime Video Recorder (RVR)

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![UE5](https://img.shields.io/badge/Unreal%20Engine-5.3%2B-informational.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**High-performance video recording plugin for Unreal Engine**

---

## Overview

Runtime Video Recorder (RVR) is a production-ready Unreal Engine plugin that enables **MP4 video recording at runtime without game or render thread hitches**. Built with performance in mind, it supports hardware-accelerated encoding on Windows (WMF), macOS (AVFoundation), Linux/Android (OpenH264), and includes specialized features for VR and multi-camera setups.

## Key Features

### ✨ Zero Performance Impact
- Asynchronous encoding on dedicated thread
- No game thread blocking
- Hardware acceleration support (Windows, Android, Oculus)

### 🎥 Flexible Recording Sources
- Game/Editor viewport recording
- Render target recording
- Single camera recording (Camera & CineCamera)
- Multi-camera grid recording
- 360-degree video support (experimental)

### 🎵 Audio Recording
- Full in-game audio capture
- Selective SoundSubmix recording
- Synchronized audio/video encoding

### ⚡ Advanced Features
- Frame-rate independent recording
- Manual frame capture mode
- Circular buffer (record last N seconds)
- Deferred encoding option
- Real-time camera preview
- Screenshot capture

## Platform Support

| Platform | Status | Hardware Acceleration | Encoder |
|----------|--------|----------------------|---------|
| Windows (Win64) | ✅ Full Support | ✅ Yes (WMF) | H.264 |
| macOS | ✅ Full Support | ✅ Yes (AVFoundation) | H.264 |
| Linux | ✅ Full Support | ❌ Software | OpenH264 |
| Android | ✅ Full Support | ✅ Yes (MediaCodec) | H.264 |
| Oculus | ✅ Full Support | ✅ Yes | H.264 |

## Quick Links

- [Installation Guide](./installation)
- [Quick Start Tutorial](./quick-start)
- [API Reference](./api/runtime-video-recorder)
- [Troubleshooting](./troubleshooting)

## Video Tutorial

<iframe width="100%" height="400" src="https://www.youtube.com/embed/dmlnrD67Wx8" title="Runtime Video Recorder Tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Community & Support

- **Discord:** [Join our community](https://discord.gg/wptvWkhtGm) for quick support
- **Download:** [Get the plugin](/download) from our website
- **Website:** [unrealsolutions.com](https://unrealsolutions.com)

## What Makes RVR Special?

Unlike 99% of alternatives, RVR **doesn't rely on ffmpeg** or any external executables. It uses native OS APIs for hardware-accelerated encoding:

- **Windows:** Windows Media Foundation (WMF)
- **macOS:** AVFoundation
- **Android/Oculus:** MediaCodec
- **Linux:** OpenH264 (software encoding)

This approach delivers superior performance, quality, and reliability while keeping your game running at peak performance.

## Trusted by Industry Leaders

RVR is used by:
- Amazon Games
- Meta Research
- Rico Inc
- Unlit Studio
- And many more...

## Next Steps

Ready to get started? Follow our [Quick Start Guide](./quick-start) to record your first video in under 5 minutes!

