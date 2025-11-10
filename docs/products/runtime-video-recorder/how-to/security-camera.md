# Record Security Camera View

**Scenario:** Record from a specific camera actor placed in the level (like a CCTV camera).

## Solution

```cpp
// SecurityCamera.h
UCLASS()
class ASecurityCamera : public AActor
{
    GENERATED_BODY()
    
public:
    ASecurityCamera();
    
    UFUNCTION(BlueprintCallable, Category = "Security")
    void StartRecording();
    
    UFUNCTION(BlueprintCallable, Category = "Security")
    void StopRecording();
    
protected:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
    class UCameraComponent* CameraComponent;
    
    UPROPERTY()
    URuntimeVideoRecorder* Recorder;
};

// SecurityCamera.cpp
ASecurityCamera::ASecurityCamera()
{
    RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    
    CameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("Camera"));
    CameraComponent->SetupAttachment(RootComponent);
    CameraComponent->SetFieldOfView(90.0f);
}

void ASecurityCamera::StartRecording()
{
    Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder && CameraComponent)
    {
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 8000000;  // Lower quality for security footage
        Settings.TargetQuality = 50;
        
        // Record from this camera's perspective
        bool bSuccess = Recorder->StartRecordingCamera(
            CameraComponent,
            TEXT("E:/SecurityFootage/camera_") + GetName() + TEXT(".mp4"),
            30,              // 30 FPS
            1280, 720,       // 720p is enough for security
            Settings,
            false,           // No audio needed
            false,           // Frame rate dependent
            false,           // Auto capture
            -1.0f,           // No circular buffer
            false,           // On-the-fly encoding
            nullptr,         // No audio
            100.0f           // Full quality
        );
        
        if (bSuccess)
        {
            UE_LOG(LogTemp, Log, TEXT("Security camera %s started recording"), *GetName());
        }
    }
}

void ASecurityCamera::StopRecording()
{
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        Recorder->StopRecording_NativeAPI();
        
        FString Path = Recorder->GetLastRecordingFilepath();
        UE_LOG(LogTemp, Log, TEXT("Security footage saved: %s"), *Path);
    }
}
```

## Usage in Level

1. Place `ASecurityCamera` actors in your level
2. Call `StartRecording()` when level starts
3. Call `StopRecording()` when level ends or on demand

## See Also

- [How-To Guide Index](./index) - Browse all scenarios
- [Quick Start](../quick-start) - Basic recording examples
- [API Reference](../api/runtime-video-recorder) - Complete method documentation

