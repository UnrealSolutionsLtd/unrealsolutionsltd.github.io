# RVR Enterprise Licensing

Internal pricing strategy for gaming studios.

---

## License Tiers

| Tier | Price | Updates | Source | Seats | Target |
|------|-------|---------|--------|-------|--------|
| Indie | $500 perpetual | $150/year | ❌ | 1-3 | Solo devs, small teams |
| Pro | $3,000 perpetual | $1,000/year | ✅ | Up to 20 | Funded studios |
| Enterprise | $15,000 perpetual | $5,000/year | ✅ | Unlimited | AAA, custom engine |

---

## Enterprise License Includes

- Full source code
- Unlimited developer seats
- All platforms (Windows, Mac, Linux, iOS, Android, consoles, VR)
- Custom engine integration rights
- 12 months of updates included

## Update Subscription ($5,000/year)

What they get:
- New Unreal Engine version compatibility (within 30 days of UE release)
- New platform support (consoles, VR headsets)
- New hardware encoder support (NVIDIA, AMD, Apple Silicon)
- Upstream bug fixes
- New features

What they DON'T get:
- Support calls
- Consulting
- Custom development
- Hand-holding

Skip updates? Keep using current version forever. No UE 5.6+ compatibility. Maintain your own fork.

---

## Value Quantification

### Why $15,000 is justified:

**1. Engineer Cost Comparison**

Building equivalent functionality in-house:
- Senior Unreal C++ engineer: $150,000-200,000/year
- Time to build cross-platform recorder: 6-12 months
- Minimum cost: $75,000-200,000

RVR: $15,000 (10-20x cheaper)

**2. Time-to-Value**

In-house build: 6-12 months before QA can use it
RVR: Working in 1 day

For a studio burning $500K-2M/month, 6 months delay = $3M-12M opportunity cost

**3. Platform Coverage**

Building for ONE platform is hard. Building for 7 platforms:
- Windows (NVENC, AMD, Intel, Software)
- macOS (VideoToolbox)
- Linux (VAAPI, NVENC)
- iOS (VideoToolbox)
- Android (MediaCodec + fragmentation)
- VR (Quest, PSVR2)
- Consoles (proprietary APIs)

Each platform = 2-4 months engineering. Total: 14-28 months.

**4. Maintenance Burden**

Without update subscription:
- Each UE update: 1-2 weeks engineer time to update fork
- 2 UE updates/year = 4-8 weeks/year
- Engineer cost: $3,000-6,000/week
- Annual maintenance: $12,000-48,000

Update subscription: $5,000/year (4-10x cheaper)

**5. Comparable Tool Pricing**

| Tool | Annual Cost | Category |
|------|-------------|----------|
| Perforce Helix | $800-1,500/user/year | Version control |
| Incredibuild | $1,000-2,000/user/year | Build acceleration |
| Havok | $25,000-100,000/title | Physics |
| RAD Tools (Bink) | $5,000-50,000/title | Video |
| RVR Enterprise | $15,000 + $5K/year | Recording |

RVR is priced at the low end of enterprise game middleware.

---

## ROI Calculator for Prospects

Present this to justify the purchase:

```
YOUR COST WITHOUT RVR:

Option A: Build in-house
├── Engineer salary (6 months): $75,000-100,000
├── Ongoing maintenance: $20,000/year
├── Opportunity cost (delay): $$$
└── Total Year 1: $100,000+

Option B: No video recording
├── "Cannot reproduce" bugs: 30% of bug reports
├── Time wasted per bug: 4-8 hours
├── 100 bugs/month × 6 hours × $75/hr = $45,000/month
└── Total Year 1: $540,000 in wasted time

YOUR COST WITH RVR:
├── License: $15,000
├── Updates: $5,000/year
└── Total Year 1: $15,000

SAVINGS: $85,000-525,000/year
ROI: 5-35x
```

---

## How to Present Pricing

### Don't Lead with Price

❌ "RVR costs $15,000"

### Lead with Value

✅ "How much does your team spend on 'cannot reproduce' bugs?"

✅ "What would it cost to build cross-platform recording in-house?"

✅ "How long would it take an engineer to support 7 platforms?"

