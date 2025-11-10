# URuntimeVideoRecorder API Reference

The main class for video recording functionality. Access it as an Engine Subsystem.

## Getting the Subsystem

### Blueprint
```blueprint
Get Engine Subsystem → Class: RuntimeVideoRecorder
```

### C++
```cpp
URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
```

---

## Recording Methods

### StartRecording

Records from the game/editor viewport.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Video")
bool StartRecording(
    const FString& OutFilename = TEXT("%auto%"),
    int32 TargetFPS = -1,
    int32 Width = -1,
    int32 Height = -1,
    FRuntimeEncoderSettings EncoderSettings = FRuntimeEncoderSettings(),
    bool bRecordUI = true,
    bool bEnableAudioRecording = true,
    bool bFrameRateIndependent = false,
    bool bAllowManualCaptureOnly = false,
    float LastSecondsToRecord = -1.0,
    bool bPostponeEncoding = false,
    class USoundSubmix* InSubmix = nullptr
);
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `OutFilename` | FString | `"%auto%"` | Output path. Use `%auto%` to save to `ProjectDir/Saved/<timestamp>.mp4` |
| `TargetFPS` | int32 | `-1` | Target frames per second. `-1` uses default (30 FPS) |
| `Width` | int32 | `-1` | Video width. `-1` uses viewport width |
| `Height` | int32 | `-1` | Video height. `-1` uses viewport height |
| `EncoderSettings` | FRuntimeEncoderSettings | Default | Encoder configuration (bitrate, quality, etc.) |
| `bRecordUI` | bool | `true` | Include UI/widgets in recording |
| `bEnableAudioRecording` | bool | `true` | Enable audio capture |
| `bFrameRateIndependent` | bool | `false` | Lock to exact FPS (disables audio) |
| `bAllowManualCaptureOnly` | bool | `false` | Only capture when `CaptureSingleFrame()` is called |
| `LastSecondsToRecord` | float | `-1.0` | Circular buffer duration (max 10 minutes). `-1` disables |
| `bPostponeEncoding` | bool | `false` | Delay encoding until `StopRecording()` |
| `InSubmix` | USoundSubmix* | `nullptr` | Record audio from specific submix only |

#### Returns
`bool` - `true` if recording started successfully, `false` if already recording or initialization failed

#### Example
```cpp
URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();

FRuntimeEncoderSettings Settings;
Settings.VideoBitrate = 20000000;  // 20 Mbps
Settings.TargetQuality = 75;

bool bSuccess = Recorder->StartRecording(
    TEXT("E:/Videos/gameplay.mp4"),
    60,              // 60 FPS
    1920, 1080,
    Settings,
    true,            // Record UI
    true,            // Enable audio
    false,           // Frame rate dependent
    false,           // Auto capture
    -1.0f,           // No circular buffer
    false,           // On-the-fly encoding
    nullptr          // All audio
);
```

---

### StartRecordingRenderTarget

Records from a texture render target.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Video")
bool StartRecordingRenderTarget(
    UTextureRenderTarget2D* RenderTarget,
    const FString& OutFilename = TEXT("%auto%"),
    int32 TargetFPS = -1,
    int32 Width = -1,
    int32 Height = -1,
    FRuntimeEncoderSettings EncoderSettings = FRuntimeEncoderSettings(),
    bool bEnableAudioRecording = true,
    bool bFrameRateIndependent = false,
    bool bAllowManualCaptureOnly = false,
    float LastSecondsToRecord = -1.0,
    bool bPostponeEncoding = false,
    class USoundSubmix* InSubmix = nullptr
);
```

#### Parameters
Same as `StartRecording`, except:
- **`RenderTarget`** - Source render target to record from
- No `bRecordUI` parameter (render targets don't have UI)

#### Example
```cpp
UTextureRenderTarget2D* RT = NewObject<UTextureRenderTarget2D>();
RT->InitAutoFormat(1920, 1080);

