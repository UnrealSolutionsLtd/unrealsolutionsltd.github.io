# Record Gameplay with a Hotkey

**Scenario:** Press F9 to start recording, F10 to stop, and show a notification when done.

## Blueprint Solution

```
// In your Player Controller or Game Mode Blueprint

// Variables
- RecorderRef: Runtime Video Recorder (Object Reference)
- bIsRecording: Boolean = false

// Event BeginPlay
  → Get Engine Subsystem (RuntimeVideoRecorder)
  → Set RecorderRef

// Input Action "StartRecording" (F9)
  → Branch (bIsRecording)
    - False:
      → RecorderRef → StartRecording
        OutFilename: "%auto%"
        TargetFPS: 60
        Width: 1920
        Height: 1080
        EncoderSettings: (Default)
        RecordUI: true
        EnableAudioRecording: true
      → Set bIsRecording = true
      → Print String "Recording Started"

// Input Action "StopRecording" (F10)
  → Branch (bIsRecording)
    - True:
      → RecorderRef → StopRecording
      → Set bIsRecording = false
      → RecorderRef → Get Last Recording Filepath
      → Print String ("Video saved: " + Filepath)
```

## C++ Solution

```cpp
// MyPlayerController.h
UCLASS()
class AMyPlayerController : public APlayerController
{
    GENERATED_BODY()
    
protected:
    virtual void SetupInputComponent() override;
    
private:
    void ToggleRecording();
    
    UPROPERTY()
    URuntimeVideoRecorder* Recorder;
};

// MyPlayerController.cpp
void AMyPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();
    
    InputComponent->BindAction("ToggleRecording", IE_Pressed, this, &AMyPlayerController::ToggleRecording);
}

void AMyPlayerController::ToggleRecording()
{
    if (!Recorder)
    {
        Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    }
    
    if (!Recorder) return;
    
    if (Recorder->IsRecordingInProgress())
    {
        // Stop recording
        Recorder->StopRecording_NativeAPI();
        
        FString Path = Recorder->GetLastRecordingFilepath();
        UE_LOG(LogTemp, Log, TEXT("Video saved: %s"), *Path);
        
        // Show notification
        if (APlayerController* PC = GetWorld()->GetFirstPlayerController())
        {
            PC->ClientMessage(FString::Printf(TEXT("Video saved: %s"), *FPaths::GetCleanFilename(Path)));
        }
    }
    else
    {
        // Start recording
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 20000000;
        Settings.TargetQuality = 75;
        
        bool bSuccess = Recorder->StartRecording(
            TEXT("%auto%"),
            60, 1920, 1080,
            Settings,
            true, true
        );
        
        if (bSuccess)
        {
            UE_LOG(LogTemp, Log, TEXT("Recording started"));
        }
    }
}
```

## See Also

- [How-To Guide Index](./index) - Browse all scenarios
- [Quick Start](../quick-start) - Basic recording examples
- [API Reference](../api/runtime-video-recorder) - Complete method documentation

