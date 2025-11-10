# Installation

This guide will help you install Runtime Video Recorder (RVR) in your Unreal Engine project.

## Prerequisites

- **Unreal Engine:** 5.0 or higher (5.3+ recommended)
- **Platforms:** Windows, macOS, Linux, Android, or Oculus development setup
- **Disk Space:** ~50 MB for the plugin

## Method 1: Download from Website (Recommended)

1. **Get the Plugin**
   - Visit our [Download Page](/download)
   - Complete your purchase or download the trial
   - You'll receive download instructions via email

2. **Extract to Plugins Folder**
   ```
   YourProject/
   └── Plugins/
       └── RuntimeVideoRecorder/
           ├── Source/
           ├── Resources/
           ├── Content/
           └── RuntimeVideoRecorder.uplugin
   ```

3. **Regenerate Project Files**
   - Right-click your `.uproject` file
   - Select **Generate Visual Studio project files** (Windows/Linux)
   - Or **Generate Xcode project** (macOS)

4. **Compile & Enable**
   - Open the generated solution/project file
   - Build in **Development Editor** configuration
   - Launch the editor
   - Go to **Edit** → **Plugins**
   - Search for "Runtime Video Recorder"
   - Check the **Enabled** checkbox
   - Click **Restart Now**

## Method 2: Alternative Installation

### If You Have the Plugin Files

1. **Download the Plugin**
   - Download the RVR package from your purchase confirmation email

2. **Extract to Plugins Folder**
   ```
   YourProject/
   └── Plugins/
       └── RuntimeVideoRecorder/
           ├── Source/
           ├── Resources/
           ├── Content/
           └── RuntimeVideoRecorder.uplugin
   ```

3. **Regenerate Project Files**
   - Right-click your `.uproject` file
   - Select **Generate Visual Studio project files** (Windows/Linux)
   - Or **Generate Xcode project** (macOS)

4. **Compile the Project**
   - Open the generated solution/project file
   - Build the project in **Development Editor** configuration

5. **Enable the Plugin**
   - Open your Unreal project
   - Go to **Edit** → **Plugins**
   - Search for "Runtime Video Recorder"
   - Check the **Enabled** checkbox
   - Click **Restart Now**

## Verify Installation

After restarting the editor, verify the installation:

### Blueprint Verification

1. Open any Blueprint
2. Right-click in the graph
3. Search for "Start Recording"
4. You should see **Start Recording** node from Runtime Video Recorder

### C++ Verification

Check if you can include the header:

```cpp
#include "RuntimeVideoRecorder.h"

void AMyActor::BeginPlay()
{
    Super::BeginPlay();
    
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder)
    {
        UE_LOG(LogTemp, Log, TEXT("Runtime Video Recorder is available!"));
    }
}
```

## Required Dependencies

RVR automatically enables these plugins (no manual action needed):

- **ElectraPlayer** - For video playback support
- **AudioCapture** - For audio recording functionality

If you encounter issues, manually verify these plugins are enabled:
- **Edit** → **Plugins** → Search for "ElectraPlayer" and "AudioCapture"

## Platform-Specific Setup

### Windows

No additional setup required. Hardware acceleration is enabled by default.

::: tip
For AMD/Intel GPUs, you may want to enable **Force Hardware Acceleration For All Vendors** in Project Settings if you experience issues.
:::

### macOS

No additional setup required. AVFoundation is included with macOS.

### Linux

OpenH264 library is included. No additional setup required.

::: warning
Linux uses software encoding (no hardware acceleration). Expect higher CPU usage.
:::

### Android

1. **Set Minimum SDK Version**
   - Go to **Edit** → **Project Settings** → **Platforms** → **Android**
   - Set **Minimum SDK Version** to **21** or higher
   - Set **Target SDK Version** to **30** or higher

2. **Enable Required Permissions**
   Add to `Config/DefaultEngine.ini`:
   ```ini
   [/Script/AndroidRuntimeSettings.AndroidRuntimeSettings]
   bEnablePermission_WRITE_EXTERNAL_STORAGE=True
   bEnablePermission_READ_EXTERNAL_STORAGE=True
   ```

3. **Package Settings**
   - **Project Settings** → **Packaging** → **Android**
   - Ensure **Package for arm64** is checked

### Oculus/Meta Quest

Follow the Android setup steps above, plus:

1. **Enable Oculus Plugin**
   - **Edit** → **Plugins** → Enable "Oculus VR"

2. **Configure for Quest**
   - **Project Settings** → **Platforms** → **Android**
   - Set **Package for Oculus Mobile devices** to **Quest** or **Quest 2**

## Troubleshooting Installation

### Plugin Doesn't Appear in Plugins List

**Solutions:**
- Ensure the plugin folder is correctly placed in `YourProject/Plugins/`
- Verify the `.uplugin` file exists
- Regenerate project files
- Check the Output Log for errors

### Compilation Errors

**Solutions:**
- Ensure you're using UE 5.0 or higher
- Clean and rebuild the project
- Delete `Intermediate` and `Binaries` folders, then regenerate

### "Module not found" Error

**Solutions:**
- Add to your project's `.Build.cs` file:
  ```csharp
  PublicDependencyModuleNames.AddRange(new string[] { 
      "Core", 
      "CoreUObject", 
      "Engine",
      "RuntimeVideoRecorder"  // Add this line
  });
  ```

### Android Build Fails

**Solutions:**
- Ensure Android SDK is properly configured
- Check minimum SDK version is 21+
- Verify NDK is installed (r21 or higher)

## Next Steps

Now that you've installed RVR, check out the [Quick Start Guide](./quick-start) to record your first video!

## Need Help?

- Join our [Discord community](https://discord.gg/wptvWkhtGm) for quick support
- Email us at [business@unrealsolutions.com](mailto:business@unrealsolutions.com)

