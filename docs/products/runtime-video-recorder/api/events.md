# Events & Delegates

Runtime Video Recorder provides Blueprint-assignable delegates for monitoring recording lifecycle.

## Available Events

### OnRecordingStarted

Fired when recording begins.

```cpp
UPROPERTY(BlueprintAssignable, Category = "RuntimeVideoRecorder")
FOnRuntimeRecordingEvent OnRecordingStarted;
```

#### Use Cases
- Show recording indicator UI
- Disable certain game features during recording
- Log recording start time
- Send analytics events

#### Blueprint Example

```blueprint
Event BeginPlay
  → Get Engine Subsystem (RuntimeVideoRecorder)
  → Bind Event to OnRecordingStarted
    → Custom Event: HandleRecordingStarted
      → Show Recording Indicator Widget
      → Print String "Recording Started"
```

#### C++ Example

```cpp
void AMyActor::BeginPlay()
{
    Super::BeginPlay();
    
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder)
    {
        Recorder->OnRecordingStarted.AddDynamic(this, &AMyActor::HandleRecordingStarted);
    }
}

UFUNCTION()
void AMyActor::HandleRecordingStarted()
{
    UE_LOG(LogTemp, Log, TEXT("Recording has started!"));
    
    // Show UI indicator
    if (RecordingIndicatorWidget)
    {
        RecordingIndicatorWidget->SetVisibility(ESlateVisibility::Visible);
    }
    
    // Disable screenshot keys during recording
    bAllowScreenshots = false;
}
```

---

### OnRecordingFinished

Fired when recording completes.

```cpp
UPROPERTY(BlueprintAssignable, Category = "RuntimeVideoRecorder")
FOnRuntimeRecordingEvent OnRecordingFinished;
```

#### Use Cases
- Hide recording indicator UI
- Re-enable disabled features
- Get output filepath and show notification
- Upload video to server
- Play video in-game

#### Blueprint Example

```blueprint
Event BeginPlay
  → Get Engine Subsystem (RuntimeVideoRecorder)
  → Bind Event to OnRecordingFinished
    → Custom Event: HandleRecordingFinished
      → Hide Recording Indicator Widget
      → Get Last Recording Filepath
      → Show Notification ("Video saved to: " + Filepath)
```

#### C++ Example

```cpp
void AMyActor::BeginPlay()
{
    Super::BeginPlay();
    
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder)
    {
        Recorder->OnRecordingFinished.AddDynamic(this, &AMyActor::HandleRecordingFinished);
    }
}

UFUNCTION()
void AMyActor::HandleRecordingFinished()
{
    UE_LOG(LogTemp, Log, TEXT("Recording has finished!"));
    
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder)
    {
        FString OutputPath = Recorder->GetLastRecordingFilepath();
        UE_LOG(LogTemp, Log, TEXT("Video saved to: %s"), *OutputPath);
        
        // Show in-game notification
        ShowNotification(FText::FromString(FString::Printf(
            TEXT("Recording saved: %s"), 
            *FPaths::GetCleanFilename(OutputPath)
        )));
    }
    
    // Hide UI indicator
    if (RecordingIndicatorWidget)
    {
        RecordingIndicatorWidget->SetVisibility(ESlateVisibility::Hidden);
    }
    
    // Re-enable features
    bAllowScreenshots = true;
}
```

---

### OnPreviewStarted

Fired when camera preview starts.

```cpp
UPROPERTY(BlueprintAssignable, Category = "RuntimeVideoRecorder")
FOnRuntimeRecordingEvent OnPreviewStarted;
```

#### Use Cases
- Show preview window UI
- Get preview render target for display
- Update UI state

#### Example

```cpp
UFUNCTION()
void AMyActor::HandlePreviewStarted()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (Recorder)
    {
        UTextureRenderTarget2D* PreviewRT = Recorder->GetCameraPreviewRenderTarget();
        
        // Display in UI
        if (PreviewImageWidget && PreviewRT)
        {
            PreviewImageWidget->SetBrushFromTexture(PreviewRT);
            PreviewImageWidget->SetVisibility(ESlateVisibility::Visible);
        }
    }
}
```

