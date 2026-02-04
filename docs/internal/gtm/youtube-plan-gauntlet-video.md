# YouTube Video Plan: Unreal Engine Automation & Video Recording

## Video Overview
- **Topic:** Automating game testing in Unreal Engine via Gauntlet with integrated Video Recording.
- **Goal:** Show how to add "Undeniable Evidence" (video proof) to automated test results without the complexity of Pixel Streaming.
- **Reference Complexity:** [Pixel Streaming Talk](https://youtu.be/erNW3r9uRH0) (Contrast RVR's simplicity vs. this complex setup).

---

## 🚀 Suggested Titles

### Category: The "Problem-Solver" (High CTR)
1. **Unreal Engine Automated Testing: Stop "Cannot Reproduce" with Video Evidence**
2. **Gauntlet + Video Recording: The Missing Piece in Unreal Engine Automation**
3. **Automate Your QA: How to Record Gameplay in Headless Unreal Engine Builds**

### Category: The "Simplifier" (The "Pixel Streaming" Killer)
4. **Hardware Accelerated Video in Unreal Engine: Skip the Pixel Streaming Setup**
5. **Gauntlet Testing is Useless Without Video. Here's the Simple Way to Add it.**

### Category: Technical / SEO (Search Growth)
6. **Integrating Runtime Video Recorder (RVR) with Unreal Gauntlet Automation**
7. **Gauntlet & CI/CD: Automated Video Capture for Unreal Engine 5.5+**

**🏆 Recommendation:** 
> **"Unreal Engine Automation: Gauntlet Testing with Hardware-Accelerated Video Proof"**

---

## 💡 The Hook (Contrast with Pixel Streaming)
In the video, call out that most developers think you need a massive server farm and **Pixel Streaming** just to get video out of a headless automated test. 
- **The "LOL" Factor:** Pixel Streaming requires WebRTC, signalling servers, and high bandwidth.
- **The RVR Way:** Native, hardware-accelerated encoding directly to MP4 on the local disk (or CI/CD artifact storage). 1-3% overhead vs. the massive overhead of streaming.

---

## 🎨 Thumbnail Concept
- **Left Side:** A complex, messy diagram of servers and network cables labeled "PIXEL STREAMING SETUP."
- **Right Side:** A single, clean Unreal Engine Plugin icon (RVR) labeled "THE SIMPLE WAY."
- **Text Overlay:** "GAUNTLET + VIDEO" in big, bold yellow letters.

---

## 🔗 Description & Social Sharing (UTM Examples)

When sharing this video or the BugIt link in the description, use these UTM tags to track which source works best:

**YouTube Description Link:**
`https://unrealsolutions.com/products/bugit/?utm_source=youtube&utm_medium=video&utm_campaign=gauntlet_tutorial&utm_content=description_link`

**LinkedIn/Twitter Share:**
`https://unrealsolutions.com/products/bugit/?utm_source=linkedin&utm_medium=social&utm_campaign=gauntlet_tutorial`

---

## 📝 Key Talking Points
1. **The Gap:** Gauntlet gives you logs and "Success/Fail," but it doesn't show you *why* a character clipped through a floor.
2. **The Integration:** Show the Blueprint/C++ code to trigger RVR's `StartRecording` when a Gauntlet test starts.
3. **Headless Performance:** Demonstrate that it works on build servers without a GPU attached (using hardware-accelerated encoding).
4. **The Result:** Open the **BugIt Dashboard** to show the video synced with the logs that Gauntlet generated.