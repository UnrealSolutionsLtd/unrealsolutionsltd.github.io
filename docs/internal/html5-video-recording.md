# Video Recording for HTML5 Games

How to capture gameplay video from browser-based games, and whether hardware acceleration is possible.

## The Short Answer

**Yes, hardware-accelerated video recording is possible for HTML5 games** — but it depends on browser support and requires the newer WebCodecs API. The traditional MediaRecorder approach is software-only.

---

## Recording Methods

### 1. MediaRecorder API (Traditional)

The standard approach for recording canvas/WebGL content in browsers.

```javascript
// Get canvas stream
const canvas = document.getElementById('gameCanvas');
const stream = canvas.captureStream(60); // 60 FPS

// Create recorder
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'video/webm;codecs=vp9',
  videoBitsPerSecond: 8000000 // 8 Mbps
});

// Collect chunks
const chunks = [];
mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

// On stop, create video file
mediaRecorder.onstop = () => {
  const blob = new Blob(chunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  // Download or upload the video
};

// Start/stop recording
mediaRecorder.start();
// ... later
mediaRecorder.stop();
```

**Pros:**
- Wide browser support (Chrome, Firefox, Edge, Safari)
- Simple API
- Works with any canvas/WebGL content

**Cons:**
- Software encoding only (CPU-bound)
- Limited codec support (WebM/VP8/VP9, some browsers support H.264)
- Can impact game performance on lower-end devices
- No direct GPU encoder access

---

### 2. WebCodecs API (Hardware Accelerated)

The newer WebCodecs API provides low-level access to video encoders, including hardware encoders.

```javascript
// Check for hardware acceleration support
const encoderConfig = {
  codec: 'avc1.42E01E', // H.264 Baseline
  width: 1920,
  height: 1080,
  bitrate: 8_000_000,
  framerate: 60,
  hardwareAcceleration: 'prefer-hardware' // Key setting!
};

// Check if hardware encoding is supported
const support = await VideoEncoder.isConfigSupported(encoderConfig);
console.log('Hardware acceleration:', support.config.hardwareAcceleration);

// Create encoder
const encoder = new VideoEncoder({
  output: (chunk, metadata) => {
    // Handle encoded video chunk
    // Write to file, stream, etc.
  },
  error: (e) => console.error('Encoder error:', e)
});

encoder.configure(encoderConfig);

// Encode frames from canvas
function captureFrame() {
  const bitmap = await createImageBitmap(canvas);
  const frame = new VideoFrame(bitmap, { timestamp: performance.now() * 1000 });
  encoder.encode(frame);
  frame.close();
}
```

**Pros:**
- Hardware acceleration when available (uses GPU encoder)
- H.264/H.265/AV1 codec support
- Lower CPU overhead
- Better performance for high-resolution/high-framerate capture

**Cons:**
- Limited browser support (Chrome 94+, Edge 94+, no Firefox/Safari yet)
- More complex API
- Requires manual muxing (combining video chunks into container format)
- Hardware support varies by device

---

## Hardware Acceleration Support

### What "Hardware Accelerated" Means

Hardware-accelerated encoding uses dedicated video encoding circuits (like NVIDIA NVENC, Intel QuickSync, AMD VCE) instead of the CPU. This results in:

- **Lower CPU usage** — game performance less impacted
- **Faster encoding** — can handle higher resolutions/framerates
- **Better battery life** — especially important for mobile/laptop

### Browser Support Matrix

| Browser | MediaRecorder | WebCodecs | HW Acceleration |
|---------|--------------|-----------|-----------------|
| Chrome 94+ | ✅ | ✅ | ✅ (via WebCodecs) |
| Edge 94+ | ✅ | ✅ | ✅ (via WebCodecs) |
| Firefox | ✅ | ❌ | ❌ |
| Safari | ✅ (limited) | ❌ | ❌ |

### Checking Hardware Acceleration

```javascript
async function checkHardwareEncoder() {
  const config = {
    codec: 'avc1.42E01E',
    width: 1920,
    height: 1080,
    bitrate: 5_000_000,
    framerate: 60,
    hardwareAcceleration: 'prefer-hardware'
  };
  
  const support = await VideoEncoder.isConfigSupported(config);
  
  if (support.supported) {
    console.log('Encoding supported');
    console.log('Hardware acceleration:', 
      support.config.hardwareAcceleration === 'prefer-hardware' 
        ? 'Available' 
        : 'Not available (falling back to software)'
    );
  }
}
```

---

## Practical Recommendations

### For Maximum Compatibility
Use **MediaRecorder** with WebM/VP9. Works everywhere, acceptable quality, but software-only.

### For Best Performance (Chrome/Edge)
Use **WebCodecs** with `hardwareAcceleration: 'prefer-hardware'`. Falls back to software if hardware unavailable.

### For Production Games
Consider a hybrid approach:
1. Detect WebCodecs support
2. Check hardware encoder availability
3. Fall back to MediaRecorder if needed

```javascript
async function createRecorder(canvas) {
  // Try WebCodecs with hardware acceleration first
  if ('VideoEncoder' in window) {
    const hwSupport = await checkHardwareSupport();
    if (hwSupport) {
      return new WebCodecsRecorder(canvas, { hardware: true });
    }
  }
  
  // Fall back to MediaRecorder
  return new MediaRecorderWrapper(canvas);
}
```

---

## Performance Comparison

| Method | CPU Usage | Quality | Latency | Browser Support |
|--------|-----------|---------|---------|-----------------|
| MediaRecorder (VP9) | High | Good | Low | Excellent |
| MediaRecorder (H.264) | Medium | Good | Low | Good (not Firefox) |
| WebCodecs (Software) | High | Excellent | Very Low | Chrome/Edge only |
| WebCodecs (Hardware) | **Low** | Excellent | Very Low | Chrome/Edge + GPU |

---

## Limitations vs Native Recording

HTML5/browser recording will always have limitations compared to native/in-engine recording:

| Aspect | Browser Recording | Native/In-Engine |
|--------|------------------|------------------|
| Hardware access | Limited (via WebCodecs) | Full GPU encoder access |
| Codec support | WebM, limited H.264 | Any codec |
| Performance overhead | Noticeable | Minimal (1-3%) |
| Mobile support | Very limited | Full (with right tools) |
| Audio capture | Possible but complex | Integrated |
| Output format | WebM primarily | MP4, MOV, any |

---

## Summary

- **Yes**, hardware-accelerated video recording is possible for HTML5 games
- **WebCodecs API** is required for hardware acceleration
- **Browser support is limited** — Chrome/Edge only currently
- **MediaRecorder** works everywhere but is CPU-bound
- For **production mobile games**, native solutions like [RVR](https://unrealsolutions.com) still outperform browser-based recording

---

## Resources

- [MDN: MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [MDN: WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)
- [W3C WebCodecs Spec](https://www.w3.org/TR/webcodecs/)
- [Chrome WebCodecs Samples](https://webcodecs-samples.nicksaiz.com/)
