# Automatically Record Boss Fights

**Scenario:** Automatically start recording when a boss fight begins and stop when it ends.

## Solution

```cpp
// BossFightRecorder.h
UCLASS()
class ABossFightRecorder : public AActor
{
    GENERATED_BODY()
    
public:
    UFUNCTION(BlueprintCallable, Category = "Recording")
    void OnBossFightStart(const FString& BossName);
    
    UFUNCTION(BlueprintCallable, Category = "Recording")
    void OnBossFightEnd(bool bPlayerWon);
    
private:
    UPROPERTY()
    URuntimeVideoRecorder* Recorder;
    
    FString CurrentBossName;
    FDateTime RecordingStartTime;
};

// BossFightRecorder.cpp
void ABossFightRecorder::OnBossFightStart(const FString& BossName)
{
    Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder && !Recorder->IsRecordingInProgress())
    {
        CurrentBossName = BossName;
        RecordingStartTime = FDateTime::Now();
        
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 25000000;  // High quality for boss fights
        Settings.TargetQuality = 80;
        Settings.Profile = ERuntimeEncoderProfile::Profile_High;
        
        // Generate filename with boss name and timestamp
        FString Filename = FString::Printf(
            TEXT("E:/BossFights/%s_%s.mp4"),
            *BossName.Replace(TEXT(" "), TEXT("_")),
            *RecordingStartTime.ToString(TEXT("%Y%m%d_%H%M%S"))
        );
        
        bool bSuccess = Recorder->StartRecording(
            Filename,
            60,              // 60 FPS for epic boss fights
            1920, 1080,
            Settings,
            true,            // Record UI (health bars, etc.)
            true             // Enable audio (boss music!)
        );
        
        if (bSuccess)
        {
            UE_LOG(LogTemp, Log, TEXT("Started recording boss fight: %s"), *BossName);
            
            // Optional: Show recording indicator
            if (APlayerController* PC = GetWorld()->GetFirstPlayerController())
            {
                PC->ClientMessage(FString::Printf(TEXT("Recording: %s"), *BossName));
            }
        }
    }
}

void ABossFightRecorder::OnBossFightEnd(bool bPlayerWon)
{
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        Recorder->StopRecording_NativeAPI();
        
        FString Result = bPlayerWon ? TEXT("Victory") : TEXT("Defeat");
        FString Path = Recorder->GetLastRecordingFilepath();
        
        UE_LOG(LogTemp, Log, TEXT("Boss fight recording complete: %s - %s"), *CurrentBossName, *Result);
        UE_LOG(LogTemp, Log, TEXT("Saved to: %s"), *Path);
        
        // Optional: Add result to filename
        FString NewPath = Path.Replace(TEXT(".mp4"), *FString::Printf(TEXT("_%s.mp4"), *Result));
        IFileManager::Get().Move(*NewPath, *Path);
        
        // Show notification
        if (APlayerController* PC = GetWorld()->GetFirstPlayerController())
        {
            PC->ClientMessage(FString::Printf(TEXT("Boss fight saved: %s"), *Result));
        }
    }
}
```

## Usage in Boss Blueprint

```
// Boss Actor Blueprint

// Event: Boss Health <= 0
  → Cast to BossFightRecorder
  → OnBossFightEnd (bPlayerWon = true)

// Event: Player Health <= 0
  → Cast to BossFightRecorder
  → OnBossFightEnd (bPlayerWon = false)

// Event: Boss Spawned
  → Cast to BossFightRecorder
  → OnBossFightStart (BossName = "Dragon King")
```

## See Also

- [How-To Guide Index](./index) - Browse all scenarios
- [Quick Start](../quick-start) - Basic recording examples
- [API Reference](../api/runtime-video-recorder) - Complete method documentation

