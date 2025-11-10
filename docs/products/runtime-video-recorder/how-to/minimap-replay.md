# Record Minimap Replay

**Scenario:** Record a top-down minimap view to a separate video file for later analysis.

## Solution

```cpp
void AMinimapRecorder::StartMinimapRecording()
{
    // Create render target for minimap
    MinimapRenderTarget = NewObject<UTextureRenderTarget2D>();
    MinimapRenderTarget->InitAutoFormat(512, 512);  // 512x512 minimap
    MinimapRenderTarget->ClearColor = FLinearColor::Black;
    
    // Create minimap camera
    MinimapCamera = NewObject<UCameraComponent>(this);
    MinimapCamera->RegisterComponent();
    MinimapCamera->ProjectionMode = ECameraProjectionMode::Orthographic;
    MinimapCamera->OrthoWidth = 5000.0f;  // View width in world units
    
    // Position camera above the map
    APawn* PlayerPawn = GetWorld()->GetFirstPlayerController()->GetPawn();
    if (PlayerPawn)
    {
        FVector PlayerLoc = PlayerPawn->GetActorLocation();
        MinimapCamera->SetWorldLocation(FVector(PlayerLoc.X, PlayerLoc.Y, PlayerLoc.Z + 2000.0f));
        MinimapCamera->SetWorldRotation(FRotator(-90, 0, 0));  // Look straight down
    }
    
    // Capture scene to render target
    USceneCaptureComponent2D* SceneCapture = NewObject<USceneCaptureComponent2D>(this);
    SceneCapture->RegisterComponent();
    SceneCapture->TextureTarget = MinimapRenderTarget;
    SceneCapture->ProjectionType = ECameraProjectionMode::Orthographic;
    SceneCapture->OrthoWidth = 5000.0f;
    SceneCapture->SetWorldLocation(MinimapCamera->GetComponentLocation());
    SceneCapture->SetWorldRotation(MinimapCamera->GetComponentRotation());
    
    // Start recording the render target
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder)
    {
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 5000000;  // Lower bitrate for small resolution
        Settings.TargetQuality = 60;
        
        bool bSuccess = Recorder->StartRecordingRenderTarget(
            MinimapRenderTarget,
            TEXT("E:/Replays/minimap.mp4"),
            30,              // 30 FPS is enough
            512, 512,        // Match render target size
            Settings,
            false            // No audio for minimap
        );
        
        if (bSuccess)
        {
            UE_LOG(LogTemp, Log, TEXT("Minimap recording started"));
            
            // Update minimap position every frame
            GetWorld()->GetTimerManager().SetTimer(
                UpdateTimerHandle,
                this,
                &AMinimapRecorder::UpdateMinimapPosition,
                0.033f,  // ~30 FPS
                true
            );
        }
    }
}

void AMinimapRecorder::UpdateMinimapPosition()
{
    // Follow player
    APawn* PlayerPawn = GetWorld()->GetFirstPlayerController()->GetPawn();
    if (PlayerPawn && MinimapCamera)
    {
        FVector PlayerLoc = PlayerPawn->GetActorLocation();
        MinimapCamera->SetWorldLocation(FVector(PlayerLoc.X, PlayerLoc.Y, PlayerLoc.Z + 2000.0f));
    }
}
```

## See Also

- [How-To Guide Index](./index) - Browse all scenarios
- [Quick Start](../quick-start) - Basic recording examples
- [API Reference](../api/runtime-video-recorder) - Complete method documentation

