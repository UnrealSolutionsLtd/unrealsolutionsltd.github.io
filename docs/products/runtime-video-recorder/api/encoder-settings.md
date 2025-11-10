# FRuntimeEncoderSettings

Configuration structure for video encoding parameters.

## Structure Definition

```cpp
USTRUCT(BlueprintType)
struct FRuntimeEncoderSettings
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 VideoBitrate = 20000000;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    ERuntimeEncoderProfile Profile = ERuntimeEncoderProfile::Profile_Main;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    ERuntimeEncoderRCMode RCMode = ERuntimeEncoderRCMode::RC_Quality;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 TargetQuality = 50;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 WIN_QualityVsSpeed = 50;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    bool WIN_bUseLowLatencyEncoding = false;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 KEYFRAME_INTERVAL = 30;
};
```

---

## Properties

### VideoBitrate

Output video bitrate in bits per second.

**Type:** `int32`  
**Default:** `20000000` (20 Mbps)

**Recommended Values:**
- **720p (1280×720):** 5,000,000 - 10,000,000 (5-10 Mbps)
- **1080p (1920×1080):** 10,000,000 - 20,000,000 (10-20 Mbps)
- **1440p (2560×1440):** 20,000,000 - 40,000,000 (20-40 Mbps)
- **4K (3840×2160):** 40,000,000 - 80,000,000 (40-80 Mbps)

::: tip
Higher bitrate = better quality but larger file size. Use `RC_Quality` mode for better quality-to-size ratio.
:::

#### Example
```cpp
FRuntimeEncoderSettings Settings;
Settings.VideoBitrate = 30000000;  // 30 Mbps for high-quality 1080p
```

---

### Profile

H.264 encoder profile.

**Type:** `ERuntimeEncoderProfile`  
**Default:** `Profile_Main`

**Options:**
- **`Profile_Baseline`** - Maximum compatibility, lowest quality
- **`Profile_Main`** - Good balance (recommended)
- **`Profile_High`** - Best quality, requires modern devices

::: warning Compatibility
`Profile_High` may not be compatible with older mobile devices or some web players. Use `Profile_Main` for maximum compatibility.
:::

#### Example
```cpp
Settings.Profile = ERuntimeEncoderProfile::Profile_High;  // Best quality
```

---

### RCMode

Rate control mode.

**Type:** `ERuntimeEncoderRCMode`  
**Default:** `RC_Quality`

**Options:**
- **`RC_Bitrate`** - Constant bitrate (predictable file sizes)
- **`RC_Quality`** - Variable bitrate (better quality per file size)

**When to Use:**
- Use **`RC_Bitrate`** for consistent file sizes, streaming
- Use **`RC_Quality`** for best quality recordings (recommended)

#### Example
```cpp
Settings.RCMode = ERuntimeEncoderRCMode::RC_Quality;  // Variable bitrate
```

---

### TargetQuality

Encoding quality target (0-100).

**Type:** `int32`  
**Default:** `50`  
**Range:** `0` (lowest) to `100` (highest)

**Recommended Values:**
- **Low Quality:** 30-40
- **Medium Quality:** 50-60 (default)
- **High Quality:** 70-85
- **Very High Quality:** 90-100

::: info
This setting is most effective when using `RC_Quality` mode. In `RC_Bitrate` mode, the encoder tries to maintain constant bitrate regardless.
:::

#### Example
```cpp
Settings.TargetQuality = 85;  // High quality
```

---

### WIN_QualityVsSpeed

Windows-specific: Trade-off between encoding quality and speed.

**Type:** `int32`  
**Default:** `50`  
**Range:** `0` (fastest) to `100` (best quality)  
**Platform:** Windows only (ignored on other platforms)

**Values:**
- **0-30:** Prioritize speed (faster encoding, lower quality)
- **30-70:** Balanced
- **70-100:** Prioritize quality (slower encoding, better quality)

::: tip Real-Time Recording
For real-time gameplay recording, keep this at 50 or lower. Higher values may cause encoding to fall behind capture rate.
:::

#### Example
```cpp
Settings.WIN_QualityVsSpeed = 30;  // Faster encoding for real-time
```

---

### WIN_bUseLowLatencyEncoding

Windows-specific: Enable low-latency encoding mode.

**Type:** `bool`  
**Default:** `false`  
**Platform:** Windows only

**When to Enable:**
- Real-time communications
- Live streaming
- VR applications requiring minimal latency

**Trade-offs:**
- ✅ Lower encoding latency
- ❌ Potentially reduced quality
- ❌ Slightly larger file sizes

::: warning
Low-latency mode may reduce overall quality. Only enable if latency is critical for your use case.
:::

#### Example
```cpp
Settings.WIN_bUseLowLatencyEncoding = true;  // For VR/live streaming
```

---

### KEYFRAME_INTERVAL

Number of frames between keyframes (I-frames).

**Type:** `int32`  
**Default:** `30`

**Recommended Values:**
- **Low Motion:** 60-120 (smaller files)
- **Normal Gameplay:** 30-60 (balanced)
- **High Motion/Action:** 15-30 (better seeking)
- **Streaming:** 60-120 (better compression)

**What are Keyframes?**
Keyframes are full frames in the video. Frames between keyframes are delta (difference) frames. More frequent keyframes = better seeking ability but larger file size.

#### Example
```cpp
Settings.KEYFRAME_INTERVAL = 60;  // Keyframe every 60 frames (every 2 sec @ 30fps)
```

---

## Preset Configurations

### Low Quality (Small Files)

