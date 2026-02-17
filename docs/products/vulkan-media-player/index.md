# Vulkan Media Player

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Status](https://img.shields.io/badge/status-experimental-orange.svg)
![UE5](https://img.shields.io/badge/Unreal%20Engine-5.x-informational.svg)

**Hardware-accelerated video playback plugin for Unreal Engine using Vulkan Video**

---

## Overview

Vulkan Media Player is a cutting-edge media playback solution for Unreal Engine that leverages **Vulkan Video API** for hardware-accelerated video decoding. Designed specifically for Linux platforms with optimized support for Vulkan-enabled graphics cards, this plugin provides high-performance video playback with minimal CPU overhead.

## Key Features

### ⚡ Hardware Acceleration
- Native Vulkan Video API integration
- GPU-accelerated video decoding
- Minimal CPU usage during playback
- Optimized for modern graphics hardware

### 🎥 Video Playback
- H.264 (AVC) video codec support
- Seamless integration with Unreal's Media Framework
- Texture-based video rendering
- Real-time video streaming support

### 🎵 Audio Support
- Synchronized audio playback
- Multiple audio track support
- Integration with Unreal's audio system

### 🖥️ Platform Support
- **Linux**: Full hardware acceleration via Vulkan Video
- **Windows**: Full support (Win64)
- **Linux ARM64**: Optimized for ARM platforms

## What Makes Vulkan Media Player Special?

Unlike traditional media players that rely on software decoding or platform-specific APIs, Vulkan Media Player uses the **Vulkan Video extension** for cross-platform hardware acceleration. This provides:

- **Better Performance**: GPU-accelerated decoding reduces CPU load
- **Cross-Platform**: Consistent behavior across Linux and Windows
- **Modern Architecture**: Built on the latest Vulkan standards
- **Future-Proof**: Ready for emerging video codecs and formats

## Use Cases

Vulkan Media Player is perfect for:

- 🎮 **In-Game Cinematics**: Play high-quality video cutscenes without performance impact
- 📺 **Video Streaming**: Real-time video streaming in applications
- 🎬 **Virtual Production**: Video playback in virtual sets and environments
- 📱 **UI Video Elements**: Video backgrounds and UI components

## Getting Started

Ready to integrate video playback into your Unreal Engine project? Follow these guides:

- [Installation Guide](./installation) - Install and configure the plugin
- [Quick Start](./quick-start) - Play your first video in 5 minutes
- [Video Playback Guide](./features/video-playback) - Learn about playback features

## Platform Requirements

### Linux
- Vulkan 1.3+ compatible GPU
- Vulkan Video extension support
- Mesa 23.0+ or proprietary drivers with Vulkan Video support

### Windows
- Vulkan 1.3+ compatible GPU
- Windows 10/11
- Latest GPU drivers

### Unreal Engine
- UE 5.0 or later
- Vulkan RHI enabled

## Current Status

::: warning Experimental Release
Vulkan Media Player is currently in **experimental** status. While it's functional and ready for testing, some features may be under active development. We welcome feedback and bug reports through our [Discord community](https://discord.com/invite/pBDSCBcdgv).
:::

## Community & Support

- **Discord:** [Join our community](https://discord.com/invite/pBDSCBcdgv) for support and discussions
- **FAB Marketplace:** [Get the plugin](https://www.fab.com/listings/b2fe4881-084b-4b6b-9142-f834ed7aab16)
- **Website:** [unrealsolutions.com](https://unrealsolutions.com)
- **Creator:** Unreal Solutions Ltd

## Next Steps

Get started with Vulkan Media Player:

1. [Install the plugin](./installation)
2. [Follow the Quick Start guide](./quick-start)
3. Explore the [feature documentation](./features/video-playback)

---

*2023-2025 Unreal Solutions Ltd*

