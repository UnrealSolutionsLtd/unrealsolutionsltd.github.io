# How-To Guide

Common scenarios and step-by-step solutions for Runtime Video Recorder.

---

## Q1: How do I record gameplay with a hotkey?

**Scenario:** Press F9 to start recording, F10 to stop, and show a notification when done.

### Blueprint Solution

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

### C++ Solution

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

---

## Q2: How do I record only the last 30 seconds (instant replay)?

**Scenario:** Continuously record the last 30 seconds. When player presses a key, save those 30 seconds.

### Solution

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

---

## Q3: How do I record a security camera view in-game?

**Scenario:** Record from a specific camera actor placed in the level (like a CCTV camera).

### Solution

```cpp
// SecurityCamera.h
UCLASS()
class ASecurityCamera : public AActor
{
    GENERATED_BODY()
    
public:
    ASecurityCamera();
    
    UFUNCTION(BlueprintCallable, Category = "Security")
    void StartRecording();
    
    UFUNCTION(BlueprintCallable, Category = "Security")
    void StopRecording();
    
protected:
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
    class UCameraComponent* CameraComponent;
    
    UPROPERTY()
    URuntimeVideoRecorder* Recorder;
};

// SecurityCamera.cpp
ASecurityCamera::ASecurityCamera()
{
    RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    
    CameraComponent = CreateDefaultSubobject<UCameraComponent>(TEXT("Camera"));
    CameraComponent->SetupAttachment(RootComponent);
    CameraComponent->SetFieldOfView(90.0f);
}

void ASecurityCamera::StartRecording()
{
    Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    
    if (Recorder && CameraComponent)
    {
        FRuntimeEncoderSettings Settings;
        Settings.VideoBitrate = 8000000;  // Lower quality for security footage
        Settings.TargetQuality = 50;
        
        // Record from this camera's perspective
        bool bSuccess = Recorder->StartRecordingCamera(
            CameraComponent,
            TEXT("E:/SecurityFootage/camera_") + GetName() + TEXT(".mp4"),
            30,              // 30 FPS
            1280, 720,       // 720p is enough for security
            Settings,
            false,           // No audio needed
            false,           // Frame rate dependent
            false,           // Auto capture
            -1.0f,           // No circular buffer
            false,           // On-the-fly encoding
            nullptr,         // No audio
            100.0f           // Full quality
        );
        
        if (bSuccess)
        {
            UE_LOG(LogTemp, Log, TEXT("Security camera %s started recording"), *GetName());
        }
    }
}

void ASecurityCamera::StopRecording()
{
    if (Recorder && Recorder->IsRecordingInProgress())
    {
        Recorder->StopRecording_NativeAPI();
        
        FString Path = Recorder->GetLastRecordingFilepath();
        UE_LOG(LogTemp, Log, TEXT("Security footage saved: %s"), *Path);
    }
}
```

**Usage in Level:**
1. Place `ASecurityCamera` actors in your level
2. Call `StartRecording()` when level starts
3. Call `StopRecording()` when level ends or on demand

---

## Q4: How do I create a "photo mode" that captures screenshots and videos?

**Scenario:** Press P to enter photo mode, then take screenshots or record videos with custom camera controls.

### Solution

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

---

## Q5: How do I record a time-lapse (1 frame per second)?

**Scenario:** Record 1 frame every second for a 30-minute gameplay session, resulting in a 30-second time-lapse video.

### Solution

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

---

## Q6: How do I record multiple camera angles simultaneously?

**Scenario:** Record a split-screen video showing 4 different camera angles at once (e.g., front, back, left, right).

### Solution

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

**Camera Setup in Level:**

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

---

## Q7: How do I record only music/sound effects without voice chat?

**Scenario:** In a multiplayer game, record gameplay audio but exclude voice chat from the recording.

### Solution

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

**Audio Setup Required:**

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

---

## Q8: How do I automatically record boss fights?

**Scenario:** Automatically start recording when a boss fight begins and stop when it ends.

### Solution

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

**Usage in Boss Blueprint:**

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

---

## Q9: How do I record a render target for a minimap replay?

**Scenario:** Record a top-down minimap view to a separate video file for later analysis.

### Solution

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

---

## Q10: How do I create a crash recovery system?

**Scenario:** If the game crashes, save the last 60 seconds of gameplay automatically on next launch.

### Solution

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

**How it works:**
1. On startup, check for "heartbeat" file from previous session
2. If exists = previous session crashed without cleanup
3. Call `EncodeCircularBufferToVideo()` to save last 60 seconds
4. During gameplay, continuously record last 60 seconds in memory
5. Write heartbeat file every second (proves game is alive)
6. On normal shutdown, delete heartbeat file
7. If crash occurs, heartbeat file remains → recovery on next launch

---

## See Also

- [Quick Start](./quick-start) - Basic recording examples
- [API Reference](./api/runtime-video-recorder) - Complete method documentation
- [Troubleshooting](./troubleshooting) - Common issues and solutions
- [Project Settings](./project-settings) - Global configuration options

