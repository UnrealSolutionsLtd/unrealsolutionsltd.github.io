# Quick Start Guide

This guide will help you record your first video in under 5 minutes!

## Your First Recording (Blueprint)

### Step 1: Get the Recorder Subsystem

In any Blueprint (e.g., your Player Controller, Game Mode, or custom Actor):

1. Right-click in the Event Graph
2. Search for **"Get Engine Subsystem"**
3. Select **Runtime Video Recorder** as the class

<!-- Image placeholder: Get Engine Subsystem blueprint screenshot -->

### Step 2: Start Recording

1. Right-click and search for **"Start Recording"**
2. Connect it to your Begin Play or a custom event (like a button press)

```
Event BeginPlay → Start Recording
```

**Basic Setup:**
```
Out Filename: "%auto%"  (auto-generates timestamp-based filename)
Target FPS: 30
Width: -1  (uses viewport width)
Height: -1  (uses viewport height)
Record UI: ✓ checked
Enable Audio Recording: ✓ checked
```

### Step 3: Stop Recording

1. Search for **"Stop Recording"**
2. Connect it to your custom event (e.g., key press, button click, or End Play)

```
Event (e.g., Key Press R) → Stop Recording
```

### Complete Example

Here's a complete example that records when **F9** is pressed and stops when **F10** is pressed:

```
// Start Recording on F9
InputAction F9 Pressed
  → Get Engine Subsystem (RuntimeVideoRecorder)
  → Start Recording (OutFilename: "%auto%", TargetFPS: 60, Width: 1920, Height: 1080)

// Stop Recording on F10
InputAction F10 Pressed
  → Get Engine Subsystem (RuntimeVideoRecorder)
  → Stop Recording
  → Get Last Recording Filepath
  → Print String (to show where video was saved)
```

## Your First Recording (C++)

### Step 1: Include the Header

```cpp
#include "RuntimeVideoRecorder.h"
```

### Step 2: Add to Build.cs

In your module's `.Build.cs` file:

```csharp
PublicDependencyModuleNames.AddRange(new string[] { 
    "Core", 
    "CoreUObject", 
    "Engine",
    "RuntimeVideoRecorder"  // Add this
});
```

### Step 3: Implement Recording

```cpp
// MyPlayerController.h
UCLASS()
class AMyPlayerController : public APlayerController
{
    GENERATED_BODY()
    
protected:
    virtual void SetupInputComponent() override;
    
    void StartVideoRecording();
    void StopVideoRecording();
};

// MyPlayerController.cpp
void AMyPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();
    
    InputComponent->BindAction("StartRecording", IE_Pressed, this, &AMyPlayerController::StartVideoRecording);
    InputComponent->BindAction("StopRecording", IE_Pressed, this, &AMyPlayerController::StopVideoRecording);
}

void AMyPlayerController::StartVideoRecording()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder && !Recorder->IsRecordingInProgress())
    {
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 20000000;  // 20 Mbps
        Settings.Profile = ERuntimeEncoderProfile::Profile_High;
        Settings.TargetQuality = 75;
        
        bool bSuccess = Recorder->StartRecording(
            TEXT("%auto%"),  // Auto-generate filename
            60,              // 60 FPS
            1920, 1080,      // Resolution
            Settings,
            true,            // Record UI
            true             // Enable audio
        );
        
        if (bSuccess)
        {
            UE_LOG(LogTemp, Log, TEXT("Recording started!"));
        }
    }
}

void AMyPlayerController::StopVideoRecording()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        Recorder->StopRecording_NativeAPI();
        
        FString OutputPath = Recorder->GetLastRecordingFilepath();
        UE_LOG(LogTemp, Log, TEXT("Recording saved to: %s"), *OutputPath);
    }
}
```

## Where Are Videos Saved?

When using `"%auto%"`, videos are saved to:

```
<Your_Project_Directory>/Saved/<timestamp>.mp4
```

Example:
```
MyProject/Saved/2025-01-15_14-30-45.mp4
```

You can also specify a custom path:
```cpp
Recorder->StartRecording(TEXT("E:/MyVideos/gameplay.mp4"), ...);
```

## Common Recording Scenarios

### Record Gameplay Session

