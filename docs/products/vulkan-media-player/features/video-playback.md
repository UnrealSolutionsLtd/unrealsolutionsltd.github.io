# Video Playback Features

Learn about the advanced video playback capabilities of Vulkan Media Player and how to use them effectively in your Unreal Engine projects.

## Supported Video Formats

### Video Codecs

Vulkan Media Player currently supports:

| Codec | Status | Notes |
|-------|--------|-------|
| **H.264 (AVC)** | ✅ Fully Supported | Hardware-accelerated via Vulkan Video |

::: info H.265 and Other Codecs
Support for additional codecs (H.265/HEVC, VP9, AV1) is planned for future releases. Currently, only H.264 is supported.
:::

### Container Formats

| Format | Extension | Support |
|--------|-----------|---------|
| MP4 | `.mp4` | ✅ Recommended |
| MKV | `.mkv` | ✅ Supported |
| WebM | `.webm` | ⚠️ Limited |

::: tip Best Practices
For optimal playback with Vulkan Media Player:
- **Codec**: H.264 (AVC) - the only supported codec
- **Container**: MP4 (recommended) or MKV
- **Resolution**: 1920x1080 or lower
- **Bitrate**: 5-10 Mbps for high quality
- **Profile**: High Profile, Level 4.1
:::

## Playback Control

### Basic Playback Operations

#### Opening Media

```cpp
// C++ Example
UMediaPlayer* MediaPlayer = GetMediaPlayer();
UFileMediaSource* MediaSource = NewObject<UFileMediaSource>();
MediaSource->FilePath = TEXT("Content/Movies/MyVideo.mp4");
MediaPlayer->OpenSource(MediaSource);
```

**Blueprint Equivalent:**
- Use **Open Source** node with your Media Player and File Media Source

#### Play/Pause

```cpp
// Play
MediaPlayer->Play();

// Pause
MediaPlayer->Pause();

// Toggle
if (MediaPlayer->IsPlaying())
{
    MediaPlayer->Pause();
}
else
{
    MediaPlayer->Play();
}
```

#### Stop and Close

```cpp
// Stop playback (can resume with Play())
MediaPlayer->Close();

// Completely release media resources
MediaPlayer->Close();
```

### Advanced Playback Control

#### Seeking

```cpp
// Seek to specific time (in seconds)
FTimespan SeekTime = FTimespan::FromSeconds(30.0);
MediaPlayer->Seek(SeekTime);

// Seek to percentage
float Percentage = 0.5f; // 50%
FTimespan Duration = MediaPlayer->GetDuration();
FTimespan SeekTime = Duration * Percentage;
MediaPlayer->Seek(SeekTime);
```

#### Playback Rate

```cpp
// Normal speed
MediaPlayer->SetRate(1.0f);

// Slow motion (50%)
MediaPlayer->SetRate(0.5f);

// Fast forward (2x)
MediaPlayer->SetRate(2.0f);

// Reverse playback (if supported)
MediaPlayer->SetRate(-1.0f);
```

::: warning Rate Limitations
Not all video codecs and GPUs support variable playback rates. Test thoroughly on target hardware.
:::

#### Looping

```cpp
// Enable looping
MediaPlayer->SetLooping(true);

// Disable looping
MediaPlayer->SetLooping(false);
```

**Blueprint:**
- Enable **Loop** checkbox in Media Player asset properties

## Playback States

### Monitoring Playback State

```cpp
// Check if media is currently playing
bool bIsPlaying = MediaPlayer->IsPlaying();

// Check if media is paused
bool bIsPaused = MediaPlayer->IsPaused();

// Check if media is buffering
bool bIsBuffering = MediaPlayer->IsBuffering();

// Check if media is ready to play
bool bIsReady = MediaPlayer->IsReady();

// Get current playback time
FTimespan CurrentTime = MediaPlayer->GetTime();

// Get total duration
FTimespan Duration = MediaPlayer->GetDuration();
```

