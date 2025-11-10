# Troubleshooting

Common issues and their solutions for Runtime Video Recorder.

## Recording Issues

### Recording Doesn't Start

**Symptoms:**
- `StartRecording()` returns `false`
- No error message in logs
- Nothing happens when trying to record

**Solutions:**

1. **Check if already recording**
   ```cpp
   if (Recorder->IsRecordingInProgress())
   {
       UE_LOG(LogTemp, Warning, TEXT("Already recording!"));
   }
   ```

2. **Verify output directory exists**
   ```cpp
   // Plugin won't create directories
   // Either use %auto% or ensure directory exists
   FString OutPath = TEXT("E:/MyVideos/recording.mp4");
   FString Directory = FPaths::GetPath(OutPath);
   
   if (!FPaths::DirectoryExists(Directory))
   {
       FPlatformFileManager::Get().GetPlatformFile().CreateDirectoryTree(*Directory);
   }
   ```

3. **Check required plugins are enabled**
   - **Edit** → **Plugins**
   - Verify **ElectraPlayer** is enabled
   - Verify **AudioCapture** is enabled (for audio recording)

4. **Check Output Log for errors**
   - Open Output Log window
   - Filter by "RuntimeVideoRecorder"
   - Look for initialization errors

---

### Recording Starts But No File Is Created

**Symptoms:**
- `StartRecording()` returns `true`
- Recording appears to work
- No MP4 file after stopping

**Solutions:**

1. **Wait for encoding to finish**
   ```cpp
   // Use the latent StopRecording in Blueprint, OR
   // In C++, check status after stopping:
   Recorder->StopRecording_NativeAPI();
   
   // Wait for completion (in a timer or tick)
   if (!Recorder->IsRecordingInProgress())
   {
       FString Path = Recorder->GetLastRecordingFilepath();
       // File should now exist
   }
   ```

2. **Check disk space**
   - Ensure you have enough free space (100 MB+ per minute @ 1080p)
   - Check if drive is write-protected

3. **Verify file permissions**
   - Ensure the application has write access to the output directory
   - On Windows: Check antivirus isn't blocking writes
   - On macOS: Grant app permissions in System Preferences

---

## Quality Issues

### Poor Video Quality / Blocky Artifacts

**Solutions:**

1. **Increase bitrate**
   ```cpp
   FRuntimeEncoderSettings Settings;
   Settings.VideoBitrate = 30000000;  // 30 Mbps (was 20)
   Settings.TargetQuality = 80;       // Higher quality
   ```

2. **Use High profile**
   ```cpp
   Settings.Profile = ERuntimeEncoderProfile::Profile_High;
   ```

3. **Use Quality rate control mode**
   ```cpp
   Settings.RCMode = ERuntimeEncoderRCMode::RC_Quality;
   ```

4. **Reduce keyframe interval** (for high-motion content)
   ```cpp
   Settings.KEYFRAME_INTERVAL = 15;  // More keyframes
   ```

5. **Check source resolution matches video resolution**
   - Don't upscale: If viewport is 1280×720, don't record at 1920×1080
   - Match or downscale only

---

### Video Quality Is Too Good (Files Too Large)

**Solutions:**

1. **Reduce bitrate**
   ```cpp
   Settings.VideoBitrate = 10000000;  // 10 Mbps (was 20)
   ```

2. **Reduce resolution**
   ```cpp
   Recorder->StartRecording(
       TEXT("%auto%"),
       30,
       1280, 720,  // 720p instead of 1080p
       Settings
   );
   ```

3. **Increase keyframe interval**
   ```cpp
   Settings.KEYFRAME_INTERVAL = 60;  // Fewer keyframes
   ```

---

## Audio Issues

### No Audio in Video

**Solutions:**

1. **Verify audio is enabled**
   ```cpp
   bool bEnableAudio = true;  // Must be true
   Recorder->StartRecording(TEXT("%auto%"), 30, -1, -1, Settings, true, bEnableAudio);
   ```

2. **Check frame-rate independent mode is OFF**
   ```cpp
   bool bFrameRateIndependent = false;  // Audio doesn't work with true
   ```
   
   ::: warning
   Audio recording is **disabled** in frame-rate independent mode!
   :::

3. **Verify AudioCapture plugin is enabled**
   - **Edit** → **Plugins** → Search "Audio Capture"
   - Must be enabled

4. **Check audio device settings**
   - **Edit** → **Project Settings** → **Audio**
   - Ensure valid audio output device is selected
   - Test audio in PIE (should hear game sounds)

