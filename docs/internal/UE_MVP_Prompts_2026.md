# Unreal Engine MVP Prompts (Validated 2026)

These prompts target **validated gaps** with strong market signals. Each MVP solves a problem where **no existing solution exists** or current tools are enterprise-only/cloud-only.

---

## 1. "Local Vision QA" (AI-Powered Visual Bug Detection)

### The Problem
Manual visual QA is slow and misses edge cases. Cloud AI (like Razer Wyvrn) is a privacy/NDA risk for studios working on unannounced titles.

### Competitor Landscape

| Company | Funding | What They Do | Gap |
|---------|---------|--------------|-----|
| **nunu.ai** | $6M seed (Mar 2025), a16z Speedrun | AI agents ("Unembodied Minds") that play games and detect bugs | Cloud-based, game-agnostic |
| **Drizz** | $2.7M seed (2025) | Visual inspection "like a human tester" | Cloud-based, not game-specific |
| **Razer Wyvrn** | Enterprise (Razer) | QA Copilot for Unreal/Unity, crash + perf detection | Cloud-only, no public pricing, enterprise |
| **Applitools Eyes** | Series D ($31M) | Visual AI regression testing | Web/mobile focus, expensive, no game engine integration |
| **Percy (BrowserStack)** | Acquired | Screenshot comparison, CI/CD | Web UI only, not 3D games |

### Why "Local" is the Gap

**Evidence from Razer Wyvrn feedback:**
- No public pricing (enterprise quotes only)
- Cloud-based = studios must upload footage externally
- "20-25% more bugs found" claims but no independent verification
- Learning curve for setup, integration overhead
- Studios on unannounced AAA titles cannot risk NDA breaches

**nunu.ai / Drizz:**
- Both are cloud-first SaaS
- Focus on gameplay testing (AI plays the game), not static visual inspection
- Not suitable for quick "scan this level for art bugs" workflow

### Market Signal (Strong)
- nunu.ai raised $6M from a16z in March 2025 = VCs believe in AI game QA
- Razer launched Wyvrn as a major product line = large company validation
- But NO local/offline solution exists for privacy-conscious studios

### Our Differentiator
**100% local execution** using Ollama + Moondream/LLaVA. No cloud, no uploads, no NDA risk.

### Cursor Prompt
```markdown
Create a UE5.5+ Editor Plugin "LocalVisionQA".

## Core Features
1. **Automated Fly-Through Scanner**
   - User places spline or waypoints in level
   - Camera automatically moves along path, capturing screenshots
   - Configurable capture interval (every N units or N seconds)

2. **Local VLM Integration**
   - HTTP POST to localhost:11434 (Ollama API)
   - Sends base64-encoded screenshot with prompt:
     "Analyze this game screenshot. List any visual bugs:
      - Z-fighting or flickering surfaces
      - Floating or clipping objects
      - Broken lighting or shadow artifacts
      - Missing textures (pink/checkerboard)
      - LOD popping visible
      Return JSON: {issues: [{type, description, severity, screen_region}]}"
   - Parse JSON response, handle timeouts gracefully

3. **Issue Pin System**
   - For each detected issue, spawn an "Issue Pin" actor at camera location
   - Issue Pin stores: screenshot thumbnail, AI feedback, severity, timestamp
   - Issue Pins persist in level (saved to UDataAsset)
   - Click pin to view details in panel

4. **Slate UI**
   - Tab in Level Editor
   - "Start Scan" / "Stop" buttons
   - Progress bar showing waypoints completed
   - List view of all issues (sortable by severity)
   - "Export Report" button → generates HTML with embedded screenshots

## Technical Requirements
- FHttpModule for REST calls
- FHighResScreenshotConfig for captures
- UDataAsset subclass for issue persistence
- Custom SListView for issue display
- Async HTTP to not block editor

## Settings (Project Settings page)
- Ollama endpoint URL (default: http://localhost:11434)
- Model name (default: moondream)
- Capture resolution
- Prompt template (editable)
```

---

## 2. "LocQA" (Localization Overflow & Missing Glyph Auditor)

### The Problem
Translated text overflows UI containers or fails to render (missing font glyphs). QA must manually check every screen in every language. This is 100% manual today.

### Competitor Landscape

| Company | What They Do | Gap for Games |
|---------|--------------|---------------|
| **Zof AI** | AI i18n testing, 50+ locales, text truncation detection | Web/mobile apps only, not game engines |
| **GPT Driver (MobileBoost)** | Mobile localization QA, 98% recall on truncation | Mobile-only, no Unreal/Unity support |
| **Applitools** | Visual AI locale comparison | Screenshot-based, no engine integration |
| **Hansem Global** | UI Text Overflow Checker | Metadata-based, not real rendering |
| **Shaperglot/Hyperglot** | Font glyph coverage analysis | CLI tools, not integrated into engines |

