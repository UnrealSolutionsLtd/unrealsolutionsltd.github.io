# Quick Start Guide

Get up and running with Vulkan Media Player in under 5 minutes! This guide will walk you through playing your first video in Unreal Engine.

## Prerequisites

Before starting, make sure you have:
- ✅ Vulkan Media Player plugin [installed and enabled](./installation)
- ✅ Vulkan RHI enabled in your project
- ✅ A video file to test (MP4 with H.264 codec recommended)

## Step 1: Create Media Assets

### 1.1 Create a Media Player

1. In the **Content Browser**, right-click in any folder
2. Select **Media** → **Media Player**
3. In the dialog:
   - ✅ Check **Video output Media Texture asset**
   - ✅ Check **Audio output Sound Wave asset** (optional)
4. Name it `MP_MyVideo` and click **OK**

This creates two assets:
- `MP_MyVideo` - The Media Player
- `MP_MyVideo_Video` - The Media Texture

### 1.2 Create a File Media Source

1. Right-click in the **Content Browser**
2. Select **Media** → **File Media Source**
3. Name it `MS_MyVideo`
4. Double-click to open it
5. Click the **...** button next to **File Path**
6. Browse to your video file (e.g., `Content/Movies/MyVideo.mp4`)
7. Click **Save**

::: warning Codec Requirement
**Only H.264 is supported:**
- **Container**: MP4 (recommended) or MKV
- **Video Codec**: H.264 (AVC) - **Required**
- **Audio Codec**: AAC (recommended)

Videos with other codecs (H.265, VP9, etc.) will not play.
:::

## Step 2: Create a Material

Now we'll create a material to display the video:

1. Right-click in **Content Browser**
2. Select **Material**
3. Name it `M_Video`
4. Double-click to open the Material Editor

### Configure the Material

1. In the **Details** panel, set:
   - **Material Domain**: Surface
   - **Blend Mode**: Opaque
   
2. Drag the `MP_MyVideo_Video` Media Texture from Content Browser into the material graph

3. Connect the texture:
   - **RGB** output → **Emissive Color** input

4. Click **Save** and close the Material Editor

::: tip Why Emissive?
Using Emissive Color ensures the video displays at full brightness without being affected by scene lighting.
:::

## Step 3: Place a Video Screen in Your Level

### 3.1 Add a Plane

1. In the **Place Actors** panel, search for **Plane**
2. Drag a **Plane** into your level
3. In the **Details** panel:
   - Set **Scale**: X=4, Y=0.1, Z=2.25 (for 16:9 aspect ratio)
   - Rotate if needed to face your camera

### 3.2 Apply the Video Material

1. Select the Plane
2. In the **Details** panel, find **Materials**
3. Set **Element 0** to your `M_Video` material

## Step 4: Play the Video

### 4.1 Blueprint Setup

We'll use Level Blueprint to control playback:

1. Click **Blueprints** → **Open Level Blueprint**
2. Add the following nodes:

```
Event BeginPlay
  ↓
Get Player Controller
  ↓
Create Media Source (File Media Source) [MS_MyVideo]
  ↓
Open Source (Media Player) [MP_MyVideo]
```

**Detailed Steps:**

1. Right-click and add **Event BeginPlay**
2. Right-click and search for your Media Player: `MP_MyVideo`
3. From the variable, drag out and select **Open Source**
4. Right-click on **Media Source** pin and select **Promote to Variable**
5. In the Details panel, set **Default Value** to `MS_MyVideo`
6. Connect **Event BeginPlay** → **Open Source**

### 4.2 Test the Setup

1. Click **Compile** and **Save** in the Blueprint
2. Close the Blueprint Editor
3. Click **Play** in the editor

You should see your video playing on the plane! 🎉

## Step 5: Add Playback Controls (Optional)

Let's add some basic controls:

### Play/Pause with Keyboard

In your Level Blueprint:

```
Event InputKey (Space)
  ↓
Branch (Is Playing?)
  True → Pause [MP_MyVideo]
  False → Play [MP_MyVideo]
```

**Implementation:**

1. Add **InputKey Space** event
2. Add **Is Playing** function (from Media Player reference)
3. Add **Branch** node
4. Connect:
   - **Is Playing** → **Condition**
   - **True** → **Pause** node
   - **False** → **Play** node

## Common Use Cases

### Loop Video Continuously

1. Open your Media Player asset (`MP_MyVideo`)
2. In the **Details** panel:
   - ✅ Check **Loop**
3. Save the asset

### Auto-Play on Level Start

Already set up in Step 4.1! The video starts playing when the level begins.

### Play Video on Trigger

Replace **Event BeginPlay** with **Event Begin Overlap** on a trigger volume:

1. Add a **Box Trigger** to your level
2. In the Level Blueprint:
   - Add **Event ActorBeginOverlap** (Box Trigger)
   - Connect to **Open Source** as before

## Troubleshooting

### Video Doesn't Play

1. **Check the Output Log** (`Window` → `Developer Tools` → `Output Log`)
2. Look for errors related to:
   - `LogVulkanMediaPlayer`: Plugin-specific messages
   - `LogMedia`: General media framework messages

**Common Issues:**

- ❌ **"Failed to open media source"**
  - Verify file path is correct
  - **Check video is H.264 encoded** (only supported codec)
  - Ensure file is not corrupted
  - Re-encode with ffmpeg if needed (see Performance guide)

- ❌ **Video plays but screen is black**
  - Check material is using Emissive Color
  - Verify Media Texture is connected correctly
  - Ensure Media Player has Video Output texture assigned

- ❌ **No hardware acceleration**
  - Run `vulkaninfo | grep -i video` to verify support
  - Update GPU drivers
  - Check Vulkan RHI is enabled

### Performance Issues

- Lower video resolution (1920x1080 or lower recommended)
- Ensure video is H.264 encoded (only supported codec)
- Ensure Vulkan RHI is active (check Project Settings)

## Next Steps

Now that you have basic video playback working:

- 📚 Learn about [Advanced Video Playback](./features/video-playback)
- 🎵 Explore [Audio Support](./features/audio-support) features
- ⚡ Optimize [Performance](./features/performance)

## Example Project

Want a ready-to-use example? Check out our sample project:

- Download from [FAB Marketplace](https://www.fab.com/listings/a883f9ac-b253-487b-b5ab-d612b660e41b)
- Includes example levels, materials, and blueprints

## Need Help?

- 💬 Join our [Discord community](https://discord.com/invite/pBDSCBcdgv)
- 📧 Email: business@unrealsolutions.com
- 🌐 Visit: [unrealsolutions.com](https://unrealsolutions.com)

---

**Congratulations! You've successfully set up video playback with Vulkan Media Player!** 🎉