```cpp
FRuntimeEncoderSettings LowQuality;
LowQuality.VideoBitrate = 5000000;      // 5 Mbps
LowQuality.Profile = ERuntimeEncoderProfile::Profile_Baseline;
LowQuality.RCMode = ERuntimeEncoderRCMode::RC_Bitrate;
LowQuality.TargetQuality = 30;
LowQuality.WIN_QualityVsSpeed = 20;
LowQuality.KEYFRAME_INTERVAL = 60;
```

**Use Case:** Mobile recording, low storage space

---

### Balanced Quality (Recommended)

```cpp
FRuntimeEncoderSettings Balanced;
Balanced.VideoBitrate = 20000000;       // 20 Mbps
Balanced.Profile = ERuntimeEncoderProfile::Profile_Main;
Balanced.RCMode = ERuntimeEncoderRCMode::RC_Quality;
Balanced.TargetQuality = 60;
Balanced.WIN_QualityVsSpeed = 50;
Balanced.KEYFRAME_INTERVAL = 30;
```

**Use Case:** General gameplay recording, good quality-to-size ratio

---

### High Quality (Large Files)

```cpp
FRuntimeEncoderSettings HighQuality;
HighQuality.VideoBitrate = 40000000;    // 40 Mbps
HighQuality.Profile = ERuntimeEncoderProfile::Profile_High;
HighQuality.RCMode = ERuntimeEncoderRCMode::RC_Quality;
HighQuality.TargetQuality = 85;
HighQuality.WIN_QualityVsSpeed = 70;
HighQuality.KEYFRAME_INTERVAL = 30;
```

**Use Case:** Cinematic recordings, trailers, marketing content

---

### Streaming / Live

```cpp
FRuntimeEncoderSettings Streaming;
Streaming.VideoBitrate = 6000000;       // 6 Mbps
Streaming.Profile = ERuntimeEncoderProfile::Profile_Main;
Streaming.RCMode = ERuntimeEncoderRCMode::RC_Bitrate;
Streaming.TargetQuality = 50;
Streaming.WIN_QualityVsSpeed = 30;
Streaming.WIN_bUseLowLatencyEncoding = true;
Streaming.KEYFRAME_INTERVAL = 60;
```

**Use Case:** Live streaming, real-time communications

---

### VR Recording

```cpp
FRuntimeEncoderSettings VR;
VR.VideoBitrate = 30000000;             // 30 Mbps
VR.Profile = ERuntimeEncoderProfile::Profile_High;
VR.RCMode = ERuntimeEncoderRCMode::RC_Quality;
VR.TargetQuality = 75;
VR.WIN_QualityVsSpeed = 40;             // Balance speed for VR
VR.WIN_bUseLowLatencyEncoding = true;   // Reduce latency
VR.KEYFRAME_INTERVAL = 30;
```

**Use Case:** VR gameplay capture, 360° video

---

## Platform Differences

### Windows (WMF)

**Supports:**
- All settings fully supported
- Hardware acceleration (NVIDIA, AMD, Intel)
- `WIN_QualityVsSpeed` and `WIN_bUseLowLatencyEncoding` are Windows-specific

**Recommended:**
```cpp
Settings.VideoBitrate = 20000000;
Settings.Profile = ERuntimeEncoderProfile::Profile_High;
Settings.WIN_QualityVsSpeed = 50;
```

---

### macOS (AVFoundation)

**Supports:**
- All settings except Windows-specific ones
- Hardware acceleration (VideoToolbox)

**Recommended:**
```cpp
Settings.VideoBitrate = 20000000;
Settings.Profile = ERuntimeEncoderProfile::Profile_Main;
```

---

### Android (MediaCodec)

**Supports:**
- Basic settings (bitrate, profile, quality)
- Hardware acceleration (device-dependent)

**Recommended:**
```cpp
Settings.VideoBitrate = 10000000;       // Lower for mobile
Settings.Profile = ERuntimeEncoderProfile::Profile_Main;
Settings.TargetQuality = 60;
```

::: warning Mobile Performance
Use lower bitrates and resolutions on mobile to avoid performance issues.
:::

---

### Linux (OpenH264)

**Supports:**
- Basic settings only
- **Software encoding** (no hardware acceleration)

**Recommended:**
```cpp
Settings.VideoBitrate = 15000000;
Settings.Profile = ERuntimeEncoderProfile::Profile_Baseline;
Settings.TargetQuality = 50;
```

::: info Software Encoding
Linux uses CPU encoding. Expect higher CPU usage. Consider lower resolutions/bitrates.
:::

---

## Calculating File Sizes

**Formula:** `File Size (MB) ≈ (Bitrate / 8) × Duration (seconds) / 1,000,000`

**Examples:**

| Bitrate | Resolution | 1 Minute | 5 Minutes | 10 Minutes |
|---------|------------|----------|-----------|------------|
| 5 Mbps | 720p | ~37 MB | ~187 MB | ~375 MB |
| 10 Mbps | 1080p | ~75 MB | ~375 MB | ~750 MB |
| 20 Mbps | 1080p | ~150 MB | ~750 MB | ~1.5 GB |
| 40 Mbps | 4K | ~300 MB | ~1.5 GB | ~3 GB |

::: tip Storage Planning
1 hour of 1080p@20Mbps ≈ 9 GB. Plan storage accordingly for long recordings!
:::

---

## See Also

- [URuntimeVideoRecorder](./runtime-video-recorder) - Main API reference
- [Quick Start](../quick-start) - Getting started guide
- [How-To Guide](../how-to) - Practical recording scenarios
- [Troubleshooting](../troubleshooting) - Common issues and solutions