---

### OnPreviewStopped

Fired when camera preview stops.

```cpp
UPROPERTY(BlueprintAssignable, Category = "RuntimeVideoRecorder")
FOnRuntimeRecordingEvent OnPreviewStopped;
```

#### Use Cases
- Hide preview window UI
- Clean up preview resources
- Update UI state

#### Example

```cpp
UFUNCTION()
void AMyActor::HandlePreviewStopped()
{
    // Hide preview UI
    if (PreviewImageWidget)
    {
        PreviewImageWidget->SetVisibility(ESlateVisibility::Hidden);
    }
    
    UE_LOG(LogTemp, Log, TEXT("Camera preview stopped"));
}
```

---

## Complete Example: Recording Manager

Here's a complete example of a recording manager that uses all events:

### Blueprint (Pseudocode)

```blueprint
// Recording Manager Actor

// Variables
- bIsRecording: Boolean = false
- RecordingStartTime: Float = 0.0
- RecordingIndicator: Widget Reference

// Event BeginPlay
  → Get Engine Subsystem (RuntimeVideoRecorder)
  → Store as variable: RecorderRef
  
  → Bind Event to OnRecordingStarted → HandleRecordingStarted
  → Bind Event to OnRecordingFinished → HandleRecordingFinished

// Custom Event: HandleRecordingStarted
  → Set bIsRecording = true
  → Set RecordingStartTime = Get Game Time In Seconds
  → Create Widget (RecordingIndicator)
  → Add to Viewport
  → Start Timer (UpdateRecordingTime, 0.1s, Looping)

// Custom Event: HandleRecordingFinished
  → Set bIsRecording = false
  → Remove Widget from Parent (RecordingIndicator)
  → Clear Timer (UpdateRecordingTime)
  → Get Last Recording Filepath
  → Show Notification ("Video Saved!")

// Custom Event: UpdateRecordingTime
  → Calculate Duration = Get Game Time - RecordingStartTime
  → Update Widget Text = Format Time (Duration)
```

### C++ Implementation