Recorder->StartRecordingRenderTarget(
    RT,
    TEXT("%auto%"),
    30,
    -1, -1,  // Use render target dimensions
    FRuntimeEncoderSettings()
);
```

---

### StartRecordingCamera

Records from a camera component's perspective.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Video")
bool StartRecordingCamera(
    UCameraComponent* Camera,
    const FString& OutFilename = TEXT("%auto%"),
    int32 TargetFPS = -1,
    int32 Width = -1,
    int32 Height = -1,
    FRuntimeEncoderSettings EncoderSettings = FRuntimeEncoderSettings(),
    bool bEnableAudioRecording = true,
    bool bFrameRateIndependent = false,
    bool bAllowManualCaptureOnly = false,
    float LastSecondsToRecord = -1.0,
    bool bPostponeEncoding = false,
    class USoundSubmix* InSubmix = nullptr,
    float ScreenPercentage = 100.0f
);
```

#### Additional Parameter
- **`ScreenPercentage`** (`float`, default `100.0`) - Screen percentage for rendering quality

#### Example
```cpp
UCameraComponent* MyCamera = GetCameraComponent();

Recorder->StartRecordingCamera(
    MyCamera,
    TEXT("%auto%"),
    60, 1920, 1080,
    FRuntimeEncoderSettings(),
    true,    // Audio
    false,   // Frame rate dependent
    false,   // Auto capture
    -1.0f,   // No circular buffer
    false,   // On-the-fly encoding
    nullptr, // All audio
    100.0f   // Full quality
);
```

---

### StartRecordingCineCamera

Records from a cine camera component with cinematic features.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Video")
bool StartRecordingCineCamera(
    UCineCameraComponent* Camera,
    const FString& OutFilename = TEXT("%auto%"),
    int32 TargetFPS = -1,
    int32 Width = -1,
    int32 Height = -1,
    FRuntimeEncoderSettings EncoderSettings = FRuntimeEncoderSettings(),
    bool bEnableAudioRecording = true,
    bool bFrameRateIndependent = false,
    bool bAllowManualCaptureOnly = false,
    float LastSecondsToRecord = -1.0,
    bool bPostponeEncoding = false,
    class USoundSubmix* InSubmix = nullptr,
    float ScreenPercentage = 100.0f
);
```

Same parameters as `StartRecordingCamera`, but accepts `UCineCameraComponent*` for cinematic recording with depth of field, focal length, etc.

---

### StartRecordingMultipleCameras

Records multiple cameras in a grid layout.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Video")
bool StartRecordingMultipleCameras(
    const TArray<UCameraComponent*>& Cameras,
    const FString& OutFilename = TEXT("%auto%"),
    int32 TargetFPS = -1,
    int32 Width = -1,
    int32 Height = -1,
    FRuntimeEncoderSettings EncoderSettings = FRuntimeEncoderSettings(),
    bool bEnableAudioRecording = true,
    bool bFrameRateIndependent = false,
    bool bAllowManualCaptureOnly = false,
    float LastSecondsToRecord = -1.0f,
    bool bPostponeEncoding = false,
    class USoundSubmix* InSubmix = nullptr,
    float ScreenPercentage = 100.0f
);
```

#### Example
```cpp
TArray<UCameraComponent*> Cameras;
Cameras.Add(FrontCamera);
Cameras.Add(BackCamera);
Cameras.Add(LeftCamera);
Cameras.Add(RightCamera);

Recorder->StartRecordingMultipleCameras(
    Cameras,
    TEXT("E:/multicam.mp4"),
    30, 1920, 1080
);
```

Cameras are arranged automatically in a grid (e.g., 4 cameras = 2×2 grid).

---

### StopRecording

Stops recording (Latent Blueprint action).

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Video", 
          meta = (Latent, LatentInfo = "LatentInfo"))
void StopRecording(
    FLatentActionInfo LatentInfo,
    UObject* WorldContextObject = nullptr
);
```

::: tip Blueprint Usage
This is a **latent action** - execution will pause until recording is fully stopped and file is written.
:::

---

### StopRecording_NativeAPI

Stops recording immediately (synchronous, C++ friendly).

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Video")
void StopRecording_NativeAPI();
```

::: warning Non-Blocking
This returns immediately. Check `IsRecordingInProgress()` to verify completion.
:::

#### Example
```cpp
Recorder->StopRecording_NativeAPI();

// Recording may still be finalizing
// Check status with IsRecordingInProgress()
```

---

## Status & Control Methods

### IsRecordingInProgress

Checks if recording is currently active.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Video")
bool IsRecordingInProgress() const;
```

#### Returns
`bool` - `true` if recording is in progress

---

### CaptureSingleFrame

Captures a single frame (requires `bAllowManualCaptureOnly = true`).

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Video")
bool CaptureSingleFrame();
```

