# Record Without Voice Chat

**Scenario:** In a multiplayer game, record gameplay audio but exclude voice chat from the recording.

## Solution

```cpp
void AGameRecorder::StartRecordingWithoutVoiceChat()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder)
    {
        // Get the master submix (everything except voice chat)
        // Assuming voice chat uses a separate submix
        USoundSubmix* MasterSubmix = LoadObject<USoundSubmix>(
            nullptr, 
            TEXT("/Game/Audio/MasterSubmix")
        );
        
        if (MasterSubmix)
        {
            FRuntimeEncoderSettings Settings;
            Settings.VideoBitrate = 20000000;
            Settings.TargetQuality = 75;
            
            // Record with specific submix only
            bool bSuccess = Recorder->StartRecording(
                TEXT("%auto%"),
                60, 1920, 1080,
                Settings,
                true,            // Record UI
                true,            // Enable audio
                false,           // Frame rate dependent
                false,           // Auto capture
                -1.0f,           // No circular buffer
                false,           // On-the-fly encoding
                MasterSubmix     // ← Only record this submix (no voice chat)
            );
            
            if (bSuccess)
            {
                UE_LOG(LogTemp, Log, TEXT("Recording started (music & SFX only, no voice chat)"));
            }
        }
    }
}
```

## Audio Setup Required

1. Create submixes:
   - `MasterSubmix` - For music and sound effects
   - `VoiceChatSubmix` - For voice chat only

2. Route audio appropriately:

```cpp
// Route game sounds to MasterSubmix
GameSound->SetSubmixSend(MasterSubmix);

// Route voice chat to VoiceChatSubmix
VoiceChatSound->SetSubmixSend(VoiceChatSubmix);
```

## See Also

- [How-To Guide Index](./index) - Browse all scenarios
- [Quick Start](../quick-start) - Basic recording examples
- [API Reference](../api/runtime-video-recorder) - Complete method documentation

