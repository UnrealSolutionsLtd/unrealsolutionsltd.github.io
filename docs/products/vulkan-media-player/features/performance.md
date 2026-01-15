# Performance Optimization

Learn how to maximize performance and minimize resource usage when using Vulkan Media Player in your Unreal Engine projects.

## Hardware Acceleration

### Vulkan Video Decode

Vulkan Media Player leverages the **Vulkan Video extension** for hardware-accelerated video decoding. This provides:

- **Lower CPU Usage**: Video decoding happens on GPU
- **Better Battery Life**: Especially important for mobile/laptop
- **Higher Resolution Support**: GPU can handle higher resolutions efficiently
- **Reduced Heat**: Less CPU load = less heat generation

::: tip Verify Hardware Support
Before optimizing, ensure your system supports Vulkan Video. See the [Installation Guide](../installation#verification-check-vulkan-video-support) for verification steps.
:::

## Performance Best Practices

### 1. Video Resolution

Choose appropriate resolution for your use case:

| Resolution | Use Case | GPU Load |
|------------|----------|----------|
| 1280x720 (720p) | UI elements, backgrounds | Low |
| 1920x1080 (1080p) | Main content, cutscenes | Medium |
| 2560x1440 (1440p) | High-quality displays | High |
| 3840x2160 (4K) | Premium content only | Very High |

::: tip Resolution Guidelines
- **In-game UI**: 720p is usually sufficient
- **Cutscenes**: 1080p balances quality and performance
- **VR**: Use 1080p per eye maximum
- **4K content**: Only if target hardware is high-end
:::

### 2. Video Encoding Settings

Optimize your source videos for best playback performance:

**Recommended FFmpeg Settings:**

```bash
# H.264 - Only Supported Codec
ffmpeg -i input.mp4 -c:v libx264 \
  -preset medium \
  -profile:v high -level 4.1 \
  -crf 23 \
  -g 30 -keyint_min 30 \
  -c:a aac -b:a 192k \
  output.mp4
```

::: warning Codec Requirement
**Only H.264 is supported.** Do not use H.265, VP9, or other codecs as they will not play.
:::

**Key Parameters:**
- `-g 30`: Keyframe every 30 frames (enables fast seeking)
- `-crf 23`: Quality level (lower = better quality, 18-28 recommended)
- `-preset medium`: Encoding speed/efficiency balance
- `-b:a 192k`: Audio bitrate

### 3. Bitrate Optimization

| Resolution | Recommended Bitrate | Use Case |
|------------|-------------------|-----------|
| 720p | 2.5-5 Mbps | Standard quality |
| 1080p | 5-10 Mbps | High quality |
| 1440p | 10-20 Mbps | Premium quality |
| 4K | 20-40 Mbps | Ultra quality |

Lower bitrates = smaller files and less bandwidth, but watch for quality degradation.

### 4. Texture Format

The Media Texture automatically handles format conversion. For best performance:

```cpp
// Let the plugin handle texture format automatically
// No manual configuration needed in most cases
```

If you need specific control:
1. Open Media Texture asset
2. In **Details** panel:
   - **Compression Settings**: UserInterface2D or Default
   - **Mip Gen Settings**: NoMipmaps
   - **Texture Group**: UI (for interface elements)

## Memory Management

### Video Memory Usage

Approximate VRAM usage:

| Resolution | Format | VRAM per Frame |
|------------|--------|----------------|
| 1280x720 | RGB | ~2.6 MB |
| 1920x1080 | RGB | ~6 MB |
| 2560x1440 | RGB | ~11 MB |
| 3840x2160 | RGB | ~24 MB |

**Note:** Hardware decoder typically buffers 2-4 frames.

### Reducing Memory Footprint

1. **Lower Resolution**: Most effective method
2. **Close Unused Media Players**: Release resources when not needed
3. **Limit Concurrent Playback**: Avoid playing multiple videos simultaneously

```cpp
// Close media player when done
MediaPlayer->Close();

// For multiple videos, reuse same Media Player
MediaPlayer->OpenSource(NewMediaSource); // Closes previous automatically
```

## CPU Performance

### Benchmarking

Monitor CPU usage:

```cpp
// Use Unreal's profiling tools
// stat fps      - Frame rate
// stat unit     - Frame time breakdown
// stat media    - Media system stats
```

Console commands:
```
stat fps
stat unit
stat media
```

### Reducing CPU Load

1. **Enable Hardware Decoding**: Ensure Vulkan Video is active
2. **Use H.264 Codec**: The only supported codec (best hardware support)
3. **Reduce Concurrent Streams**: Limit to 1-2 videos playing at once
4. **Use Appropriate Thread Priority**: Default settings usually optimal

## GPU Performance

### Monitoring

Use Unreal's GPU profiler:

```
stat gpu
profilegpu
```

### Optimization Tips

1. **Material Complexity**: Keep video materials simple
   ```
   // Good: Direct texture to Emissive
   MediaTexture → Emissive Color
   
   // Avoid: Complex shader operations on video texture
   ```

2. **Overdraw**: Minimize overlapping video textures
3. **Resolution Matching**: Match video resolution to display size

## Platform-Specific Optimization

### Linux

**Driver Selection:**
- **Mesa (Open Source)**: Good for AMD/Intel, version 23.0+ recommended
- **NVIDIA Proprietary**: Version 525+ for best Vulkan Video support
- **AMDVLK**: Consider for AMD GPUs

**Performance Tips:**
```bash
# Force Vulkan RHI
./YourGame.sh -vulkan

# Disable VSync for profiling
./YourGame.sh -vulkan -novsync
```

### Windows

**Best Practices:**
- Use latest GPU drivers (updated within last 3 months)
- Enable "Hardware-accelerated GPU scheduling" in Windows Settings
- Close unnecessary background applications

### Steam Deck / Linux Gaming Handhelds

Optimizations for portable devices:
- Max resolution: 1280x800 (native display)
- Use H.264 (only supported codec)
- Bitrate: 3-5 Mbps maximum
- Consider power profile impact

## Profiling and Debugging

### Performance Profiling

**In Editor:**
1. Play in Editor (PIE)
2. Open console (`~` key)
3. Type: `stat media`
4. Monitor:
   - Decode time
   - Frame drops
   - Buffer usage

**Packaged Build:**
```bash
# Launch with profiling enabled
YourGame.exe -vulkan -messaging
```

### Common Performance Issues

#### Issue: High CPU Usage

**Diagnosis:**
```
stat unit
stat media
```

**Solutions:**
1. Verify hardware acceleration is active
2. Lower video resolution
3. Ensure video is encoded with H.264
4. Update GPU drivers

#### Issue: Frame Drops

**Diagnosis:** Check for:
- Disk I/O bottleneck (slow HDD)
- Network latency (if streaming)
- Insufficient GPU memory

**Solutions:**
1. Move video files to SSD
2. Reduce video resolution/bitrate
3. Pre-buffer content
4. Close other GPU-intensive processes

#### Issue: Stuttering Playback

**Common Causes:**
- Missing keyframes in video
- Disk seek times
- GPU memory pressure

**Solutions:**
```bash
# Re-encode with regular keyframes
ffmpeg -i input.mp4 -g 30 -keyint_min 30 output.mp4

# Check disk speed
# Linux: hdparm -t /dev/sda
# Windows: Use CrystalDiskMark
```

## Benchmarking Guidelines

### Testing Methodology

1. **Baseline Test**:
   - Run without video playback
   - Note FPS and frame times

2. **Single Video Test**:
   - Play one video at target resolution
   - Compare to baseline

3. **Multiple Video Test**:
   - Play maximum concurrent videos expected
   - Monitor performance degradation

4. **Stress Test**:
   - Maximum resolution
   - Multiple videos
   - Other game systems active

### Performance Targets

| Platform | Target FPS | Max Frame Time |
|----------|-----------|----------------|
| PC (Desktop) | 60 FPS | 16.6 ms |
| Laptop | 30-60 FPS | 33.3-16.6 ms |
| Steam Deck | 30-40 FPS | 33.3-25 ms |

## Performance Checklist

Before shipping:

- [ ] Tested on minimum spec hardware
- [ ] Verified hardware acceleration is active
- [ ] Optimized video resolution for target platform
- [ ] Tested with multiple concurrent videos (if applicable)
- [ ] Profiled worst-case scenarios
- [ ] Verified frame rate meets target
- [ ] Tested on both NVIDIA and AMD GPUs
- [ ] Validated on target OS (Linux/Windows)
- [ ] Checked memory usage under load
- [ ] Tested video seeking performance

## Next Steps

- Review [Video Playback](./video-playback) features
- Check [Audio Support](./audio-support) for audio optimization
- Join [Discord](https://discord.com/invite/pBDSCBcdgv) for performance tips from the community

## Getting Help

Performance issues? We can help!

- 💬 [Discord Community](https://discord.com/invite/pBDSCBcdgv)
- 📧 Email: business@unrealsolutions.com
- 🌐 Website: [unrealsolutions.com](https://unrealsolutions.com)

---

*Optimize smart, ship fast! Join our [Discord](https://discord.com/invite/pBDSCBcdgv) for more tips!*