5. **Linux: Audio not supported**
   - Audio recording is not available on Linux
   - This is a known limitation

---

### Audio Out of Sync with Video

**Solutions:**

1. **Ensure stable frame rate**
   - Audio sync depends on consistent frame pacing
   - Cap frame rate if experiencing drops:
     ```cpp
     // In Project Settings → Engine → General Settings
     // Set Frame Rate Limit to your target FPS
     ```

2. **Disable frame-rate independent mode**
   ```cpp
   bool bFrameRateIndependent = false;
   ```

3. **Use lower recording FPS if game can't maintain it**
   ```cpp
   // If game runs at 30 FPS, don't record at 60 FPS
   Recorder->StartRecording(TEXT("%auto%"), 30, ...);  // Match game FPS
   ```

---

## Performance Issues

### Game Lags/Stutters While Recording

**Solutions:**

1. **Enable hardware acceleration** (should be on by default)
   - **Edit** → **Project Settings** → **Plugins** → **RuntimeVideoRecorder**
   - Check **Use Hardware Acceleration** is enabled

2. **Lower video resolution**
   ```cpp
   Recorder->StartRecording(
       TEXT("%auto%"),
       30,
       1280, 720,  // Lower than 1920×1080
       Settings
   );
   ```

3. **Reduce target FPS**
   ```cpp
   Recorder->StartRecording(TEXT("%auto%"), 30, ...);  // 30 instead of 60
   ```

4. **Disable debug frame dumping**
   - **Project Settings** → **RuntimeVideoRecorder**
   - Ensure **Debug Dump Each Frame** is **OFF**

5. **Use on-the-fly encoding** (not deferred)
   ```cpp
   bool bPostponeEncoding = false;  // Default
   ```

6. **Check GPU/CPU usage**
   - Open Task Manager (Windows) or Activity Monitor (macOS)
   - If CPU is maxed: Lower resolution/FPS or enable hardware acceleration
   - If GPU is maxed: Reduce graphics settings or resolution

---

### High CPU Usage (Windows)

**Solutions:**

1. **Verify hardware acceleration is working**
   - Check Output Log for "Using hardware encoder" message
   - If using software encoder, check GPU drivers

2. **Force hardware acceleration for all vendors** (AMD/Intel)
   - **Project Settings** → **RuntimeVideoRecorder**
   - Enable **Force Hardware Acceleration For All Vendors**

3. **Update GPU drivers**
   - NVIDIA: Download from nvidia.com
   - AMD: Download from amd.com
   - Intel: Download from intel.com

---

### High Memory Usage

**Symptoms:**
- Memory usage grows significantly during recording
- Potential out-of-memory crashes

**Solutions:**

1. **Avoid deferred encoding**
   ```cpp
   bool bPostponeEncoding = false;  // Don't use true for long recordings
   ```
   
   ::: danger
   Deferred encoding stores ALL frames in RAM before encoding. Only use for short (<30 sec) recordings!
   :::

2. **Limit circular buffer duration**
   ```cpp
   // Don't use long circular buffers
   float LastSecondsToRecord = 30.0f;  // 30 sec max, not 600
   ```

3. **Lower resolution**
   - 1080p uses 4× more memory than 720p
   - 4K uses 4× more memory than 1080p

---

## Platform-Specific Issues

### Windows

#### Hardware Acceleration Not Working

**Solutions:**

1. **Update GPU drivers** (most common cause)

2. **Enable for all vendors**
   - **Project Settings** → **RuntimeVideoRecorder**
   - Check **Force Hardware Acceleration For All Vendors**

3. **Check GPU compatibility**
   - Very old GPUs may not support H.264 encoding
   - Minimum: NVIDIA Kepler (GTX 600), AMD GCN 1.0, Intel HD 4000

4. **Verify no other app is using encoder**
   - Some GPUs have limited encoder sessions
   - Close other recording software (OBS, ShadowPlay, etc.)

---

### macOS

#### Black Screen in Recording

**Solutions:**

1. **Grant screen recording permission**
   - **System Preferences** → **Security & Privacy** → **Screen Recording**
   - Add Unreal Engine/your app to allowed list

2. **Check camera permission** (for camera recording)
   - **System Preferences** → **Security & Privacy** → **Camera**
   - Grant permission if prompted

---

### Linux

#### Very High CPU Usage

**Expected Behavior:**
- Linux uses OpenH264 software encoding (no hardware acceleration)
- High CPU usage is normal

**Solutions:**

