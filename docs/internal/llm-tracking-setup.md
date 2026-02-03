# LLM/Agent Access Tracking Setup

## Goal
Track when AI agents and LLM crawlers access our `/agents/` documentation and `llms.txt`.

## Current Limitations
- GitHub Pages = static hosting, no server-side logs
- JavaScript analytics (GA4) won't capture most LLM crawlers
- Need server-side or edge solution

---

## Recommended: Cloudflare Setup (Free)

### Step 1: Add Site to Cloudflare
1. Sign up at cloudflare.com
2. Add `unrealsolutions.com`
3. Update nameservers at your registrar
4. Enable proxy (orange cloud) for the domain

### Step 2: View Analytics
Cloudflare Dashboard → Analytics → Traffic shows:
- All requests by path (filter for `/agents/` and `/llms.txt`)
- User agents (filter for known LLM bots)
- Geographic distribution
- Request volume over time

### Step 3: Create Custom Firewall Rule (Optional)
To specifically log LLM traffic without blocking:

```
Field: User-Agent
Operator: contains
Value: GPTBot OR Claude-Web OR Googlebot OR CCBot OR anthropic
Action: Log (or Allow with logging)
```

### Known LLM Crawler User Agents
| Bot | User Agent Contains | Company |
|-----|---------------------|---------|
| GPTBot | `GPTBot` | OpenAI |
| ChatGPT-User | `ChatGPT-User` | OpenAI (browsing) |
| Claude-Web | `Claude-Web` | Anthropic |
| Google-Extended | `Google-Extended` | Google/Gemini |
| CCBot | `CCBot` | Common Crawl |
| Bytespider | `Bytespider` | ByteDance |
| Amazonbot | `Amazonbot` | Amazon |
| FacebookBot | `FacebookBot` | Meta |
| PerplexityBot | `PerplexityBot` | Perplexity |
| Cohere-ai | `cohere-ai` | Cohere |

---

## Alternative: Tracking Pixel with Cloudflare Worker

### Worker Code (track-llm-access.js)
```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || 'unknown';
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const country = request.headers.get('CF-IPCountry') || 'unknown';
    
    // Log to KV, D1, or external service
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      page,
      userAgent,
      country,
      isLLM: detectLLM(userAgent)
    }));
    
    // Return 1x1 transparent GIF
    const gif = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00,
      0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0xff, 0xff,
      0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00,
      0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44,
      0x01, 0x00, 0x3b
    ]);
    
    return new Response(gif, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store'
      }
    });
  }
};

function detectLLM(ua) {
  const llmBots = [
    'GPTBot', 'ChatGPT', 'Claude', 'anthropic', 'Googlebot',
    'Google-Extended', 'CCBot', 'Bytespider', 'PerplexityBot',
    'Cohere', 'Amazonbot'
  ];
  return llmBots.some(bot => ua.toLowerCase().includes(bot.toLowerCase()));
}
```

### Add Pixel to Agent Pages
```html
<img src="https://track.unrealsolutions.com/pixel.gif?page=agents-rvr" 
     width="1" height="1" alt="" loading="eager">
```

---

## Alternative: Use Existing Analytics with LLM Detection

### Enhanced GA4 with User Agent Logging
Won't capture non-JS crawlers, but will capture AI-assisted browsing:

```javascript
// Add to agent pages
if (typeof gtag !== 'undefined') {
  const ua = navigator.userAgent;
  const isAIBrowser = /GPT|Claude|Copilot|Cursor/i.test(ua);
  
  gtag('event', 'agent_page_view', {
    'page_path': window.location.pathname,
    'is_ai_assisted': isAIBrowser,
    'user_agent_category': isAIBrowser ? 'ai_tool' : 'browser'
  });
}
```

---

## Quick Win: Check Existing GitHub Traffic

GitHub provides basic traffic analytics:
1. Go to repo → Insights → Traffic
2. Shows top referrers and popular content
3. Limited but free and already available

---

## Summary

| Method | Captures LLM Crawlers | Effort | Cost |
|--------|----------------------|--------|------|
| Cloudflare Analytics | ✅ Yes | Low | Free |
| Vercel/Netlify | ✅ Yes | Medium | Free tier |
| Tracking Pixel + Worker | ✅ Yes | Medium | Free |
| GA4 Enhanced | ❌ JS-only | Low | Free |
| GitHub Traffic | ⚠️ Limited | None | Free |

**Recommendation**: Add Cloudflare in front of GitHub Pages. Free, captures all traffic, minimal setup.
