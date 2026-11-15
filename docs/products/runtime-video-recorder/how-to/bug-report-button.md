# Bug Report Button (Last 60 Seconds of Video)

**Scenario:** A tester presses a button. The last 60 seconds of gameplay are saved as an MP4 and uploaded with the bug ticket. No more "cannot reproduce".

Works in the Editor and in packaged builds on Windows, MacOS, Linux, iOS, Android and Meta Quest.

## How it works

1. When the game starts, RVR keeps the last 60 seconds in a ring buffer in memory.
2. When the tester presses the bug button, RVR encodes that buffer to an MP4 in the background. Recording keeps running, so there is no frame hitch.
3. Your code uploads the MP4 to your bug tracker or backend.

## Step 1 - Start the ring buffer

Start it once, for example in your Game Instance or Game Mode.

```cpp
void UMyGameInstance::StartBugCapture()
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (!Recorder || Recorder->IsRecordingInProgress())
    {
        return;
    }

    FRuntimeEncoderSettings Settings;
    Settings.VideoBitrate = 8000000;   // 8 Mbps is plenty for bug clips

    Recorder->StartRecording(
        TEXT("%auto%"),
        30,              // 30 FPS
        1280, 720,       // 720p keeps memory and upload size small
        Settings,
        true,            // Record UI
        true,            // Record audio
        false,           // Frame rate independent
        false,           // Manual capture only
        60.0f,           // Ring buffer: keep the last 60 seconds
        false,           // Postpone encoding
        nullptr          // All audio
    );
}
```

## Step 2 - Save the clip when the button is pressed

`EncodeCircularBufferToVideoAsync` takes a snapshot of the buffer and encodes it in the background. Call it on the Game Thread.

```cpp
void UMyGameInstance::ReportBug(const FString& Description)
{
    URuntimeVideoRecorder* Recorder = GEngine->GetEngineSubsystem<URuntimeVideoRecorder>();
    if (!Recorder || !Recorder->IsRecordingInProgress())
    {
        return;
    }

    const FString ClipPath = FPaths::ProjectSavedDir() / TEXT("BugReports")
        / (FDateTime::Now().ToString() + TEXT(".mp4"));

    Recorder->EncodeCircularBufferToVideoAsync(ClipPath).Next(
        [this, ClipPath, Description](bool bSuccess)
        {
            if (!bSuccess)
            {
                UE_LOG(LogTemp, Warning, TEXT("Bug clip failed to encode"));
                return;
            }
            // Go back to the Game Thread before touching game objects or HTTP
            AsyncTask(ENamedThreads::GameThread, [this, ClipPath, Description]()
            {
                UploadBugReport(ClipPath, Description);
            });
        });
}
```

**Blueprint:** use the **Encode Circular Buffer to Video Async** node (RuntimeVideoRecorder | Circular Buffer) and continue from its **On Completed** pin.

## Step 3 - Upload the clip

Send the file to your own endpoint. Replace the URL and headers with your bug tracker's upload API.

```cpp
#include "HttpModule.h"
#include "Interfaces/IHttpRequest.h"
#include "Interfaces/IHttpResponse.h"
#include "Misc/FileHelper.h"

void UMyGameInstance::UploadBugReport(const FString& ClipPath, const FString& Description)
{
    TArray<uint8> Bytes;
    if (!FFileHelper::LoadFileToArray(Bytes, *ClipPath))
    {
        return;
    }

    TSharedRef<IHttpRequest, ESPMode::ThreadSafe> Request = FHttpModule::Get().CreateRequest();
    Request->SetURL(TEXT("https://bugs.example.com/api/upload"));   // your endpoint
    Request->SetVerb(TEXT("POST"));
    Request->SetHeader(TEXT("Content-Type"), TEXT("video/mp4"));
    Request->SetHeader(TEXT("X-Bug-Description"), Description);
    Request->SetContent(MoveTemp(Bytes));
    Request->OnProcessRequestComplete().BindLambda(
        [](FHttpRequestPtr, FHttpResponsePtr Response, bool bOk)
        {
            UE_LOG(LogTemp, Log, TEXT("Bug clip upload %s"), bOk ? TEXT("done") : TEXT("failed"));
        });
    Request->ProcessRequest();
}
```

Add `"HTTP"` to `PublicDependencyModuleNames` in your `.Build.cs`.

## Tips

- **Memory:** the buffer lives in memory. 720p at 30 FPS for 60 seconds is a good default on mobile. Lower the resolution or the duration on low-end devices.
- **Build types:** start the buffer only in development, QA and playtest builds, for example behind `#if !UE_BUILD_SHIPPING`. Shipping it to players needs a license that includes redistribution. See [Licensing](https://unrealsolutions.com/licensing).
- **Attach context:** send the build number, map name and player position with the clip so the ticket is complete.
- **Automated tests:** call `ReportBug` from a failed test to attach video to the failure.

## See Also

- [Instant Replay](./instant-replay) - the same ring buffer for player-facing replays
- [EncodeCircularBufferToVideoAsync](../api/runtime-video-recorder#encodecircularbuffertovideoasync) - API reference
- [Crash Recovery](./crash-recovery) - keep footage when the game crashes
