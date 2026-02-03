# Cloudflare Workers Opportunities for Unreal Solutions

## Current Automation Stack
- **GitHub Actions**: VitePress build, API key generation, deployment
- **API Keys**: Stored in `rvr_trial.bin`, validated by Unreal plugin
- **CRM Integration**: Triggered via GitHub workflow
- **Email**: SMTP via GitHub Actions

---

## High-Value Worker Opportunities

### 1. Real-Time API Key Validation Endpoint

**Current**: Plugin reads static `rvr_trial.bin` file
**With Worker**: Real-time validation with enhanced features

```javascript
// /api/validate-key
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    
    if (!key || !key.startsWith('RVRTRIAL')) {
      return Response.json({ valid: false, reason: 'invalid_format' });
    }
    
    // Extract expiry from key (last 6 chars = DDMMYY)
    const expiryStr = key.slice(-6);
    const expiry = parseKeyDate(expiryStr);
    
    if (expiry < new Date()) {
      return Response.json({ valid: false, reason: 'expired', expiredOn: expiry });
    }
    
    // Check against KV store (synced from rvr_trial.bin)
    const exists = await env.API_KEYS.get(key);
    if (!exists) {
      return Response.json({ valid: false, reason: 'not_found' });
    }
    
    // Log usage analytics
    await logKeyUsage(env, key, request);
    
    return Response.json({ 
      valid: true, 
      expiresAt: expiry,
      daysRemaining: Math.ceil((expiry - new Date()) / 86400000)
    });
  }
}
```

**Benefits**:
- Real-time validation (no cached static file)
- Usage analytics per key
- Can revoke keys instantly
- Rate limiting per key
- Geographic restrictions

---

### 2. Trial Download Gating

**Current**: Anyone can access download links
**With Worker**: Gated downloads requiring valid email/key

```javascript
// /download/rvr-trial
export default {
  async fetch(request, env) {
    // Check for valid session or API key
    const key = request.headers.get('X-API-Key') 
              || new URL(request.url).searchParams.get('key');
    
    if (!key) {
      // Redirect to signup form
      return Response.redirect('https://tally.so/r/mZDq7v', 302);
    }
    
    // Validate key
    const isValid = await validateKey(env, key);
    if (!isValid) {
      return new Response('Invalid or expired key', { status: 403 });
    }
    
    // Log download
    await env.DOWNLOADS.put(`${key}:${Date.now()}`, JSON.stringify({
      timestamp: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP'),
      country: request.headers.get('CF-IPCountry'),
      userAgent: request.headers.get('User-Agent')
    }));
    
    // Serve download (or redirect to actual file)
    return fetch('https://storage.unrealsolutions.com/rvr-trial.zip');
  }
}
```

---

### 3. Self-Service API Key Generation (Replace GitHub Workflow)

**Current**: Manual workflow dispatch with email input
**With Worker**: Instant self-service key generation

```javascript
// /api/generate-trial
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    
    const { email, useCase, honeypot } = await request.json();
    
    // Bot protection
    if (honeypot) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    // Validate email
    if (!isValidEmail(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }
    
    // Check for existing key
    const existing = await env.API_KEYS.get(`email:${email}`);
    if (existing) {
      return Response.json({ 
        error: 'Email already has active trial',
        existingKey: existing.key.slice(0, 8) + '...'
      }, { status: 409 });
    }
    
    // Analyze use case (same heuristics as current workflow)
    const isVague = analyzeUseCase(useCase);
    const duration = isVague ? 3 : 7;
    
    // Generate key
    const key = generateKey(email, duration);
    
    // Store in KV
    await env.API_KEYS.put(key, JSON.stringify({
      email,
      useCase,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + duration * 86400000).toISOString()
    }));
    await env.API_KEYS.put(`email:${email}`, JSON.stringify({ key }));
    
    // Queue email (via Queue Worker or external service)
    await env.EMAIL_QUEUE.send({ email, key, duration });
    
    // Sync to GitHub (append to rvr_trial.bin)
    await syncToGitHub(env, key);
    
    return Response.json({
      success: true,
      message: `Trial key sent to ${email}`,
      duration: `${duration} days`,
      note: isVague ? 'Provide more details for extended trial' : null
    });
  }
}
```

**Benefits**:
- Instant key delivery (no GitHub Actions delay)
- Better UX (real-time feedback)
- Built-in rate limiting
- Duplicate email detection
- Still syncs to GitHub for plugin compatibility

---

### 4. Contact Form Handler

**Current**: No server-side form handling (relies on Tally.so)
**With Worker**: Custom form processing

```javascript
// /api/contact
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    
    const formData = await request.formData();
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      message: formData.get('message'),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP'),
      country: request.headers.get('CF-IPCountry')
    };
    
    // Store in D1 or KV
    await env.CONTACTS.put(`${Date.now()}`, JSON.stringify(data));
    
    // Send notification email
    await sendEmail(env, {
      to: 'business@unrealsolutions.com',
      subject: `New contact: ${data.company || data.name}`,
      body: formatContactEmail(data)
    });
    
    // Auto-responder
    await sendEmail(env, {
      to: data.email,
      subject: 'Thanks for reaching out - Unreal Solutions',
      body: 'We received your message and will respond within 24 hours.'
    });
    
    return Response.json({ success: true });
  }
}
```

---

### 5. LLM/Agent Access Tracking (From Previous Discussion)

