# Traffic Tracking & Analytics Setup

**Last Updated:** January 26, 2026  
**Owner:** Growth/Marketing  
**Status:** Implemented

---

## Overview

This document describes how traffic tracking works across the RVR marketing funnel, from traffic source attribution to conversion tracking in Tally.

## Traffic Flows

### Primary Flow: FAB Marketplace (80% of leads)

```
┌─────────────────────────────────────────────────────────────────┐
│                      FAB MARKETPLACE                            │
│                   fab.com/listings/...                          │
│                           │                                     │
│                           ▼                                     │
│              ┌────────────────────────┐                        │
│              │      TALLY FORM        │                        │
│              │  tally.so/r/mZDq7v     │                        │
│              │                        │                        │
│              │  UTM params should be: │                        │
│              │  ?utm_source=fab       │                        │
│              │  &utm_medium=marketplace│                       │
│              │  &utm_campaign=rvr_listing                      │
│              └────────────────────────┘                        │
│                           │                                     │
│                           ▼                                     │
│                    API Key Delivered                            │
└─────────────────────────────────────────────────────────────────┘
```

**Action Required:** Update FAB listing link to include UTM params:
```
https://tally.so/r/mZDq7v?utm_source=fab&utm_medium=marketplace&utm_campaign=rvr_listing
```

### Secondary Flow: Website (20% of leads)

