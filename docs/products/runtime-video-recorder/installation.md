# Installation

This guide walks you through installing Runtime Video Recorder (RVR) in your Unreal Engine project.

::: tip Which license do I have?
- **Standard** (one-time purchase) - install and go.
- **Perpetual** (one-time purchase, full source) - install and go.

See the [licensing page](https://unrealsolutions.com) for the full comparison.
:::

## Supported Versions & Platforms

- **Unreal Engine:** 5.4 - 5.8
- **Platforms:** Windows, MacOS, iOS, tvOS, Linux, Android, Oculus / Meta Quest

## Step 1 - Install the Plugin

Choose the method that matches your project type.

### Blueprint-Only Project (no C++ code)

Place the plugin in the **Engine** directory:

```
<ENGINE_DIR>/Plugins/Marketplace/RuntimeVideoRecorder/
```

For example, a typical path on Windows:

```
C:/Program Files/Epic Games/UE_5.5/Engine/Plugins/Marketplace/RuntimeVideoRecorder/
```

### C++ Project

Place the plugin in your **Project** directory instead:

```
<PROJECT_DIR>/Plugins/RuntimeVideoRecorder/
```

::: warning Important for C++ projects
If you previously had the plugin in the Engine directory, **remove** `<ENGINE_DIR>/Plugins/Marketplace/RuntimeVideoRecorder` before placing it in your project's `Plugins/` folder. Having copies in both locations causes conflicts.
:::

## Step 2 - Quick Test

The plugin ships with a demo level for quick verification:

1. Open the **Content Browser**
2. Enable **Show Plugin Content** (click the settings icon in Content Browser)
3. Navigate to **Plugins → Runtime Video Recorder Content**
4. Open **`Level_RuntimeVideoRecorder_UE53Plus`**
5. Press **Play** - you should see the recording controls

::: tip That's it
You're done. Skip ahead to [Platform-Specific Notes](#platform-specific-notes) or jump straight to the [Quick Start Guide](./quick-start).
:::

## Platform-Specific Notes

### Windows

No additional setup required. Hardware acceleration is enabled by default.

::: tip AMD / Intel GPUs
If you experience encoding issues, enable **Force Hardware Acceleration For All Vendors** in Project Settings → Plugins → Runtime Video Recorder.
:::

### MacOS / iOS / tvOS

No additional setup required. AVFoundation handles encoding natively.

### Linux

OpenH264 library is bundled. No additional setup required.

::: warning
Linux uses software encoding (no hardware acceleration). Expect higher CPU usage compared to other platforms.
:::

### Android / Oculus

1. **Minimum SDK Version:** 21 or higher
2. **Target SDK Version:** 30 or higher
3. **Package for arm64** must be enabled

Add storage permissions to `Config/DefaultEngine.ini`:

```ini
[/Script/AndroidRuntimeSettings.AndroidRuntimeSettings]
bEnablePermission_WRITE_EXTERNAL_STORAGE=True
bEnablePermission_READ_EXTERNAL_STORAGE=True
```

For **Oculus / Meta Quest**, also enable the Oculus VR plugin and set the target device under **Project Settings → Platforms → Android**.

## Verify Installation

After setup, confirm the plugin is working:

1. Open any Blueprint
2. Right-click in the Event Graph
3. Search for **"Start Recording"**
4. You should see the **Start Recording** node from Runtime Video Recorder

For C++ projects, add the module to your `.Build.cs`:

```csharp
PublicDependencyModuleNames.AddRange(new string[] { 
    "Core", 
    "CoreUObject", 
    "Engine",
    "RuntimeVideoRecorder"
});
```

## Troubleshooting Installation

| Problem | Solution |
|---------|----------|
| Plugin doesn't appear in Plugins list | Verify the folder is in the correct location and contains the `.uplugin` file. Regenerate project files. |
| Compilation errors | Ensure UE 5.4-5.8. Delete `Intermediate` and `Binaries` folders, then regenerate project files. |
| Module not found error | Add `"RuntimeVideoRecorder"` to your `.Build.cs` (see above). |
| Android build fails | Verify Unreal Engine Android environment |

## Next Steps

- [Quick Start Guide](./quick-start) - Record your first video in under 5 minutes
- [Project Settings](./project-settings) - Configure encoding quality, hardware acceleration, and more
- [FAQ](./faq) - Common questions about licensing, platforms, and usage

## Need Help?

- Join our [Discord community](https://discord.com/invite/pBDSCBcdgv) for quick support
- Email [business@unrealsolutions.com](mailto:business@unrealsolutions.com)