```cpp
// RecordingManager.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "RuntimeVideoRecorder.h"
#include "RecordingManager.generated.h"

UCLASS()
class ARecordingManager : public AActor
{
    GENERATED_BODY()
    
public:
    ARecordingManager();
    
protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;
    
    // Event handlers
    UFUNCTION()
    void HandleRecordingStarted();
    
    UFUNCTION()
    void HandleRecordingFinished();
    
    UFUNCTION()
    void HandlePreviewStarted();
    
    UFUNCTION()
    void HandlePreviewStopped();
    
    // Recording control
    UFUNCTION(BlueprintCallable, Category = "Recording")
    void StartRecording();
    
    UFUNCTION(BlueprintCallable, Category = "Recording")
    void StopRecording();
    
    UFUNCTION(BlueprintCallable, Category = "Recording")
    bool IsRecording() const { return bIsRecording; }
    
private:
    UPROPERTY()
    URuntimeVideoRecorder* Recorder;
    
    bool bIsRecording = false;
    float RecordingStartTime = 0.0f;
    
    UPROPERTY(EditAnywhere, Category = "UI")
    TSubclassOf<class UUserWidget> RecordingIndicatorClass;
    
    UPROPERTY()
    class UUserWidget* RecordingIndicator;
};

// RecordingManager.cpp
#include "RecordingManager.h"
#include "Blueprint/UserWidget.h"
#include "Kismet/GameplayStatics.h"

ARecordingManager::ARecordingManager()
{
    PrimaryActorTick.bCanEverTick = true;
}

void ARecordingManager::BeginPlay()
{
    Super::BeginPlay();
    
    // Get recorder subsystem
    Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder)
    {
        // Bind to events
        Recorder->OnRecordingStarted.AddDynamic(this, &ARecordingManager::HandleRecordingStarted);
        Recorder->OnRecordingFinished.AddDynamic(this, &ARecordingManager::HandleRecordingFinished);
        Recorder->OnPreviewStarted.AddDynamic(this, &ARecordingManager::HandlePreviewStarted);
        Recorder->OnPreviewStopped.AddDynamic(this, &ARecordingManager::HandlePreviewStopped);
    }
}

void ARecordingManager::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
    
    // Update recording time display
    if (bIsRecording && RecordingIndicator)
    {
        float Duration = UGameplayStatics::GetTimeSeconds(this) - RecordingStartTime;
        // Update widget with duration (implement in widget class)
    }
}

void ARecordingManager::HandleRecordingStarted()
{
    UE_LOG(LogTemp, Log, TEXT("Recording started!"));
    
    bIsRecording = true;
    RecordingStartTime = UGameplayStatics::GetTimeSeconds(this);
    
    // Create and show recording indicator UI
    if (RecordingIndicatorClass)
    {
        RecordingIndicator = CreateWidget<UUserWidget>(GetWorld(), RecordingIndicatorClass);
        if (RecordingIndicator)
        {
            RecordingIndicator->AddToViewport();
        }
    }
    
    // Optional: Disable screenshot feature during recording
    // Optional: Send analytics event
}

void ARecordingManager::HandleRecordingFinished()
{
    UE_LOG(LogTemp, Log, TEXT("Recording finished!"));
    
    bIsRecording = false;
    
    // Hide recording indicator
    if (RecordingIndicator)
    {
        RecordingIndicator->RemoveFromParent();
        RecordingIndicator = nullptr;
    }
    
    // Get output path and show notification
    if (Recorder)
    {
        FString OutputPath = Recorder->GetLastRecordingFilepath();
        UE_LOG(LogTemp, Log, TEXT("Video saved to: %s"), *OutputPath);
        
        // Show in-game notification
        // ShowNotification(FString::Printf(TEXT("Video saved: %s"), *FPaths::GetCleanFilename(OutputPath)));
    }
    
    // Optional: Upload to server
    // Optional: Send analytics event
}

void ARecordingManager::HandlePreviewStarted()
{
    UE_LOG(LogTemp, Log, TEXT("Camera preview started"));
}

void ARecordingManager::HandlePreviewStopped()
{
    UE_LOG(LogTemp, Log, TEXT("Camera preview stopped"));
}

void ARecordingManager::StartRecording()
{
    if (Recorder && !Recorder->IsRecordingInProgress())
    {
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 20000000;
        Settings.TargetQuality = 75;
        
        Recorder->StartRecording(
            TEXT("%auto%"),
            60, 1920, 1080,
            Settings,
            true,  // Record UI
            true   // Enable audio
        );
    }
}

void ARecordingManager::StopRecording()
{
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        Recorder->StopRecording_NativeAPI();
    }
}
```

---

## Best Practices

### 1. Always Check for Null

```cpp
URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
if (Recorder)  // Always check!
{
    Recorder->OnRecordingStarted.AddDynamic(this, &AMyClass::HandleStart);
}
```

### 2. Unbind in EndPlay

```cpp
void AMyActor::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
    if (Recorder)
    {
        Recorder->OnRecordingStarted.RemoveDynamic(this, &AMyActor::HandleRecordingStarted);
        Recorder->OnRecordingFinished.RemoveDynamic(this, &AMyActor::HandleRecordingFinished);
    }
    
    Super::EndPlay(EndPlayReason);
}
```

### 3. Use UFUNCTION() for Event Handlers

```cpp
// Must be UFUNCTION() to work with AddDynamic
UFUNCTION()
void HandleRecordingStarted();
```

### 4. Keep Event Handlers Lightweight

```cpp
// Good: Fast operation
void HandleRecordingStarted()
{
    bIsRecording = true;
    ShowRecordingUI();
}

// Bad: Slow operation
void HandleRecordingFinished()
{
    // Don't do heavy work synchronously!
    // UploadVideoToServer();  // This could take seconds!
    
    // Instead, start async operation
    StartAsyncUpload();
}
```

---

## See Also

- [URuntimeVideoRecorder API](./runtime-video-recorder) - Main API reference
- [Quick Start](../quick-start) - Getting started guide
- [Troubleshooting](../troubleshooting) - Common issues