### Playback Events

Subscribe to media player events:

```cpp
// On media opened successfully
MediaPlayer->OnMediaOpened.AddDynamic(this, &AMyActor::OnMediaOpened);

// On media playback started
MediaPlayer->OnPlaybackStarted.AddDynamic(this, &AMyActor::OnPlaybackStarted);

// On media reached end
MediaPlayer->OnEndReached.AddDynamic(this, &AMyActor::OnEndReached);

// On playback error
MediaPlayer->OnMediaOpenFailed.AddDynamic(this, &AMyActor::OnMediaOpenFailed);
```

**Blueprint:**
- Use the **Event Graph** to bind to media player events

## Display Options

### Texture Output

#### Creating Media Texture

Media textures are automatically created when you create a Media Player asset, or you can create them manually:

1. Right-click in Content Browser
2. Select **Media** → **Media Texture**
3. Set the **Media Player** property to your Media Player asset

#### Material Setup

**Basic Material:**
```
MediaTexture → Emissive Color
```

**With Aspect Ratio Correction:**
```
MediaTexture → TextureSample
  ↓
Multiply (RGB) → Emissive Color
```

### Video Dimensions

```cpp
// Get video dimensions
FIntPoint Dimensions = MediaPlayer->GetVideoTrackDimensions(INDEX_NONE, INDEX_NONE);
int32 Width = Dimensions.X;
int32 Height = Dimensions.Y;

// Get aspect ratio
float AspectRatio = (float)Width / (float)Height;
```

## Performance Optimization

### Hardware Acceleration

Vulkan Media Player automatically uses hardware acceleration when available. To verify:

```cpp
// Check if hardware acceleration is active
// (Implementation-specific - check Output Log)
```

### Best Practices

1. **Resolution**
   - Use 1920x1080 or lower for best performance
   - Higher resolutions require more GPU memory and bandwidth

2. **Bitrate**
   - Balance quality and file size
   - Recommended: 5-10 Mbps for 1080p

3. **Codec Selection**
   - Use H.264 (only supported codec)
   - Ensure videos are properly encoded with H.264

4. **Texture Format**
   - Default settings usually work best
   - Avoid manual texture format changes unless necessary

## Streaming Video

### Local File Streaming

```cpp
// Open large video file for streaming
UFileMediaSource* MediaSource = NewObject<UFileMediaSource>();
MediaSource->FilePath = TEXT("Content/Movies/LargeVideo.mp4");
MediaPlayer->OpenSource(MediaSource);
```

The plugin automatically handles buffering for smooth playback.

### Network Streaming

::: warning Experimental
Network streaming support is experimental. Test thoroughly for your use case.
:::

## Troubleshooting

### Video Plays But Performance is Poor

**Possible Causes:**
1. Hardware acceleration not working
2. Video resolution too high
3. Codec not hardware-supported

**Solutions:**
- Check `vulkaninfo` output for codec support
- Reduce video resolution
- Update GPU drivers
- Verify Vulkan RHI is enabled

### Seeking is Slow or Inaccurate

**Cause:** Video file doesn't have proper keyframe intervals

**Solution:** Re-encode video with regular keyframes:
```bash
ffmpeg -i input.mp4 -c:v libx264 -g 30 -keyint_min 30 output.mp4
```

### Video Freezes or Stutters

**Possible Causes:**
1. File I/O bottleneck
2. Insufficient GPU memory
3. Driver issues

**Solutions:**
- Move video file to SSD
- Reduce video resolution
- Update GPU drivers
- Close other GPU-intensive applications

## Next Steps

- Learn about [Audio Support](./audio-support)
- Optimize [Performance](./performance) for your specific use case
- Join our [Discord community](https://discord.com/invite/pBDSCBcdgv) for tips and tricks

---

*Need help? Join our [Discord community](https://discord.com/invite/pBDSCBcdgv) for support!*

