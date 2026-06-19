/**
 * Content -> Product CTA injector
 * Adds a prominent CTA near the top of /insights/ and /use-cases/ articles so
 * content readers (currently a dead-end ~27% of traffic) enter the funnel.
 *
 *  - AI / game-testing pages  -> "VLM testing agents" waitlist (fake-door demand test)
 *  - All other content pages  -> "See Runtime Video Recorder" product bridge
 *
 * CTA clicks are tagged with data-funnel-event so funnel-analytics.js fires the
 * matching GA4 event (generate_lead / select_promotion). Loaded site-wide by nav.js.
 */

(function () {
  'use strict';

  if (window.__usContentCtaLoaded) return;
  window.__usContentCtaLoaded = true;

  // VLM-agents waitlist — Tally form (https://tally.so/r/KYkvRk)
  var VLM_WAITLIST_TALLY = 'KYkvRk';

  // Hero demo video (rendered by /remotion). Leave empty until rendered — when
  // empty, no video is shown so nothing breaks. After `npm run render`, set:
  var VERA_DEMO_VIDEO = '/assets/vera-demo.mp4';
  var VERA_DEMO_POSTER = '/assets/vera-demo-poster.jpg';

  var RVR_DEST = '/recorders.html';

  // Pages where the VLM-agents waitlist is the relevant offer (topical match).
  var VLM_PAGES = [
    'mobile-game-testing-video-evidence',
    'ios-gameplay-recording-qa',
    'automated-visual-proof-gauntlet-video-integration',
    'ci-cd-video-capture-unreal-engine',
    'unreal-engine-ai-agents-mcp'
  ];

  function ga() {
    if (typeof window.gtag === 'function') return window.gtag.apply(null, arguments);
    (window.dataLayer = window.dataLayer || []).push(arguments);
  }

  function onContentPage() {
    var p = window.location.pathname;
    return p.indexOf('/insights/') > -1 || p.indexOf('/use-cases/') > -1;
  }
  function isVlmPage() {
    var p = window.location.pathname;
    for (var i = 0; i < VLM_PAGES.length; i++) { if (p.indexOf(VLM_PAGES[i]) > -1) return true; }
    return false;
  }

  var STYLE = `
.us-content-cta {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  max-width: 880px; margin: 16px auto 8px; padding: 16px 20px;
  background: linear-gradient(135deg, rgba(99,102,241,.12), rgba(17,24,39,.55));
  border: 1px solid rgba(99,102,241,.4); border-radius: 14px;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.us-content-cta--vlm {
  background: linear-gradient(135deg, rgba(16,185,129,.12), rgba(17,24,39,.55));
  border-color: rgba(16,185,129,.45);
}
.us-cta-badge {
  flex: none; align-self: flex-start;
  font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
  color: #34d399; background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.4);
  padding: 3px 8px; border-radius: 999px;
}
.us-cta-text { flex: 1 1 320px; min-width: 240px; color: #cbd5e1; font-size: 14px; line-height: 1.5; }
.us-cta-text strong { color: #fff; }
.us-cta-btn {
  flex: none; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; border-radius: 10px;
  background: #4f46e5; color: #fff !important; font-weight: 600; font-size: 14px; text-decoration: none;
  transition: background .15s ease, transform .15s ease;
}
.us-content-cta--vlm .us-cta-btn { background: #059669; }
.us-cta-btn:hover { background: #4338ca; transform: translateY(-1px); }
.us-content-cta--vlm .us-cta-btn:hover { background: #047857; }
@media (max-width: 640px) { .us-content-cta { margin: 12px; } .us-cta-btn { width: 100%; justify-content: center; } }

.us-vera-demo {
  position: relative; max-width: 880px; margin: 0 auto 14px;
  border-radius: 16px; overflow: hidden; line-height: 0;
  border: 1px solid rgba(16,185,129,.35);
  box-shadow: 0 16px 48px rgba(0,0,0,.45); background: #0a0e14;
}
.us-vera-demo__video { display: block; width: 100%; height: auto; }
.us-vera-demo__tag {
  position: absolute; top: 12px; left: 12px; z-index: 2; line-height: 1.2;
  font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: #cbd5e1; background: rgba(10,14,20,.7); border: 1px solid rgba(148,163,184,.3);
  padding: 4px 9px; border-radius: 999px;
}
@media print { .us-content-cta, .us-vera-demo { display: none; } }
`;

  function buildVlm() {
    var el = document.createElement('div');
    el.className = 'us-content-cta us-content-cta--vlm';
    el.innerHTML =
      '<span class="us-cta-badge">Meet Vera · Private Beta</span>' +
      '<div class="us-cta-text"><strong>Vera — your AI playtester.</strong> ' +
      'A vision agent that plays your build, catches bugs, and files video evidence — ' +
      'at a fraction of the cost of Gemini or Claude.</div>' +
      '<a class="us-cta-btn" href="https://tally.so/r/' + VLM_WAITLIST_TALLY + '" target="_blank" rel="noopener" ' +
      'data-funnel-event="generate_lead" data-lead-type="vlm_waitlist" data-cta-location="insights_banner">' +
      'Join the waitlist →</a>';
    ga('event', 'view_promotion', { promotion_name: 'vlm_agents_waitlist', creative_slot: 'content_top' });
    return el;
  }

  function buildRvr() {
    var el = document.createElement('div');
    el.className = 'us-content-cta';
    el.innerHTML =
      '<div class="us-cta-text"><strong>Made by the team behind Runtime Video Recorder</strong> — ' +
      'the only Unreal Engine plugin that records gameplay on desktop, mobile &amp; VR.</div>' +
      '<a class="us-cta-btn" href="' + RVR_DEST + '" ' +
      'data-funnel-event="select_promotion" data-promotion="rvr_from_content" data-cta-location="insights_banner">' +
      'See Runtime Video Recorder →</a>';
    ga('event', 'view_promotion', { promotion_name: 'rvr_from_content', creative_slot: 'content_top' });
    return el;
  }

  function inject() {
    if (!onContentPage() || document.querySelector('.us-content-cta')) return;
    var style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);
    var cta = isVlmPage() ? buildVlm() : buildRvr();

    // Pick the insertion point: TOP of the readable content (above the
    // breadcrumb/title), inside the nav-cleared zone so it never hides behind
    // the fixed nav. Fall back to above the <article> body, then top of <main>.
    var parent, before;
    var anchor = topAnchor();
    if (anchor && anchor.parentNode) {
      parent = anchor.parentNode; before = anchor;
    } else {
      var article = document.querySelector('main article') || document.querySelector('article');
      if (article && article.parentNode) {
        parent = article.parentNode; before = article;
      } else {
        parent = document.querySelector('main') || document.body;
        before = parent.firstChild;
        cta.style.marginTop = '88px';
      }
    }
    parent.insertBefore(cta, before);

    // Hero demo video, directly under the banner (Vera/AI pages, once rendered).
    var demo = isVlmPage() ? buildDemo() : null;
    if (demo) parent.insertBefore(demo, cta.nextSibling);
  }

  function buildDemo() {
    if (!VERA_DEMO_VIDEO) return null;
    var wrap = document.createElement('div');
    wrap.className = 'us-vera-demo';
    var poster = VERA_DEMO_POSTER ? ' poster="' + VERA_DEMO_POSTER + '"' : '';
    wrap.innerHTML =
      '<span class="us-vera-demo__tag">Concept preview</span>' +
      '<video class="us-vera-demo__video" autoplay muted loop playsinline preload="metadata"' + poster + '>' +
      '<source src="' + VERA_DEMO_VIDEO + '" type="video/mp4"></video>';
    return wrap;
  }

  // Top of the readable content: the breadcrumb <nav> (not the site nav),
  // falling back to the page <h1>.
  function topAnchor() {
    var navs = document.querySelectorAll('main nav');
    for (var i = 0; i < navs.length; i++) {
      if (!(navs[i].closest && navs[i].closest('#site-nav'))) return navs[i];
    }
    return document.querySelector('main h1') || null;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