#### Returns
`bool` - `true` if frame was captured successfully

#### Example
```cpp
// Start in manual mode
Recorder->StartRecording(
    TEXT("%auto%"),
    30, -1, -1,
    FRuntimeEncoderSettings(),
    true, true, false,
    true  // bAllowManualCaptureOnly
);

// Later, in Tick or event
if (ShouldCaptureFrame())
{
    Recorder->CaptureSingleFrame();
}
```

---

### GetLastRecordingFilepath

Gets the path to the last recorded video.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Recordings")
FString GetLastRecordingFilepath() const;
```

#### Returns
`FString` - Full path to last recording, or empty string if no recording

#### Example
```cpp
Recorder->StopRecording_NativeAPI();

FString Path = Recorder->GetLastRecordingFilepath();
UE_LOG(LogTemp, Log, TEXT("Video saved: %s"), *Path);
```

---

## Camera Preview Methods

### StartCameraPreview

Creates a real-time camera preview.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Preview")
UTextureRenderTarget2D* StartCameraPreview(
    UCameraComponent* InCamera,
    int32 TargetFPS = 30,
    int32 Width = 1280,
    int32 Height = 720
);
```

#### Returns
`UTextureRenderTarget2D*` - Render target containing the preview

#### Example
```cpp
UTextureRenderTarget2D* PreviewRT = Recorder->StartCameraPreview(
    MyCameraComponent,
    30,        // 30 FPS preview
    1280, 720
);

// Use PreviewRT in UI or material
MyImageWidget->SetBrushFromTexture(PreviewRT);
```

---

### StopCameraPreview

Stops the camera preview.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Preview")
void StopCameraPreview();
```

---

### GetCameraPreviewRenderTarget

Gets the current preview render target.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Preview")
UTextureRenderTarget2D* GetCameraPreviewRenderTarget();
```

---

## Utility Methods

### MakeScreenshot

Captures a screenshot.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Screenshot")
void MakeScreenshot(const FString& OutFilename, bool bShowUI);
```

#### Parameters
- **`OutFilename`** - Output path for the screenshot
- **`bShowUI`** - Include UI/widgets in screenshot

---

### EncodeCircularBufferToVideo

Encodes circular buffer contents (for crash recovery).

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Emergency")
bool EncodeCircularBufferToVideo(const FString& OutputBasePath);
```

Automatically appends `_crash_recovery.mp4` to the output path.

---

### GetPluginResourcesDirectory

Gets the path to the plugin's Resources folder.

```cpp
UFUNCTION(BlueprintCallable, Category = "RuntimeVideoRecorder | Utilities")
const FString GetPluginResourcesDirectory() const;
```

---

## Events (Delegates)

### OnRecordingStarted

Fired when recording begins.

```cpp
UPROPERTY(BlueprintAssignable)
FOnRuntimeRecordingEvent OnRecordingStarted;
```

### OnRecordingFinished

Fired when recording completes.

```cpp
UPROPERTY(BlueprintAssignable)
FOnRuntimeRecordingEvent OnRecordingFinished;
```

### OnPreviewStarted

Fired when camera preview starts.

```cpp
UPROPERTY(BlueprintAssignable)
FOnRuntimeRecordingEvent OnPreviewStarted;
```

### OnPreviewStopped

Fired when camera preview stops.

```cpp
UPROPERTY(BlueprintAssignable)
FOnRuntimeRecordingEvent OnPreviewStopped;
```

#### Example Usage
```cpp
void AMyActor::BeginPlay()
{
    Super::BeginPlay();
    
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder)
    {
        Recorder->OnRecordingStarted.AddDynamic(this, &AMyActor::HandleRecordingStarted);
        Recorder->OnRecordingFinished.AddDynamic(this, &AMyActor::HandleRecordingFinished);
    }
}

void AMyActor::HandleRecordingStarted()
{
    UE_LOG(LogTemp, Log, TEXT("Recording has started!"));
}

void AMyActor::HandleRecordingFinished()
{
    UE_LOG(LogTemp, Log, TEXT("Recording completed!"));
}
```

---

## See Also

- [Encoder Settings](./encoder-settings) - Configuration for video encoding
- [Quick Start](../quick-start) - Getting started guide
- [Troubleshooting](../troubleshooting) - Common issues and solutions

