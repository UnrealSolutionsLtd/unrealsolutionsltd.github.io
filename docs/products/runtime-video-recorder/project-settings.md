# Project Settings

Configure Runtime Video Recorder globally in your project settings.

## Accessing Settings

1. Open **Edit** → **Project Settings**
2. Navigate to **Plugins** → **RuntimeVideoRecorder**

<!-- Image placeholder: Project Settings screenshot -->

---

## Settings Reference

### bUseHardwareAcceleration

Enable hardware-accelerated encoding.

**Type:** `bool`  
**Default:** `true`  
**Platforms:** Windows, macOS, Android, Oculus

**Description:**
When enabled, uses native OS APIs for hardware-accelerated video encoding:
- **Windows:** Windows Media Foundation (WMF)
- **macOS:** AVFoundation
- **Android/Oculus:** MediaCodec
- **Linux:** OpenH264 (software only, this setting has no effect)

**When to Disable:**
- Troubleshooting encoding issues
- Testing software encoding performance
- GPU compatibility problems
- Limited GPU encoder sessions

::: tip Performance Impact
Disabling hardware acceleration will significantly increase CPU usage (5-10× higher) and may cause performance issues.
:::

#### Example Use Cases

**Enable (Default):**
```
✓ Use Hardware Acceleration
```
- Normal gameplay recording
- Production use
- Best performance

**Disable:**
```
☐ Use Hardware Acceleration
```
- GPU driver issues
- Debugging encoding problems
- Comparing software vs hardware encoding

---

### bForceHardwareAccelerationForAllVendors

Force hardware acceleration for all GPU vendors.

**Type:** `bool`  
**Default:** `false`  
**Platform:** Windows only

**Description:**
By default, hardware acceleration is primarily optimized for NVIDIA GPUs. Enable this to force hardware acceleration for AMD and Intel GPUs as well.

**When to Enable:**
- Using AMD GPU and experiencing issues
- Using Intel integrated graphics
- Want to ensure HW acceleration on non-NVIDIA systems

::: info Experimental
This setting may improve performance on AMD/Intel, but could also cause stability issues on some GPU/driver combinations. Test thoroughly.
:::

#### Example Scenarios

**NVIDIA GPU:**
```
☐ Force Hardware Acceleration For All Vendors
```
- Default setting works great
- No need to enable

**AMD or Intel GPU:**
```
✓ Force Hardware Acceleration For All Vendors
```
- May improve performance
- Enable if software encoding is being used

---

### bDebugDumpEachFrame

Dump each captured frame to disk for debugging.

**Type:** `bool`  
**Default:** `false`  
**Platform:** All

**Description:**
When enabled, saves every captured frame as a `.raw` file to the project's `Saved` folder. Useful for debugging encoding issues or investigating frame capture problems.

**Output Location:**
```
YourProject/Saved/FrameDump/
  frame_0000.raw
  frame_0001.raw
  frame_0002.raw
  ...
```

::: danger Performance Warning
**NEVER enable this in production!**
- Severe performance impact
- Massive disk I/O
- Will fill disk space extremely quickly
- 1 minute @ 1080p30 ≈ 120 GB of raw frames!
:::

#### When to Use

**Enable temporarily for:**
- Investigating encoding artifacts
- Verifying frame capture is working
- Debugging color space issues
- Creating custom post-processing

**Example Debug Workflow:**
```cpp
1. Enable "Debug Dump Each Frame" in Project Settings
2. Record 2-3 seconds of video
3. Stop recording
4. Examine raw frames in Saved/FrameDump/
5. DISABLE setting when done
```

---

### MaxLastSecondsToRecord

Maximum circular buffer duration.

**Type:** `float`  
**Default:** `600.0` (10 minutes)  
**Range:** `1.0` - `3600.0` (1 second to 1 hour)  
**Platform:** All

**Description:**
Sets the maximum value for the `LastSecondsToRecord` parameter when using circular buffer recording. This is a safety limit to prevent excessive memory usage.

**Memory Usage:**
| Duration | Resolution | FPS | Approx Memory |
|----------|------------|-----|---------------|
| 30 sec | 1080p | 30 | ~1.5 GB |
| 60 sec | 1080p | 30 | ~3 GB |
| 120 sec | 1080p | 30 | ~6 GB |
| 600 sec | 1080p | 30 | ~30 GB |

::: warning Memory Intensive
Circular buffer stores frames in memory. Large values can cause out-of-memory crashes, especially on mobile devices!
:::

#### Recommended Values

**Desktop (16+ GB RAM):**
```
Max Last Seconds To Record: 600.0 (10 minutes)
```

**Desktop (8 GB RAM):**
```
Max Last Seconds To Record: 120.0 (2 minutes)
```

**Mobile/VR:**
```
Max Last Seconds To Record: 30.0 (30 seconds)
```

#### Example Usage

