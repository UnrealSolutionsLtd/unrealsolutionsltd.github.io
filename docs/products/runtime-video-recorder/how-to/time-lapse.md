# Record a Time-Lapse

**Scenario:** Record 1 frame every second for a 30-minute gameplay session, resulting in a 30-second time-lapse video.

## Solution

```cpp
void ATimeLapseRecorder::StartTimeLapse()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder)
    {
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 15000000;
        Settings.TargetQuality = 70;
        
        // Start in MANUAL capture mode
        bool bSuccess = Recorder->StartRecording(
            TEXT("E:/TimeLapse/timelapse.mp4"),
            30,              // Output will be 30 FPS
            1920, 1080,
            Settings,
            false,           // No UI
            false,           // No audio for timelapse
            false,           // Frame rate dependent
            true,            // ← MANUAL CAPTURE ONLY!
            -1.0f,           // No circular buffer
            false,           // On-the-fly encoding
            nullptr
        );
        
        if (bSuccess)
        {
            // Set up timer to capture 1 frame per second
            GetWorld()->GetTimerManager().SetTimer(
                CaptureTimerHandle,
                this,
                &ATimeLapseRecorder::CaptureFrame,
                1.0f,            // Every 1 second
                true             // Looping
            );
            
            UE_LOG(LogTemp, Log, TEXT("Time-lapse recording started"));
        }
    }
}

void ATimeLapseRecorder::CaptureFrame()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        Recorder->CaptureSingleFrame();
        FramesCaptured++;
        
        // Optional: Log progress
        if (FramesCaptured % 60 == 0)
        {
            UE_LOG(LogTemp, Log, TEXT("Time-lapse: %d frames captured"), FramesCaptured);
        }
    }
}

void ATimeLapseRecorder::StopTimeLapse()
{
    GetWorld()->GetTimerManager().ClearTimer(CaptureTimerHandle);
    
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        Recorder->StopRecording_NativeAPI();
        
        FString Path = Recorder->GetLastRecordingFilepath();
        UE_LOG(LogTemp, Log, TEXT("Time-lapse saved: %s (%d frames)"), *Path, FramesCaptured);
    }
}
```

**Result:** 1800 seconds (30 minutes) captured at 1 frame/sec = 1800 frames. At 30 FPS output = 60 second video showing 30 minutes in 1 minute!

## See Also

- [How-To Guide Index](./index) - Browse all scenarios
- [Quick Start](../quick-start) - Basic recording examples
- [API Reference](../api/runtime-video-recorder) - Complete method documentation