Then: "RVR solves this for $15,000. That's less than 2 weeks of engineer time."

---

## Objection Handling

### "That's expensive"

"Compared to what? Building in-house costs $100K+. The maintenance subscription is cheaper than 1 week of engineer time per year."

### "Can we get a discount?"

"The price reflects the value: 7 platforms, 4 years of development, ongoing compatibility. I can offer annual billing for the update subscription."

### "We'll build our own"

"You could. Most studios who try end up with Windows-only, then spend 6 months on each additional platform. Your engineers' time is better spent on your game. We've already solved the hard problems."

### "We don't need updates"

"That's fine — the perpetual license works forever on current UE version. When UE 5.7 breaks the render hooks, you'll maintain the fork yourself. Most studios find $5K/year is cheaper than that maintenance."

---

## Sales Process

1. **Discovery call**: Understand their platforms, team size, pain points
2. **Value calculation**: Calculate their "cannot reproduce" bug cost
3. **Demo**: Show mobile recording (nobody else has this)
4. **Proposal**: Custom quote based on team size
5. **Close**: Emphasize ROI, not features

---

## Negotiation Boundaries

| Ask | Response |
|-----|----------|
| 10% discount | Yes, if annual prepay |
| 20% discount | Only for multi-year commitment |
| 30%+ discount | No — price reflects value |
| Free trial | 30-day eval license (watermarked) |
| Payment terms | Net 30 for enterprise |

---

## Contract Terms

- Perpetual license: Use forever, current version
- Update subscription: Annual, auto-renews
- Seats: Unlimited for Enterprise
- Platforms: All current + future (with active subscription)
- Source code: Included, modify for internal use only
- Redistribution: Only within shipped games (not as standalone tool)

---

## Case Study: MyWhoosh (Game Studio Tier)

### Company Profile

| Attribute | Details |
|-----------|---------|
| **Company** | MyWhoosh Technology Services LLC |
| **Parent** | Avrioc Technologies (Abu Dhabi, UAE) |
| **Product** | Virtual cycling / esports platform |
| **Engine** | Unreal Engine |
| **Scale** | 500K+ app installs, UCI partnership |
| **Backing** | UAE government / Royal Group ecosystem |

### Use Case Breakdown

| Use Case | Frequency | Value Driver |
|----------|-----------|--------------|
| **Marketing content** | Ongoing | Trailers, social media, promotional videos |
| **Esports broadcasts** | Weekly + major events | UCI Championships, Sunday Race Club ($300K/month prizes) |
| **User replays** | Continuous | Player engagement, race highlights |

### Value Quantification

**1. Marketing Content Production**

Without RVR:
- External capture rig or screen recording + post-processing
- Professional gameplay capture: $500-2,000/day
- Estimated 20-50 capture sessions/year
- **Annual cost: $10,000 - $100,000**

With RVR:
- In-engine, production-quality capture
- No external setup, instant
- **Cost: License only**

**2. Esports Broadcast & Replays**

Without RVR:
- External capture for broadcast
- Limited replay capability
- Professional broadcast capture setup: $5,000-20,000/event
- UCI Championships + weekly Sunday Race Club
- **Annual cost: $50,000 - $200,000** (conservative)

With RVR:
- In-engine capture, multiple camera angles
- Instant replay system for viewers
- **Cost: License only**

**3. Build vs Buy**

Build in-house:
- Senior Unreal C++ engineer: $150,000-200,000/year
- Time to build cross-platform recorder: 6-12 months
- Platforms needed: Windows, Mac, iOS, Android
- **Minimum cost: $75,000 - $150,000 + ongoing maintenance**

### Total Value Calculation

| Category | Annual Value/Savings |
|----------|---------------------|
| Marketing capture | $10,000 - $100,000 |
| Broadcast/replay | $50,000 - $200,000 |
| Build vs buy (amortized) | $75,000+ |
| **Total Annual Value** | **$135,000 - $375,000** |

### Recommended Quote

| Item | Price |
|------|-------|
| Game Studio Perpetual | $12,000 |
| Annual Updates | $3,000/year |

**Justification**: 
- License = 3-9% of first-year value delivered
- ROI: 11-31x in year one
- Self-selected Game Studio tier respected