```cpp
// User tries to record last 15 minutes
Recorder->StartRecording(
    TEXT("%auto%"), 30, -1, -1,
    FRuntimeEncoderSettings(),
    true, true, false, false,
    900.0f  // 15 minutes
);

// If MaxLastSecondsToRecord = 600.0 (10 min)
// It will be clamped to 600 seconds
```

---

### bShowRecordingsInMediaFolders

Auto-save recordings to device media folders.

**Type:** `bool`  
**Default:** `true`  
**Platform:** Android, Oculus only (no effect on other platforms)

**Description:**
When enabled, automatically moves completed recordings to the device's media folder so they appear in the user's gallery/videos app:
- **Android:** Videos folder (accessible via Files/Gallery app)
- **Oculus:** Movies folder (accessible via Quest's Files app)

**When Disabled:**
- Videos save to app's private storage only
- User must manually copy files to access them
- Files may be deleted when app is uninstalled

::: tip User Experience
Keep this enabled for better UX on mobile/VR. Users expect videos to appear in their gallery!
:::

#### Example Behavior

**Enabled (Default):**
```
✓ Show Recordings In Media Folders

User records video →
  Saved to app storage: /data/.../recording.mp4
  Copied to media folder: /storage/emulated/0/Movies/recording.mp4
  ✓ Appears in Gallery/Files app
```

**Disabled:**
```
☐ Show Recordings In Media Folders

User records video →
  Saved to app storage: /data/.../recording.mp4
  ✗ Not visible in Gallery/Files app
  Must use adb or file explorer to access
```

---

## Configuration Examples

### High-Performance Desktop

Optimized for powerful desktop PCs with dedicated GPUs.

```ini
[/Script/RuntimeVideoRecorder.RuntimeVideoRecorderSettings]
bUseHardwareAcceleration=True
bForceHardwareAccelerationForAllVendors=False
bDebugDumpEachFrame=False
MaxLastSecondsToRecord=600.0
bShowRecordingsInMediaFolders=True
```

---

### AMD/Intel GPU Desktop

Enable forced hardware acceleration for non-NVIDIA GPUs.

```ini
[/Script/RuntimeVideoRecorder.RuntimeVideoRecorderSettings]
bUseHardwareAcceleration=True
bForceHardwareAccelerationForAllVendors=True  ← Enabled
bDebugDumpEachFrame=False
MaxLastSecondsToRecord=600.0
bShowRecordingsInMediaFolders=True
```

---

### Mobile/VR (Android, Oculus)

Conservative settings for mobile devices.

```ini
[/Script/RuntimeVideoRecorder.RuntimeVideoRecorderSettings]
bUseHardwareAcceleration=True
bForceHardwareAccelerationForAllVendors=False
bDebugDumpEachFrame=False
MaxLastSecondsToRecord=30.0  ← Lower for mobile
bShowRecordingsInMediaFolders=True
```

---

### Debug/Development

Temporary settings for debugging encoding issues.

```ini
[/Script/RuntimeVideoRecorder.RuntimeVideoRecorderSettings]
bUseHardwareAcceleration=False  ← Disabled for testing
bForceHardwareAccelerationForAllVendors=False
bDebugDumpEachFrame=True  ← TEMPORARY ONLY!
MaxLastSecondsToRecord=600.0
bShowRecordingsInMediaFolders=True
```

::: danger
Remember to disable `bDebugDumpEachFrame` after debugging!
:::

---

## Config File Location

Settings are stored in your project's config file:

```
YourProject/Config/DefaultEngine.ini
```

You can manually edit this file to change settings:

```ini
[/Script/RuntimeVideoRecorder.RuntimeVideoRecorderSettings]
bUseHardwareAcceleration=True
bForceHardwareAccelerationForAllVendors=False
bDebugDumpEachFrame=False
MaxLastSecondsToRecord=600.0
bShowRecordingsInMediaFolders=True
```

---

## Platform-Specific Recommendations

### Windows

```ini
bUseHardwareAcceleration=True
bForceHardwareAccelerationForAllVendors=False (True for AMD/Intel)
MaxLastSecondsToRecord=600.0
```

---

### macOS

```ini
bUseHardwareAcceleration=True
MaxLastSecondsToRecord=600.0
```

---

### Linux

```ini
bUseHardwareAcceleration=False (no effect, software encoding only)
MaxLastSecondsToRecord=300.0 (lower due to CPU encoding)
```

---

### Android

```ini
bUseHardwareAcceleration=True
MaxLastSecondsToRecord=30.0 (limited RAM)
bShowRecordingsInMediaFolders=True
```

---

### Oculus/Meta Quest

```ini
bUseHardwareAcceleration=True
MaxLastSecondsToRecord=30.0 (limited RAM)
bShowRecordingsInMediaFolders=True
```

---

## See Also

- [Quick Start](./quick-start) - Getting started guide
- [Troubleshooting](./troubleshooting) - Common issues
- [Performance](./performance) - Performance characteristics
- [API Reference](./api/runtime-video-recorder) - API documentation

