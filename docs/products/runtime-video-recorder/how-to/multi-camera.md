# Record Multiple Camera Angles

**Scenario:** Record a split-screen video showing 4 different camera angles at once (e.g., front, back, left, right).

## Solution

```cpp
void AMultiCameraRecorder::StartRecording()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder)
    {
        // Get all camera components
        TArray<UCameraComponent*> Cameras;
        
        // Assuming you have these cameras set up
        if (FrontCamera) Cameras.Add(FrontCamera);
        if (BackCamera) Cameras.Add(BackCamera);
        if (LeftCamera) Cameras.Add(LeftCamera);
        if (RightCamera) Cameras.Add(RightCamera);
        
        if (Cameras.Num() > 0)
        {
            FRuntimeEncoderSettings Settings;
            Settings.VideoBitrate = 30000000;  // Higher bitrate for multiple views
            Settings.TargetQuality = 75;
            
            // Record all cameras in grid layout (2x2 for 4 cameras)
            bool bSuccess = Recorder->StartRecordingMultipleCameras(
                Cameras,
                TEXT("E:/Replays/multicam.mp4"),
                30,              // 30 FPS
                1920, 1080,      // Total resolution (each camera will be 960x540)
                Settings,
                true,            // Enable audio
                false,           // Frame rate dependent
                false,           // Auto capture
                -1.0f,           // No circular buffer
                false,           // On-the-fly encoding
                nullptr,         // All audio
                100.0f           // Full quality
            );
            
            if (bSuccess)
            {
                UE_LOG(LogTemp, Log, TEXT("Multi-camera recording started with %d cameras"), Cameras.Num());
            }
        }
    }
}
```

## Camera Setup in Level

```cpp
void AMultiCameraRecorder::BeginPlay()
{
    Super::BeginPlay();
    
    // Create cameras around the player/subject
    APawn* PlayerPawn = GetWorld()->GetFirstPlayerController()->GetPawn();
    if (PlayerPawn)
    {
        FVector PlayerLoc = PlayerPawn->GetActorLocation();
        
        // Front camera
        FrontCamera = NewObject<UCameraComponent>(this);
        FrontCamera->RegisterComponent();
        FrontCamera->SetWorldLocation(PlayerLoc + FVector(300, 0, 100));
        FrontCamera->SetWorldRotation(FRotator(0, 180, 0));
        
        // Back camera
        BackCamera = NewObject<UCameraComponent>(this);
        BackCamera->RegisterComponent();
        BackCamera->SetWorldLocation(PlayerLoc + FVector(-300, 0, 100));
        BackCamera->SetWorldRotation(FRotator(0, 0, 0));
        
        // Left camera
        LeftCamera = NewObject<UCameraComponent>(this);
        LeftCamera->RegisterComponent();
        LeftCamera->SetWorldLocation(PlayerLoc + FVector(0, -300, 100));
        LeftCamera->SetWorldRotation(FRotator(0, 90, 0));
        
        // Right camera
        RightCamera = NewObject<UCameraComponent>(this);
        RightCamera->RegisterComponent();
        RightCamera->SetWorldLocation(PlayerLoc + FVector(0, 300, 100));
        RightCamera->SetWorldRotation(FRotator(0, -90, 0));
    }
}
```

## See Also

- [How-To Guide Index](./index) - Browse all scenarios
- [Quick Start](../quick-start) - Basic recording examples
- [API Reference](../api/runtime-video-recorder) - Complete method documentation