```javascript
// /api/track
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const ua = request.headers.get('User-Agent') || '';
    
    const isLLM = /GPTBot|Claude|anthropic|Googlebot|PerplexityBot/i.test(ua);
    
    // Store in Analytics Engine or KV
    await env.ANALYTICS.writeDataPoint({
      indexes: [page],
      doubles: [isLLM ? 1 : 0],
      blobs: [ua, request.headers.get('CF-IPCountry')]
    });
    
    // Return tracking pixel
    return new Response(TRANSPARENT_GIF, {
      headers: { 'Content-Type': 'image/gif' }
    });
  }
}
```

---

### 6. A/B Testing at the Edge

```javascript
// Middleware for A/B testing CTAs
export default {
  async fetch(request, env) {
    const response = await fetch(request);
    
    // Only modify HTML pages
    if (!response.headers.get('content-type')?.includes('text/html')) {
      return response;
    }
    
    // Determine variant (consistent per visitor)
    const visitorId = request.headers.get('CF-Connecting-IP');
    const variant = hashToVariant(visitorId, ['control', 'variant_a', 'variant_b']);
    
    // Rewrite HTML
    const rewriter = new HTMLRewriter()
      .on('.cta-button', {
        element(el) {
          if (variant === 'variant_a') {
            el.setInnerContent('Start Free Trial');
          } else if (variant === 'variant_b') {
            el.setInnerContent('Get Your API Key');
          }
        }
      });
    
    return rewriter.transform(response);
  }
}
```

---

### 7. Geo-Based Pricing Display

```javascript
// Show localized pricing
export default {
  async fetch(request, env) {
    const country = request.headers.get('CF-IPCountry');
    const response = await fetch(request);
    
    if (!response.headers.get('content-type')?.includes('text/html')) {
      return response;
    }
    
    const pricing = getPricingForCountry(country);
    
    const rewriter = new HTMLRewriter()
      .on('.price-indie', { element(el) { el.setInnerContent(pricing.indie); }})
      .on('.price-studio', { element(el) { el.setInnerContent(pricing.studio); }})
      .on('.price-enterprise', { element(el) { el.setInnerContent(pricing.enterprise); }});
    
    return rewriter.transform(response);
  }
}
```

---

### 8. Smart Redirects & URL Shortener

```javascript
// /go/:slug
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const slug = url.pathname.replace('/go/', '');
    
    const redirects = {
      'trial': 'https://tally.so/r/mZDq7v?utm_source=shortlink',
      'discord': 'https://discord.com/invite/pBDSCBcdgv',
      'docs': 'https://unrealsolutions.com/docs/',
      'bugit': 'https://unrealsolutions.com/products/bugit/',
    };
    
    const target = redirects[slug];
    if (!target) {
      return new Response('Not found', { status: 404 });
    }
    
    // Track click
    await env.CLICKS.put(`${slug}:${Date.now()}`, JSON.stringify({
      timestamp: new Date().toISOString(),
      referer: request.headers.get('Referer'),
      country: request.headers.get('CF-IPCountry')
    }));
    
    return Response.redirect(target, 302);
  }
}
```

---

## Implementation Priority

| Worker | Value | Effort | Priority |
|--------|-------|--------|----------|
| LLM Tracking | High | Low | 1 |
| API Key Validation Endpoint | High | Medium | 2 |
| Self-Service Key Generation | Very High | High | 3 |
| Download Gating | Medium | Medium | 4 |
| Contact Form Handler | Medium | Low | 5 |
| A/B Testing | Medium | Medium | 6 |
| Geo Pricing | Low | Medium | 7 |
| URL Shortener | Low | Low | 8 |

---

## Architecture Overview

```
                    ┌─────────────────────────────────┐
                    │         Cloudflare Edge         │
                    │                                 │
                    │  ┌─────────────────────────┐   │
User ──────────────►│  │    Workers (Edge Code)   │   │
                    │  │                          │   │
                    │  │  • /api/validate-key     │   │
                    │  │  • /api/generate-trial   │   │
                    │  │  • /api/track            │   │
                    │  │  • /api/contact          │   │
                    │  │  • A/B Testing Middleware│   │
                    │  └───────────┬──────────────┘   │
                    │              │                   │
                    │  ┌───────────▼──────────────┐   │
                    │  │     KV / D1 Storage      │   │
                    │  │                          │   │
                    │  │  • API Keys              │   │
                    │  │  • Analytics             │   │
                    │  │  • Contacts              │   │
                    │  └───────────┬──────────────┘   │
                    │              │                   │
                    └──────────────┼───────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │      GitHub Pages (Origin)       │
                    │                                  │
                    │  • Static HTML/CSS/JS            │
                    │  • VitePress Docs                │
                    │  • rvr_trial.bin (backup)        │
                    └──────────────────────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │      GitHub Actions (Sync)       │
                    │                                  │
                    │  • Triggered by Workers          │
                    │  • Updates rvr_trial.bin         │
                    │  • Deploys site                  │
                    └──────────────────────────────────┘
```

---

## Cost Estimate (Cloudflare Free Tier)

| Service | Free Tier | Likely Usage |
|---------|-----------|--------------|
| Workers | 100K requests/day | Well under |
| KV | 100K reads/day, 1K writes/day | Well under |
| D1 (Database) | 5M rows read, 100K writes | Well under |
| Analytics Engine | 100K events/day | Well under |

**Verdict**: Free tier should cover everything for current scale.

---

## Next Steps

1. **Set up Cloudflare** for the domain (basic proxy)
2. **Deploy LLM Tracking Worker** (quick win)
3. **Evaluate self-service key generation** (biggest UX improvement)
4. **Consider API key validation endpoint** (if plugin can be updated)
