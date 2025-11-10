# Create Crash Recovery System

**Scenario:** If the game crashes, save the last 60 seconds of gameplay automatically on next launch.

## Solution

```cpp
// CrashRecoverySystem.h
UCLASS()
class ACrashRecoverySystem : public AActor
{
    GENERATED_BODY()
    
public:
    virtual void BeginPlay() override;
    virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;
    
private:
    void CheckForCrashRecovery();
    void StartContinuousRecording();
    void WriteHeartbeat();
    
    UPROPERTY()
    URuntimeVideoRecorder* Recorder;
    
    FTimerHandle HeartbeatTimer;
    FString HeartbeatFilePath;
};

// CrashRecoverySystem.cpp
void ACrashRecoverySystem::BeginPlay()
{
    Super::BeginPlay();
    
    HeartbeatFilePath = FPaths::ProjectSavedDir() / TEXT("heartbeat.txt");
    
    // Check if previous session crashed
    CheckForCrashRecovery();
    
    // Start continuous recording with circular buffer
    StartContinuousRecording();
    
    // Write heartbeat every second
    GetWorld()->GetTimerManager().SetTimer(
        HeartbeatTimer,
        this,
        &ACrashRecoverySystem::WriteHeartbeat,
        1.0f,
        true
    );
}

void ACrashRecoverySystem::CheckForCrashRecovery()
{
    // Check if heartbeat file exists (indicates crash)
    if (FPaths::FileExists(HeartbeatFilePath))
    {
        UE_LOG(LogTemp, Warning, TEXT("Previous session crashed! Attempting to recover video..."));
        
        Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
        if (Recorder)
        {
            // Try to encode circular buffer from crashed session
            FString RecoveryPath = FPaths::ProjectSavedDir() / TEXT("CrashRecovery");
            
            bool bSuccess = Recorder->EncodeCircularBufferToVideo(RecoveryPath);
            
            if (bSuccess)
            {
                UE_LOG(LogTemp, Log, TEXT("Crash recovery video saved!"));
                
                // Show notification to player
                if (APlayerController* PC = GetWorld()->GetFirstPlayerController())
                {
                    PC->ClientMessage(TEXT("Previous session crashed. Last 60 seconds recovered."));
                }
            }
        }
        
        // Delete heartbeat file
        IFileManager::Get().Delete(*HeartbeatFilePath);
    }
}

void ACrashRecoverySystem::StartContinuousRecording()
{
    Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder)
    {
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 15000000;
        Settings.TargetQuality = 60;
        
        // Start recording with 60-second circular buffer
        bool bSuccess = Recorder->StartRecording(
            TEXT("%auto%"),
            30, 1920, 1080,
            Settings,
            true,            // Record UI
            true,            // Enable audio
            false,           // Frame rate dependent
            false,           // Auto capture
            60.0f,           // ← 60 second circular buffer
            false,           // On-the-fly encoding
            nullptr
        );
        
        if (bSuccess)
        {
            UE_LOG(LogTemp, Log, TEXT("Crash recovery system active (60s buffer)"));
        }
    }
}

void ACrashRecoverySystem::WriteHeartbeat()
{
    // Write current time to file (proves game is still running)
    FString TimeStamp = FDateTime::Now().ToString();
    FFileHelper::SaveStringToFile(TimeStamp, *HeartbeatFilePath);
}

void ACrashRecoverySystem::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
    // Normal shutdown - delete heartbeat file
    if (FPaths::FileExists(HeartbeatFilePath))
    {
        IFileManager::Get().Delete(*HeartbeatFilePath);
    }
    
    // Stop recording
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        Recorder->StopRecording_NativeAPI();
    }
    
    // Clear timer
    GetWorld()->GetTimerManager().ClearTimer(HeartbeatTimer);
    
    Super::EndPlay(EndPlayReason);
}
```

## How it Works

1. On startup, check for "heartbeat" file from previous session
2. If exists = previous session crashed without cleanup
3. Call `EncodeCircularBufferToVideo()` to save last 60 seconds
4. During gameplay, continuously record last 60 seconds in memory
5. Write heartbeat file every second (proves game is alive)
6. On normal shutdown, delete heartbeat file

## See Also

- [How-To Guide Index](./index) - Browse all scenarios
- [Quick Start](../quick-start) - Basic recording examples
- [API Reference](../api/runtime-video-recorder) - Complete method documentation