```cpp
// Start recording when level begins
void AMyGameMode::BeginPlay()
{
    Super::BeginPlay();
    
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder)
    {
        Recorder->StartRecording(TEXT("%auto%"), 30, -1, -1);
    }
}

// Stop when level ends
void AMyGameMode::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        Recorder->StopRecording_NativeAPI();
    }
    
    Super::EndPlay(EndPlayReason);
}
```

### Record with Custom Encoder Settings

```cpp
void StartHighQualityRecording()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    FRuntimeEncoderSettings Settings;
    Settings.VideoBitrate = 30000000;  // 30 Mbps (higher quality)
    Settings.Profile = ERuntimeEncoderProfile::Profile_High;
    Settings.RCMode = ERuntimeEncoderRCMode::RC_Quality;
    Settings.TargetQuality = 90;  // Very high quality
    Settings.KEYFRAME_INTERVAL = 60;  // Keyframe every 60 frames
    
    Recorder->StartRecording(
        TEXT("E:/HighQuality/video.mp4"),
        60,    // 60 FPS
        3840,  // 4K width
        2160,  // 4K height
        Settings,
        false, // Don't record UI
        true   // Enable audio
    );
}
```

### Record from Specific Camera

```cpp
void RecordCameraView(UCameraComponent* MyCamera)
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder && MyCamera)
    {
        Recorder->StartRecordingCamera(
            MyCamera,
            TEXT("%auto%"),
            60,        // 60 FPS
            1920, 1080,
            FRuntimeEncoderSettings(),
            true       // Enable audio
        );
    }
}
```

### Toggle Recording (On/Off with Same Key)

```cpp
void AMyPlayerController::ToggleRecording()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (!Recorder) return;
    
    if (Recorder->IsRecordingInProgress())
    {
        // Stop recording
        Recorder->StopRecording_NativeAPI();
        UE_LOG(LogTemp, Log, TEXT("Recording stopped"));
    }
    else
    {
        // Start recording
        bool bSuccess = Recorder->StartRecording(TEXT("%auto%"), 30, -1, -1);
        if (bSuccess)
        {
            UE_LOG(LogTemp, Log, TEXT("Recording started"));
        }
    }
}
```

## Testing Your Setup

1. **Start the Editor**
2. **Play in Editor (PIE)**
3. **Press your recording start key** (e.g., F9)
4. **Record some gameplay** (move around, interact)
5. **Press your recording stop key** (e.g., F10)
6. **Check the Output Log** - it should show the save location
7. **Open the video file** in your favorite media player

## Troubleshooting Quick Start

### Recording Doesn't Start

**Check:**
- Is another recording already in progress? Use `IsRecordingInProgress()`
- Does the output directory exist? Plugin won't create directories
- Check Output Log for error messages

### Video Quality Is Poor

**Solutions:**
- Increase `VideoBitrate` to 30000000 or higher
- Set `Profile` to `Profile_High`
- Increase `TargetQuality` to 75-90

### No Audio in Video

**Check:**
- Is `bEnableAudioRecording` set to `true`?
- Is `bFrameRateIndependent` set to `false`? (Audio doesn't work with frame-rate independent mode)
- Are AudioCapture and ElectraPlayer plugins enabled?
- Check Project Settings → Audio for proper audio device configuration

### Game Lags While Recording

**Solutions:**
- Enable hardware acceleration in Project Settings
- Lower video resolution
- Reduce `TargetFPS`
- Check that you're not using `bDebugDumpEachFrame = true`

## Next Steps

Now that you can record basic videos, explore more:

- [How-To Guide](./how-to) - 10 practical recording scenarios with code examples
- [API Reference](./api/runtime-video-recorder) - Complete API documentation
- [Troubleshooting](./troubleshooting) - Common issues and solutions
- [Project Settings](./project-settings) - Global configuration options

## Sample Project

Check the included sample content:
- `Content/Level_RuntimeVideoRecorder.umap` - Demo level with recording UI
- `Content/BP_RVR_GameMode.uasset` - Example game mode with recording
- `Content/Widget_AndroidRecording.uasset` - Mobile-friendly UI

## Need Help?

- 💬 [Join our Discord](https://discord.com/invite/pBDSCBcdgv)
- 📧 [Email Support](mailto:business@unrealsolutions.com)
- 📖 [Full API Reference](./api/runtime-video-recorder)

