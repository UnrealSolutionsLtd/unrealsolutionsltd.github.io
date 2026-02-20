# Record Last 30 Seconds (Instant Replay)

**Scenario:** Continuously record the last 30 seconds. When player presses a key, save those 30 seconds.

## Solution

```cpp
// Start circular buffer recording
void AGameMode::BeginPlay()
{
    Super::BeginPlay();
    
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder)
    {
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 20000000;
        
        // LastSecondsToRecord = 30.0f enables circular buffer
        Recorder->StartRecording(
            TEXT("%auto%"),
            30,              // 30 FPS
            1920, 1080,
            Settings,
            true,            // Record UI
            true,            // Enable audio
            false,           // Frame rate dependent
            false,           // Auto capture
            30.0f,           // ← Circular buffer: last 30 seconds
            false,           // On-the-fly encoding
            nullptr          // All audio
        );
        
        UE_LOG(LogTemp, Log, TEXT("Circular buffer recording started (last 30 seconds)"));
    }
}

// Save replay when player does something cool
void AMyCharacter::OnKillEnemy()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        // Stop recording - this saves the last 30 seconds
        Recorder->StopRecording_NativeAPI();
        
        UE_LOG(LogTemp, Log, TEXT("Saved last 30 seconds as replay!"));
        
        // Start recording again for next replay
        FTimerHandle TimerHandle;
        GetWorld()->GetTimerManager().SetTimer(TimerHandle, [this]()
        {
            // Restart circular buffer recording after previous one finishes
            AGameMode* GM = Cast<AGameMode>(GetWorld()->GetAuthGameMode());
            if (GM)
            {
                GM->BeginPlay(); // Restart recording
            }
        }, 2.0f, false);
    }
}
```

**Key Point:** With `LastSecondsToRecord = 30.0f`, RVR continuously records but only keeps the most recent 30 seconds in memory. When you stop, it saves those 30 seconds.

### Hitch-free option: async encode

To avoid a short frame hitch when saving the replay, use **EncodeCircularBufferToVideoAsync** instead of stopping and encoding. The buffer is snapshotted and encoded in the background while recording continues:

```cpp
// Save last 30 seconds without blocking (e.g. on "Save replay" button)
auto Future = Recorder->EncodeCircularBufferToVideoAsync(FPaths::ProjectSavedDir() / TEXT("Replay"));
Future.Next([](bool bSuccess) {
    if (bSuccess) UE_LOG(LogTemp, Log, TEXT("Replay saved!"));
});
```

See [EncodeCircularBufferToVideoAsync](../api/runtime-video-recorder#encodecircularbuffertovideoasync) in the API reference.

## See Also

- [How-To Guide Index](./index) - Browse all scenarios
- [Quick Start](../quick-start) - Basic recording examples
- [API Reference](../api/runtime-video-recorder) - Complete method documentation

