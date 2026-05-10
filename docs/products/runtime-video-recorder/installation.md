# Installation

This guide walks you through installing Runtime Video Recorder (RVR) in your Unreal Engine project.

::: tip Which license do I have?
- **Standard** (one-time purchase) - install and go. **No API key.**
- **Perpetual** (one-time purchase, full source) - install and go. **No API key.**
- **Subscription** - install, then [set your API key](#subscription-only-api-key-setup). Internet connection required.

See the [licensing page](https://unrealsolutions.com) for the full comparison.
:::

## Supported Versions & Platforms

- **Unreal Engine:** 5.3+
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

::: tip Standard / Perpetual users
That's it - you're done. Skip ahead to [Platform-Specific Notes](#platform-specific-notes) or jump straight to the [Quick Start Guide](./quick-start).
:::

::: details Subscription only - API Key Setup

**Standard** and **Perpetual** licenses do not use an API key. This section is only for Subscription users.

**Get Your API Key**

After completing checkout for a Subscription, an API key is emailed to you automatically. If you haven't received it, check spam or contact [business@unrealsolutions.com](mailto:business@unrealsolutions.com).

Don't have a Subscription yet? Get one at **[unrealsolutions.com](https://unrealsolutions.com)**.

**Enter Your API Key**

1. Open your project in the Unreal Editor
2. Go to **Edit → Project Settings**
3. Scroll down to **Plugins → Runtime Video Recorder**
4. Paste your API key into the **API KEY** field

![RVR Settings](https://unrealsolutions.com/assets/rvr/settings.png)

> **API KEY field doesn't appear?** Delete the Engine copy of the plugin at `<ENGINE_DIR>/Plugins/Marketplace/RuntimeVideoRecorder` and restart the editor. The settings panel should now display the API key field correctly. Custom Engines require Perpetual license!

**Testing in Packaged Builds**

To verify the Subscription works in **Development** or **Shipping** configuration (outside the Editor), use the provided sample project:

**[Download Sample Project](https://drive.google.com/file/d/1GygW34E9h0CxcTM-7OvsvPXgN7aNSTi_/view?usp=drive_link)**

Remember to replace the API key in the sample project with your own.
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
| API KEY field is missing *(Subscription only)* | Delete `<ENGINE_DIR>/Plugins/Marketplace/RuntimeVideoRecorder` and restart the editor. Custom Engines require Perpetual license! |
| Recording fails on Subscription with auth error | Verify your API key is set (see above), the Subscription is active, and the machine has internet connectivity. |
| Compilation errors | Ensure UE 5.3+. Delete `Intermediate` and `Binaries` folders, then regenerate project files. |
| Module not found error | Add `"RuntimeVideoRecorder"` to your `.Build.cs` (see above). |
| Android build fails | Verify Unreal Engine Android environment |

## Next Steps

- [Quick Start Guide](./quick-start) - Record your first video in under 5 minutes
- [Project Settings](./project-settings) - Configure encoding quality, hardware acceleration, and more
- [FAQ](./faq) - Common questions about licensing, platforms, and usage

## Need Help?

- Join our [Discord community](https://discord.com/invite/pBDSCBcdgv) for quick support
- Email [business@unrealsolutions.com](mailto:business@unrealsolutions.com)
