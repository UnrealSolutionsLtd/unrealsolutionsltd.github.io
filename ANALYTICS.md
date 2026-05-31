# Checking Your Funnel Data in Google Analytics

A practical guide to verifying the events we wired up and reading the funnel.

- **Property:** unrealsolutions.com (`G-39LZYGQJL9`)
- **Where the events come from:** `assets/js/funnel-analytics.js` (events) + `assets/js/content-cta.js` (content CTAs). Loaded site-wide via `nav.js`.

---

## The events that now power your funnel

| Funnel stage | Event name | Fires when… | Key params |
|---|---|---|---|
| Engage | `view_item` | Pricing/licensing section scrolls into view | `value`, `items[]` |
| Engage | `select_content` | "Watch Demo" (YouTube) clicked | `content_type: video` |
| Engage | `view_promotion` | A content-page CTA is shown | `promotion_name` |
| Intent | `begin_checkout` | Any Stripe buy button clicked | `value`, `currency`, `items[]` |
| Intent | `select_promotion` | "See Runtime Video Recorder" CTA clicked | `promotion_name: rvr_from_content` |
| **Lead** | `generate_lead` | Perpetual/Tally, `business@` email, **or VLM waitlist** | `lead_type` (see below) |

**`generate_lead` → `lead_type` tells you which lead it is:**
- `vlm_waitlist` → the VLM agents fake-door (the demand test)
- `perpetual_quote` → Perpetual "Contact Us"
- `sales_email` → any `business@unrealsolutions.com` link

---

## Step 1 — Confirm events are firing (≈2 min)

1. Open your site with `?debug_mode=1` on the end, e.g. `https://unrealsolutions.com/?debug_mode=1`
2. In GA4: **Admin (gear, bottom-left) → DebugView**.
3. On the site, scroll to the pricing section and click a Buy button / a CTA.
4. In DebugView you should see the events stream in: `view_item`, `begin_checkout`, `generate_lead`, etc. Click an event to see its parameters (`value`, `lead_type`…).

> If nothing shows, hard-refresh the page (Ctrl+Shift+R) so the browser drops any cached scripts.

---

## Step 2 — Mark the Key Events (conversions)

By default these events are **not** conversions, so they won't show in funnels/conversion reports until you flag them.

1. GA4: **Admin → Key events** (under "Data display").
2. Click **"New key event"** and type the name **exactly**:
   - `begin_checkout`
   - `generate_lead`
   - `select_promotion`
   - `view_item`
3. (They also auto-appear in **Admin → Events** within ~24h once they've fired a few times — you can toggle "Mark as key event" there too.)

---

## Step 3 — Build the funnel report

1. GA4: **Explore** (left menu) → **Funnel exploration**.
2. Set the date range (top-left). New events only have data from the day we shipped them forward.
3. Add steps (click "Steps" → pencil icon):
   1. `session_start`
   2. `view_item`
   3. `begin_checkout`
4. **Breakdown** → drag in **Session source / medium** to see which sources convert (YouTube/Google should lead; "direct" should lag).
5. Tip: add a **comparison** that **excludes** `Session source/medium = (direct)/(none)` to see your real conversion rate without the low-quality bucket.

---

## Step 4 — Read the VLM waitlist smoke test

This is the demand test for the fake "VLM Testing Agents" product (live on the 5 AI insights pages + the `/products` page).

1. GA4: **Explore → Free-form**.
2. **Rows:** add dimension **Event name**, and the custom parameter **`lead_type`** *(see note below)*.
3. **Values:** **Event count** and **Total users**.
4. Filter: **Event name** `exactly matches` `generate_lead`.
5. Read the row where `lead_type = vlm_waitlist` → that's your waitlist click-through. Compare against page views of the AI pages to get a signup-intent rate.

> **Note — register `lead_type` once:** custom text params need a dimension before they show in reports.
> **Admin → Custom definitions → Create custom dimension** → Dimension name `lead_type`, Scope `Event`, Event parameter `lead_type`. (Also worth adding: `promotion_name`, `plan_type`.) Data populates going forward.

---

## Heads-up: events that STOPPED firing (cleanup)

We removed three redundant legacy events. If any saved report/funnel used them, repoint it:

| Old (gone) | Use instead |
|---|---|
| `buy_license_click` | `begin_checkout` (richer: has value/currency) |
| `outbound_link_click` | GA4's automatic `click` event |

The very old fragmented names (`buy_click`, `cta_download_click`, `get_quote_click`, `toggle_sub_period`…) were already gone from the code — they only exist in your **historical** data and can't be deleted. Just don't build new reports on them.

---

## 30-second daily check

1. **Reports → Realtime** → scroll to "Event count by Event name" → confirm `view_item` / `begin_checkout` / `generate_lead` appear as people use the site.
2. **Reports → Engagement → Events** → watch `begin_checkout` and `generate_lead` counts trend over time.
3. Once a week: open the **Funnel exploration** (Step 3) and the **VLM smoke test** (Step 4).
