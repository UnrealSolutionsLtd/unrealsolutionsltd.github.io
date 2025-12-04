# Audio Support

Vulkan Media Player provides comprehensive audio playback capabilities synchronized with video. Learn how to work with audio tracks and integrate them into your Unreal Engine project.

## Overview

Audio support in Vulkan Media Player includes:
- ✅ Synchronized audio/video playback
- ✅ Multiple audio track support
- ✅ Integration with Unreal's audio system
- ✅ Audio submix support
- ✅ Volume and mute controls

## Basic Audio Setup

### Enabling Audio Output

When creating a Media Player:

1. Right-click in **Content Browser**
2. Select **Media** → **Media Player**
3. In the dialog:
   - ✅ Check **Audio output Sound Wave asset**
4. Click **OK**

This creates a Sound Wave asset (e.g., `MP_MyVideo_Audio`) that routes audio through Unreal's audio engine.

### Playing Audio

Audio automatically plays when video playback starts:

```cpp
// C++ - Open media source (audio plays automatically)
MediaPlayer->OpenSource(MediaSource);
MediaPlayer->Play();
```

**Blueprint:**
- Use **Open Source** and **Play** nodes - audio plays automatically

## Audio Control

### Volume Control

```cpp
// Set volume (0.0 = silent, 1.0 = full volume)
MediaPlayer->SetVolume(0.5f);

// Get current volume
float Volume = MediaPlayer->GetVolume();

// Fade in audio
float CurrentVolume = 0.0f;
// In Tick or Timer:
CurrentVolume = FMath::Clamp(CurrentVolume + DeltaTime * 0.5f, 0.0f, 1.0f);
MediaPlayer->SetVolume(CurrentVolume);
```

**Blueprint:**
- Use **Set Volume** node on Media Player reference
- Value range: 0.0 to 1.0

### Mute/Unmute

```cpp
// Mute audio
MediaPlayer->SetVolume(0.0f);

// Or use native mute if available
// Check IMediaPlayer interface implementation
```

**Blueprint Alternative:**
```
Set Volume → 0.0  // Mute
Set Volume → 1.0  // Unmute
```

## Multiple Audio Tracks

Some media files contain multiple audio tracks (e.g., different languages).

### Detecting Audio Tracks

```cpp
// Get number of audio tracks
int32 NumAudioTracks = MediaPlayer->GetNumTracks(EMediaPlayerTrack::Audio);

// Get audio track information
for (int32 i = 0; i < NumAudioTracks; i++)
{
    FText DisplayName = MediaPlayer->GetTrackDisplayName(EMediaPlayerTrack::Audio, i);
    FString Language = MediaPlayer->GetTrackLanguage(EMediaPlayerTrack::Audio, i);
    
    UE_LOG(LogTemp, Log, TEXT("Audio Track %d: %s (%s)"), 
           i, *DisplayName.ToString(), *Language);
}
```

### Selecting Audio Track

```cpp
// Select specific audio track by index
MediaPlayer->SelectTrack(EMediaPlayerTrack::Audio, 1); // Select track 1

// Get currently selected track
int32 CurrentTrack = MediaPlayer->GetSelectedTrack(EMediaPlayerTrack::Audio);
```

**Blueprint:**
- Use **Select Track** node
- Type: **Audio**
- Index: track number (0-based)

## Audio Synchronization

### Check Audio/Video Sync

Vulkan Media Player automatically synchronizes audio with video. To verify:

```cpp
// Get video playback time
FTimespan VideoTime = MediaPlayer->GetTime();

// Audio is automatically synchronized to this time
```

### Handle Sync Issues

If audio drifts out of sync:

1. **Check frame rate:** Ensure video frame rate is consistent
2. **Check codec:** Some codecs have better sync support
3. **Driver update:** Update GPU drivers to latest version

## Audio Output Routing

### Using Sound Wave Asset

The Sound Wave asset created with Media Player automatically routes audio through Unreal's audio engine:

```cpp
// Get the Sound Wave asset
USoundWave* SoundWave = MediaPlayer->GetAudioComponent()->Sound;

// Apply audio effects, attenuation, etc. through standard Unreal audio system
```

### Spatial Audio

To enable 3D spatial audio:

1. Add a **Media Sound Component** to an Actor
2. Set the Media Player reference
3. Enable **Spatialization** in the component settings
4. Position the Actor in 3D space