### Developer Complaints (Reddit/Forums)

**Unreal Engine specific issues:**
1. "Dialogue text goes past bounds of text box" - UE5, even with wrapping enabled
2. "Text Overflow Policy not working with RenderTransform" - UE 5.1.1-5.3 known bug
3. "Editable TextBox clipping from the bottom" - Font metrics not respected
4. "Russian/Chinese translations disappearing" - Font doesn't support glyphs
5. "Wrap Text At doesn't behave well in Scale Box" - Dynamic scaling breaks text

**Common complaints:**
- "No documentation on how layouts should adapt to longer translations"
- "German text is 40% longer, buttons all break"
- "CJK characters show as boxes, no warning until runtime"
- "Have to manually check every screen in 12 languages"

### Market Signal (Strong)
- Zof AI and GPT Driver both raised funding = market exists
- But BOTH are web/mobile focused
- NO tool exists specifically for Unreal Engine
- Forums full of complaints with no automated solution

### Our Differentiator
**First Unreal-native localization QA tool** that:
- Actually renders widgets in-engine (not metadata-based)
- Detects both overflow AND missing glyphs
- Generates actionable report with screenshots

### Cursor Prompt
```markdown
Create a UE5.5+ Editor Plugin "LocQA".

## Core Features
1. **Culture Iterator**
   - Read all cultures from Localization Dashboard (FInternationalization)
   - For each culture, switch editor locale
   - Track progress: "Testing de-DE (3/12)..."

2. **Widget Scanner**
   - Find all Widget Blueprints in project (via AssetRegistry)
   - For each WBP:
     a. Create widget instance
     b. Render to off-screen target (FWidgetRenderer)
     c. Run detection algorithms

3. **Overflow Detection**
   - Traverse widget tree, find all UTextBlock / URichTextBlock
   - For each text widget:
     - Get computed text size (FSlateFontMeasure)
     - Get parent container bounds
     - Flag if text exceeds bounds (horizontal OR vertical)
   - Handle edge cases: ScrollBox children, auto-size containers

4. **Missing Glyph Detection**
   - For each text widget's content:
     - Get the FSlateFontInfo being used
     - For each character in the localized string:
       - Check if font has glyph (via FreeType/Harfbuzz or UFont API)
       - Check for U+FFFD (replacement character) in rendered output
   - Flag missing glyphs with specific character codes

5. **Report Generation**
   - HTML report with:
     - Summary: X widgets tested, Y issues found, Z languages
     - Per-issue: Screenshot, Widget path, Language, Issue type, Specific text
     - Severity: Critical (missing glyph), Warning (overflow)
   - Export to /Saved/LocQA/Report_[timestamp].html

## Technical Requirements
- FInternationalization::Get().SetCurrentCulture()
- UWidgetBlueprintLibrary for widget instantiation
- FWidgetRenderer::DrawWidget() for off-screen capture
- FSlateFontMeasure for text measurement
- TArray<FLocQAIssue> for result storage

## Settings
- Cultures to test (checkboxes)
- Widget paths to include/exclude (glob patterns)
- Overflow threshold (% of container, default 100%)
- Skip auto-size containers option
```

---

## Summary & Prioritization

| MVP | Gap Strength | Competition | Dev Effort | Recommendation |
|-----|--------------|-------------|------------|----------------|
| **Local Vision QA** | STRONG | Cloud-only competitors | Medium (HTTP + UI) | **BUILD FIRST** - Clear differentiator |
| **LocQA** | STRONG | No Unreal solution | Medium-High (Widget rendering) | **BUILD SECOND** - Larger market |

### Why These Two?

**Local Vision QA:**
- $6M+ VC funding into competitors = validated market
- "Local" is a clear, simple differentiator
- Can ship MVP in 2-3 weeks
- Studios will pay for privacy

**LocQA:**
- No competition at all for Unreal
- Forums full of pain (German overflow, CJK boxes)
- Every studio shipping globally needs this
- Can charge per-project or subscription

### Pricing Models

**Local Vision QA:**
- Free tier: 10 scans/day, basic report
- Pro: $29/month unlimited scans, HTML export
- Enterprise: $99/month, custom prompts, CI/CD integration

**LocQA:**
- Free tier: 5 widgets, 3 languages
- Pro: $49/month unlimited, all languages
- Enterprise: $149/month, CI/CD, custom rules, priority support