1. **Lower resolution/FPS**
   ```cpp
   Recorder->StartRecording(TEXT("%auto%"), 24, 1280, 720, ...);
   ```

2. **Reduce bitrate**
   ```cpp
   Settings.VideoBitrate = 8000000;  // 8 Mbps
   ```

3. **Use simpler encoder settings**
   ```cpp
   Settings.Profile = ERuntimeEncoderProfile::Profile_Baseline;
   Settings.TargetQuality = 40;
   ```

---

### Android

#### Recording Not Starting on Device

**Solutions:**

1. **Check storage permissions**
   - Ensure `WRITE_EXTERNAL_STORAGE` permission is granted
   - Add to `Config/DefaultEngine.ini`:
     ```ini
     [/Script/AndroidRuntimeSettings.AndroidRuntimeSettings]
     bEnablePermission_WRITE_EXTERNAL_STORAGE=True
     ```

2. **Verify device supports MediaCodec**
   - Most devices Android 5.0+ support it
   - Some very old devices may not

3. **Check available storage**
   - Device must have sufficient free space

4. **Use lower resolution for mobile**
   ```cpp
   Recorder->StartRecording(TEXT("%auto%"), 30, 1280, 720, ...);
   ```

#### Hardware Encoding Not Available

**Solutions:**

1. **Check device capabilities**
   - Not all Android devices support hardware H.264 encoding
   - Emulators often don't support it

2. **Update device firmware**
   - Some manufacturers add codec support in updates

---

### Oculus/Meta Quest

#### Recording Causes Frame Drops in VR

**Solutions:**

1. **Use lower resolution**
   ```cpp
   Recorder->StartRecording(TEXT("%auto%"), 30, 1280, 720, ...);
   ```

2. **Enable low-latency mode**
   ```cpp
   Settings.WIN_bUseLowLatencyEncoding = true;  // If on Windows backend
   ```

3. **Record at 30 FPS** (not 72/90)
   ```cpp
   Recorder->StartRecording(TEXT("%auto%"), 30, ...);
   ```

---

## Compilation & Build Issues

### "Module RuntimeVideoRecorder not found"

**Solutions:**

1. **Add to Build.cs**
   ```csharp
   PublicDependencyModuleNames.AddRange(new string[] {
       "RuntimeVideoRecorder"
   });
   ```

2. **Regenerate project files**
   - Right-click `.uproject` → Generate Visual Studio project files

3. **Clean and rebuild**
   - Delete `Binaries` and `Intermediate` folders
   - Rebuild solution

---

### Android Build Fails

**Solutions:**

1. **Check NDK version**
   - Minimum NDK r21
   - Update in Android Studio

2. **Verify SDK version**
   - Minimum SDK 21
   - Target SDK 30+

3. **Check Android settings in Project Settings**
   - **Packaging** → **Android** → **Package for arm64**

---

## Crash Issues

### Crash on StartRecording

**Solutions:**

1. **Check Output Log** for error messages before crash

2. **Verify output path is valid**
   ```cpp
   // Use %auto% for testing
   Recorder->StartRecording(TEXT("%auto%"), ...);
   ```

3. **Update GPU drivers** (Windows)

4. **Try software encoding**
   - **Project Settings** → **RuntimeVideoRecorder**
   - Disable **Use Hardware Acceleration** temporarily

---

### Crash on StopRecording

**Solutions:**

1. **Don't call StopRecording multiple times**
   ```cpp
   if (Recorder->IsRecordingInProgress())
   {
       Recorder->StopRecording_NativeAPI();
   }
   ```

2. **Wait for previous recording to finish**
   - Don't start new recording immediately after stopping

---

## Still Having Issues?

### Get Help

1. **Join Discord** for quick community support
   - [discord.com/invite/pBDSCBcdgv](https://discord.com/invite/pBDSCBcdgv)

2. **Check Output Log**
   - Copy relevant error messages
   - Include in your support request

3. **Provide Information**
   - Unreal Engine version
   - Platform (Windows/Mac/Linux/Android)
   - GPU model and driver version
   - Code snippet or Blueprint screenshot
   - Error messages from Output Log

4. **Email Support**
   - [business@unrealsolutions.com](mailto:business@unrealsolutions.com)
   - Include all information from above

---

## See Also

- [Quick Start](./quick-start) - Basic setup guide
- [How-To Guide](./how-to) - Practical recording scenarios
- [Project Settings](./project-settings) - Global configuration
- [API Reference](./api/runtime-video-recorder) - Complete API documentation

