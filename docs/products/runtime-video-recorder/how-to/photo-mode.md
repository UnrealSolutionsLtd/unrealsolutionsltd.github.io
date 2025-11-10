# Create a Photo Mode

**Scenario:** Press P to enter photo mode, then take screenshots or record videos with custom camera controls.

## Solution

```cpp
// PhotoModeController.h
UCLASS()
class APhotoModeController : public AActor
{
    GENERATED_BODY()
    
public:
    UFUNCTION(BlueprintCallable, Category = "PhotoMode")
    void EnterPhotoMode();
    
    UFUNCTION(BlueprintCallable, Category = "PhotoMode")
    void ExitPhotoMode();
    
    UFUNCTION(BlueprintCallable, Category = "PhotoMode")
    void TakeScreenshot();
    
    UFUNCTION(BlueprintCallable, Category = "PhotoMode")
    void ToggleVideoRecording();
    
protected:
    UPROPERTY()
    UCameraComponent* PhotoCamera;
    
    UPROPERTY()
    URuntimeVideoRecorder* Recorder;
    
    UPROPERTY()
    APlayerController* PlayerController;
    
    bool bInPhotoMode = false;
    int32 ScreenshotCounter = 0;
};

// PhotoModeController.cpp
void APhotoModeController::EnterPhotoMode()
{
    bInPhotoMode = true;
    
    PlayerController = GetWorld()->GetFirstPlayerController();
    if (!PlayerController) return;
    
    // Create photo camera
    PhotoCamera = NewObject<UCameraComponent>(this);
    PhotoCamera->RegisterComponent();
    
    // Copy player camera transform
    FVector CamLoc;
    FRotator CamRot;
    PlayerController->GetPlayerViewPoint(CamLoc, CamRot);
    PhotoCamera->SetWorldLocationAndRotation(CamLoc, CamRot);
    
    // Pause game
    UGameplayStatics::SetGamePaused(GetWorld(), true);
    
    // Hide player pawn
    if (APawn* PlayerPawn = PlayerController->GetPawn())
    {
        PlayerPawn->SetActorHiddenInGame(true);
    }
    
    UE_LOG(LogTemp, Log, TEXT("Photo Mode enabled"));
}

void APhotoModeController::ExitPhotoMode()
{
    bInPhotoMode = false;
    
    // Stop recording if active
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        Recorder->StopRecording_NativeAPI();
    }
    
    // Unpause game
    UGameplayStatics::SetGamePaused(GetWorld(), false);
    
    // Show player pawn
    if (PlayerController)
    {
        if (APawn* PlayerPawn = PlayerController->GetPawn())
        {
            PlayerPawn->SetActorHiddenInGame(false);
        }
    }
    
    UE_LOG(LogTemp, Log, TEXT("Photo Mode disabled"));
}

void APhotoModeController::TakeScreenshot()
{
    if (!bInPhotoMode) return;
    
    Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder)
    {
        FString Filename = FString::Printf(
            TEXT("E:/Screenshots/photo_%03d.png"), 
            ScreenshotCounter++
        );
        
        Recorder->MakeScreenshot(Filename, false); // Don't show UI
        
        UE_LOG(LogTemp, Log, TEXT("Screenshot saved: %s"), *Filename);
    }
}

void APhotoModeController::ToggleVideoRecording()
{
    if (!bInPhotoMode || !PhotoCamera) return;
    
    Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (!Recorder) return;
    
    if (Recorder->IsRecordingInProgress())
    {
        // Stop recording
        Recorder->StopRecording_NativeAPI();
        UE_LOG(LogTemp, Log, TEXT("Photo mode video stopped"));
    }
    else
    {
        // Start recording from photo camera
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 30000000;  // High quality
        Settings.TargetQuality = 85;
        Settings.Profile = ERuntimeEncoderProfile::Profile_High;
        
        Recorder->StartRecordingCamera(
            PhotoCamera,
            TEXT("%auto%"),
            60, 3840, 2160,  // 4K 60fps
            Settings,
            false            // No audio in photo mode
        );
        
        UE_LOG(LogTemp, Log, TEXT("Photo mode video started"));
    }
}
```

## See Also

- [How-To Guide Index](./index) - Browse all scenarios
- [Quick Start](../quick-start) - Basic recording examples
- [API Reference](../api/runtime-video-recorder) - Complete method documentation

