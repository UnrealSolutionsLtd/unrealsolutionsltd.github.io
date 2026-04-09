# Installation Guide

This guide will walk you through installing and configuring Vulkan Media Player in your Unreal Engine project.

## Prerequisites

Before installing Vulkan Media Player, ensure your system meets these requirements:

### System Requirements

#### Linux
- **Operating System**: Linux distribution with Vulkan support
- **GPU**: Vulkan 1.3+ compatible graphics card
- **Drivers**: 
  - Mesa 23.0+ (for open-source drivers)
  - Latest proprietary drivers (NVIDIA/AMD) with Vulkan Video extension support
- **Vulkan SDK**: Vulkan SDK installed (for development)

#### Windows
- **Operating System**: Windows 10/11 (64-bit)
- **GPU**: Vulkan 1.3+ compatible graphics card
- **Drivers**: Latest GPU drivers from manufacturer

#### Unreal Engine
- **Version**: Unreal Engine 5.0 or later
- **RHI**: Vulkan RHI must be enabled
- **Build**: Development or Shipping build configuration supported

## Verification: Check Vulkan Video Support

Before proceeding, verify your GPU supports Vulkan Video extensions:

### Linux
```bash
# Install vulkan-tools if not already installed
sudo apt-get install vulkan-tools

# Check Vulkan Video extension support
vulkaninfo | grep -i "VK_KHR_video_decode"

# Expected output (at minimum):
# VK_KHR_video_decode_queue
# VK_KHR_video_decode_h264  <-- Required for H.264 support
```

If you don't see these extensions, update your GPU drivers or check the [Troubleshooting](#troubleshooting) section.

### Windows
Use one of these tools to verify Vulkan Video extension support:
- [GPU Caps Viewer](https://www.geeks3d.com/gpu-caps-viewer/)
- GPU-Z
- Vulkan Info (included in Vulkan SDK)

Look for **VK_KHR_video_decode_queue** and **VK_KHR_video_decode_h264** in the extensions list.

## Installation Methods

### Method 1: Clone from GitHub (Recommended)

1. **Clone the Repository**
   ```bash
   cd YourProject/Plugins
   git clone https://github.com/UnrealSolutionsLtd/VulkanMediaPlayer.git
   ```

2. **Or Download as ZIP**
   - Go to the [GitHub repository](https://github.com/UnrealSolutionsLtd/VulkanMediaPlayer)
   - Click **Code** → **Download ZIP**
   - Extract to your project's Plugins folder

3. **Expected Folder Structure**
   ```
   YourProject/
   └── Plugins/
       └── VulkanMediaPlayer/
           ├── Source/
           ├── Resources/
           ├── Content/
           └── VulkanMediaPlayer.uplugin
   ```

2. **Regenerate Project Files**
   - Right-click your `.uproject` file
   - Select **Generate Visual Studio project files** (Windows) or equivalent

## Configuration

### Enable Vulkan RHI

Vulkan Media Player requires Vulkan RHI to be enabled:

#### Project Settings

1. Open **Edit** → **Project Settings**
2. Navigate to **Platforms** → **Linux** (or your target platform)
3. Under **Targeted RHIs**, ensure **Vulkan** is added
4. Set as default RHI if needed

#### Command Line (for testing)

Launch your game with Vulkan RHI:

```bash
# Linux
./YourGame.sh -vulkan

# Windows
YourGame.exe -vulkan
```

### Verify Installation

To verify the plugin is installed correctly:

1. **Check Plugin List**
   - Open **Edit** → **Plugins**
   - Search for "Vulkan Media Player"
   - Verify it shows as **Enabled**

2. **Check Output Log**
   - Open **Window** → **Developer Tools** → **Output Log**
   - Look for: `LogVulkanMediaPlayerModule: VulkanMediaPlayer module starting up`

3. **Test Media Source**
   - Create a new **Media Player** asset
   - Create a **Media Source** (File Media Source)
   - Try opening a video file
   - Vulkan Media Player should appear as an available player

## Troubleshooting

### Plugin Won't Enable

**Issue**: Plugin checkbox is grayed out or shows an error

**Solutions**:
- Ensure you're using Unreal Engine 5.0 or later
- Verify your platform is supported (Win64, Linux, LinuxARM64)
- Check the Output Log for specific error messages
- Rebuild the plugin from source if using manual installation

### Vulkan RHI Not Available

**Issue**: Vulkan option not showing in Project Settings

**Solutions**:
- Install latest GPU drivers
- Install Vulkan SDK
- Verify GPU supports Vulkan 1.3+
- On Linux, install `vulkan-tools` and `mesa-vulkan-drivers`

### Module Compilation Errors

**Issue**: Plugin fails to compile

**Solutions**:
- Ensure you have a valid C++ development environment
- Update to latest Unreal Engine patch version
- Clean intermediate files: Delete `Intermediate/` and `Binaries/` folders, then rebuild
- Check that all dependencies are installed

### No Hardware Acceleration

**Issue**: Videos play but CPU usage is high

**Solutions**:
- Verify Vulkan Video extension is supported (run `vulkaninfo`)
- Update GPU drivers to the latest version
- Check that Vulkan RHI is actually being used (check Output Log)
- Some older GPUs may not support Vulkan Video decode

## Platform-Specific Notes

### Linux
- Ensure you have the correct Vulkan loader installed
- AMD users: Use Mesa 23.0+ or latest AMDVLK drivers
- NVIDIA users: Use proprietary drivers version 525+ for best support

### Windows
- Windows 11 generally has better Vulkan support
- Ensure Windows Media Feature Pack is installed
- Some antivirus software may interfere with Vulkan - add exceptions if needed

## Next Steps

Now that Vulkan Media Player is installed:

1. [Follow the Quick Start guide](./quick-start) to play your first video
2. Learn about [Video Playback features](./features/video-playback)
3. Join our [Discord community](https://discord.com/invite/pBDSCBcdgv) for support

## Getting Help

If you encounter issues:

- 💬 Join our [Discord](https://discord.com/invite/pBDSCBcdgv) for community support
- Email support: business@unrealsolutions.com
- Check the [GitHub repository](https://github.com/UnrealSolutionsLtd/VulkanMediaPlayer) for updates and issues

---

*Having trouble? Our community is here to help! Join our Discord server.*