```
┌─────────────────────────────────────────────────────────────────┐
│              TRAFFIC SOURCES                                    │
│   Google Search │ Reddit │ Unreal Forums │ Social │ Direct     │
│                           │                                     │
│                           ▼                                     │
│              ┌────────────────────────┐                        │
│              │   unrealsolutions.com   │                        │
│              │                        │                        │
│              │  Referrer detected:    │                        │
│              │  - google → organic    │                        │
│              │  - reddit → social     │                        │
│              │  - etc.                │                        │
│              └───────────┬────────────┘                        │
│                          │                                      │
│                          ▼                                      │
│              ┌────────────────────────┐                        │
│              │   CTA Button Click     │                        │
│              │   (hero/middle/bottom) │                        │
│              │                        │                        │
│              │   GA Event:            │                        │
│              │   cta_download_click   │                        │
│              └───────────┬────────────┘                        │
│                          │                                      │
│                          ▼                                      │
│              ┌────────────────────────┐                        │
│              │      TALLY FORM        │                        │
│              │                        │                        │
│              │  Dynamic UTM params:   │                        │
│              │  ?utm_source={source}  │                        │
│              │  &utm_medium={medium}  │                        │
│              │  &utm_content={position}│                       │
│              └────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Google Analytics Implementation

### Tracking ID
```
G-39LZYGQJL9
```

### Events Tracked

| Event Name | Description | Parameters |
|------------|-------------|------------|
| `cta_download_click` | CTA button clicks | `button_position`, `button_text`, `traffic_source`, `traffic_medium`, `page_path` |
| `docs_navigation` | Documentation link clicks | `link_text`, `link_url`, `page_path` |
| `usecase_engagement` | Use case card interactions | `usecase_title`, `action_type`, `page_path` |
| `outbound_link_click` | External link clicks | `link_url`, `link_text`, `page_path` |
| `scroll_milestone` | Scroll depth tracking | `scroll_depth`, `page_path` |
| `time_engagement` | Time on page | `time_seconds`, `page_path` |

### Automatic Referrer Detection

When no UTM params are in the URL, the system detects traffic source from `document.referrer`:

| Referrer Contains | utm_source | utm_medium |
|-------------------|------------|------------|
| `google.` | `google` | `organic` |
| `bing.` | `bing` | `organic` |
| `duckduckgo.` | `duckduckgo` | `organic` |
| `yahoo.` | `yahoo` | `organic` |
| `baidu.` | `baidu` | `organic` |
| `yandex.` | `yandex` | `organic` |
| `reddit.com` | `reddit` | `social` |
| `twitter.com` or `x.com` | `twitter` | `social` |
| `linkedin.com` | `linkedin` | `social` |
| `facebook.com` | `facebook` | `social` |
| `discord.com` | `discord` | `social` |
| `unrealengine.com` | `unreal_forums` | `referral` |
| `fab.com` | `fab` | `marketplace` |
| `youtube.com` | `youtube` | `video` |
| Other domain | Domain name | `referral` |
| No referrer | `direct` | `none` |

### CTA Button Positions

Three CTA buttons on the homepage, each tracked with position:

| Position | Location | Data Attribute |
|----------|----------|----------------|
| `hero` | Above the fold, main hero section | `data-cta-position="hero"` |
| `middle` | After use cases section | `data-cta-position="middle"` |
| `bottom` | Final CTA before footer | `data-cta-position="bottom"` |

All CTA buttons have class `cta-download` for JavaScript selection.

---

## GA4 Admin Setup Required

### 1. Custom Dimensions (Required)

Go to: **Admin → Custom definitions → Create custom dimension**

| Dimension Name | Event Parameter | Scope |
|----------------|-----------------|-------|
| Button Position | `button_position` | Event |
| Traffic Source | `traffic_source` | Event |
| Traffic Medium | `traffic_medium` | Event |
| Use Case Title | `usecase_title` | Event |
| Link URL | `link_url` | Event |
| Scroll Depth | `scroll_depth` | Event |
| Time Seconds | `time_seconds` | Event |

### 2. Key Events (Conversions)

Go to: **Admin → Events → Mark as key event**

| Event | Mark as Key Event? |
|-------|-------------------|
| `cta_download_click` | ✅ Yes |
| Others | No |

### 3. Data Retention

Go to: **Admin → Data Settings → Data Retention**

- Set to **14 months** (maximum for free GA4)

### 4. Enhanced Measurement

Go to: **Admin → Data Streams → [Your Stream] → Enhanced Measurement**

| Feature | Recommendation |
|---------|----------------|
| Page views | ✅ Keep enabled |
| Scrolls | ⚠️ Consider disabling (we have custom tracking) |
| Outbound clicks | ⚠️ Consider disabling (we have custom tracking) |
| Site search | ✅ Keep enabled |
| Form interactions | ✅ Keep enabled |
| Video engagement | ✅ Keep enabled |
| File downloads | ✅ Keep enabled |

---

## Tally Form Attribution

### Current Form
```
https://tally.so/r/mZDq7v
```

### UTM Parameters Passed to Tally

When user clicks CTA on website, the URL is dynamically updated to:

```
https://tally.so/r/mZDq7v?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={position}
```

Example for Google organic visitor clicking hero CTA:
```
https://tally.so/r/mZDq7v?utm_source=google&utm_medium=organic&utm_campaign=rvr_download&utm_content=hero
```

### Tally Source Attribution

In Tally Insights, you should now see:
- **Source breakdown** by `utm_source` (google, reddit, fab, etc.)
- **Button position** in `utm_content` (hero, middle, bottom)

---

## Debug Mode

Add `?debug=true` to any page URL to see attribution data in browser console:

```
https://unrealsolutions.com/?debug=true
```

Console output:
```javascript
RVR Analytics Debug: {
  utm: {
    utm_source: "google",
    utm_medium: "organic",
    utm_campaign: "none",
    utm_content: "none",
    referrer: "https://www.google.com/..."
  },
  page: "/"
}
```

---

## Weekly Tracking Checklist

### GA4 Checks
- [ ] Check `cta_download_click` events count
- [ ] Review `button_position` breakdown (hero vs middle vs bottom)
- [ ] Check `traffic_source` breakdown
- [ ] Review scroll depth distribution
- [ ] Check time engagement distribution

### Tally Checks
- [ ] Review source breakdown in Insights
- [ ] Check `utm_content` for button position data
- [ ] Monitor form completion rate
- [ ] Review question drop-off funnel

### Key Metrics to Track Weekly

| Metric | Source | Target |
|--------|--------|--------|
| Website visitors | GA4 Active Users | Track trend |
| CTA clicks | GA4 `cta_download_click` | Track trend |
| Click-through rate | CTA clicks / Visitors | >10% |
| Form visits | Tally Insights | Track trend |
| Form completion rate | Tally submissions / visits | >35% |
| Overall conversion rate | Submissions / Website visitors | >2% |

---

## Troubleshooting

### Events not appearing in GA4
- Wait 24-48 hours for data to populate
- Check Realtime report for immediate verification
- Verify no JavaScript errors in browser console

### Custom dimensions showing "(not set)"
- Ensure dimensions are registered in GA4 Admin
- Check that event parameters match exactly (case-sensitive)
- Wait 24-48 hours after registration

### Tally showing "Direct/None" for all traffic
- Verify UTM params are being appended to Tally URL
- Check browser Network tab when clicking CTA
- Ensure JavaScript is not blocked

### Button position not tracking
- Verify `data-cta-position` attribute on button HTML
- Verify `cta-download` class on button
- Check browser console for errors

---

## UTM Content Values by Page

All Tally links across the site now include UTM tracking:

| Page | utm_content Value |
|------|-------------------|
| **Homepage (index.html)** | `hero`, `middle`, `bottom` (dynamic via JS) |
| **Use Cases** | |
| game-testing-video-recording.html | `usecase_game_testing` |
| vr-recording-unreal-engine.html | `usecase_vr_recording` |
| pixel-streaming-recording.html | `usecase_pixel_streaming` |
| cross-platform-recording.html | `usecase_cross_platform` |
| blueprint-video-capture.html | `usecase_blueprint` |
| **Insights (Blog)** | |
| in-game-bug-reporting-tools-unreal-engine.html | `insight_bug_reporting` |
| video-recording-game-testing-roi.html | `insight_testing_roi` |
| virtual-production-workflow-guide.html | `insight_virtual_production` |
| ci-cd-video-capture-unreal-engine.html | `insight_cicd` |
| ai-game-testing-vlm-agents.html | `insight_ai_testing` |
| mobile-game-testing-video-evidence.html | `insight_mobile_testing` |
| unreal-engine-cinematic-tools-analysis.html | `insight_cinematic_tools` |
| ios-gameplay-recording-qa.html | `insight_ios_recording` |
| game-engine-trends-2026.html | `insight_engine_trends` |
| insights/index.html | `insights_index` |
| **Other Pages** | |
| products/bugit/index.html | `product_bugit` |
| download.html | `download_page` |
| recorders.html | `recorders_comparison` |
| docs/download.md | `docs_download` |
| llms.txt | `llms_txt` (source: `llm`, medium: `ai_assistant`) |

---

## External Repository Tracking (GitHub)

### BugIt Repository
The BugIt GitHub repo README links back to unrealsolutions.com with UTM tracking:

```markdown
**Powered by [RVR](https://unrealsolutions.com/?utm_source=github&utm_medium=readme&utm_campaign=bugit&utm_content=powered_by_rvr)**
```

| Parameter | Value |
|-----------|-------|
| utm_source | `github` |
| utm_medium | `readme` |
| utm_campaign | `bugit` |
| utm_content | `powered_by_rvr` |

### GitHub Traffic Analytics

GitHub provides built-in traffic data (Repo → Insights → Traffic):
- Unique visitors (14-day retention)
- Page views (14-day retention)  
- Referring sites (14-day retention)
- Clone counts (14-day retention)

**Important:** GitHub only retains 14 days of traffic data. Consider setting up automated export via GitHub Actions if you need historical data.

### Tracking GitHub → Website → Conversion

```
GitHub Repo View (GitHub Traffic Insights)
           │
           ▼
README Link Click (GA4: source=github)
           │
           ▼
Website Visit (GA4)
           │
           ▼
Tally Form (utm_source=github visible in Tally)
           │
           ▼
Lead Captured
```

---

## Code Locations

| Component | File | Lines |
|-----------|------|-------|
| GA4 config | `index.html` | 272-282 |
| UTM tracking | `index.html` | 284-352 |
| Tally URL builder | `index.html` | 354-367 |
| Event functions | `index.html` | 369-430 |
| CTA button tracking | `index.html` | 1369-1389 |
| Hero CTA button | `index.html` | ~447 |
| Middle CTA button | `index.html` | ~570 |
| Bottom CTA button | `index.html` | ~1105 |

---

## Historical Context

### Before January 2026
- Used generic `click` event name (conflicted with GA4 auto-tracking)
- No button position tracking
- No referrer detection
- No UTM pass-through to Tally
- 80% of Tally traffic showed as "Direct/None"

### After January 2026 Update
- Unique event names (`cta_download_click`, etc.)
- Button position tracking (hero/middle/bottom)
- Automatic referrer detection for 15+ sources
- Dynamic UTM params passed to Tally
- Full attribution chain from source to conversion

---

## Future Improvements

- [ ] Tally webhook integration to send conversion events back to GA4
- [ ] Server-side tracking for ad blockers
- [ ] A/B testing framework for CTA buttons
- [ ] Heatmap integration (Hotjar/Microsoft Clarity)
- [ ] Custom dashboard in Looker Studio