```cpp
// C++ - Create and configure Media Sound Component
UMediaSoundComponent* MediaSoundComponent = CreateDefaultSubobject<UMediaSoundComponent>(TEXT("MediaSound"));
MediaSoundComponent->SetMediaPlayer(MediaPlayer);
MediaSoundComponent->bIsUISound = false; // Enable spatialization
```

## Audio Formats

### Supported Audio Codecs

| Codec | Support | Notes |
|-------|---------|-------|
| AAC | ✅ Recommended | Best compatibility |
| MP3 | ✅ Supported | Common format |
| Opus | ⚠️ Limited | Container-dependent |
| Vorbis | ⚠️ Limited | Mainly in WebM/OGG |

### Recommended Settings

For best compatibility:
- **Codec**: AAC
- **Sample Rate**: 48000 Hz
- **Channels**: Stereo (2 channels)
- **Bitrate**: 192 kbps or higher

## Advanced Audio Features

### Audio Submix Integration

Route media audio through Unreal's submix system:

```cpp
// C++ - Route to specific submix
UMediaSoundComponent* MediaSound = GetMediaSoundComponent();
if (MediaSound)
{
    MediaSound->SoundSubmixObject = MySubmix;
}
```

**Use Cases:**
- Apply audio effects (reverb, EQ)
- Mix with game audio
- Master volume control
- Audio ducking

### Audio Callbacks

Monitor audio state:

```cpp
// Listen for audio track changes
MediaPlayer->OnTracksChanged.AddDynamic(this, &AMyActor::OnTracksChanged);

void AMyActor::OnTracksChanged()
{
    // Refresh audio track list
    UpdateAudioTrackUI();
}
```

## Troubleshooting

### No Audio Output

**Check List:**
1. ✅ "Audio output Sound Wave asset" was checked when creating Media Player
2. ✅ Volume is not 0 (check with `GetVolume()`)
3. ✅ Audio track exists in media file
4. ✅ Media Player is playing (not paused)

**Common Issues:**

**Issue:** Audio plays in editor but not in packaged game

**Solution:**
- Ensure media files are included in package
- Check audio codec is supported on target platform

**Issue:** Audio is crackling or distorted

**Solutions:**
- Check source audio bitrate (should be 192kbps+)
- Update GPU/audio drivers
- Reduce other audio processing load

**Issue:** Audio/video out of sync

**Solutions:**
- Re-encode video with proper audio sync
- Use constant frame rate video
- Check system performance (CPU/GPU load)

### Audio Track Selection Not Working

**Possible Cause:** Media file doesn't contain multiple tracks

**Verify:**
```bash
# Use ffprobe to check audio tracks
ffprobe -v error -show_entries stream=index,codec_type,codec_name -of json input.mp4
```

## Examples

### Simple Audio Control UI

**Blueprint Example:**

1. **Volume Slider:**
   - Add Slider widget (0.0 to 1.0)
   - On Value Changed → Set Volume (Media Player)

2. **Mute Button:**
   - On Clicked → Branch (Is Muted?)
     - True → Set Volume(1.0)
     - False → Set Volume(0.0)

3. **Track Selector:**
   - Populate ComboBox with track names
   - On Selection Changed → Select Track

### Audio Fade In/Out

```cpp
// Fade In (in Tick function)
void AMyActor::Tick(float DeltaTime)
{
    if (bFadingIn)
    {
        CurrentVolume = FMath::Clamp(CurrentVolume + DeltaTime * FadeSpeed, 0.0f, 1.0f);
        MediaPlayer->SetVolume(CurrentVolume);
        
        if (CurrentVolume >= 1.0f)
        {
            bFadingIn = false;
        }
    }
}

// Start fade
void AMyActor::FadeIn()
{
    CurrentVolume = 0.0f;
    bFadingIn = true;
    MediaPlayer->SetVolume(0.0f);
    MediaPlayer->Play();
}
```

## Best Practices

1. **Always check audio track availability** before selecting
2. **Test on target platform** - codec support varies
3. **Use AAC codec** for best compatibility
4. **Monitor volume levels** - avoid clipping
5. **Implement fade in/out** for smooth transitions

## Next Steps

- Optimize [Performance](./performance) for audio/video playback
- Learn about [Video Playback](./video-playback) features
- Join our [Discord](https://discord.com/invite/pBDSCBcdgv) for audio tips

---

*Need help with audio? Our [Discord community](https://discord.com/invite/pBDSCBcdgv) is here to help!*

