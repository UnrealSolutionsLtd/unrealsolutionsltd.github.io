/**
 * Content -> Product CTA injector
 * Adds a prominent CTA near the top of /insights/ and /use-cases/ articles so
 * content readers (currently a dead-end ~27% of traffic) enter the funnel.
 *
 * Every content page gets the "See Runtime Video Recorder" product bridge.
 *
 * CTA clicks are tagged with data-funnel-event so funnel-analytics.js fires the
 * matching GA4 event (generate_lead / select_promotion). Loaded site-wide by nav.js.
 */

(function () {
  'use strict';

  if (window.__usContentCtaLoaded) return;
  window.__usContentCtaLoaded = true;

  var RVR_DEST = '/recorders.html';

  function ga() {
    if (typeof window.gtag === 'function') return window.gtag.apply(null, arguments);
    (window.dataLayer = window.dataLayer || []).push(arguments);
  }

  function onContentPage() {
    var p = window.location.pathname;
    return p.indexOf('/insights/') > -1 || p.indexOf('/use-cases/') > -1;
  }

  var STYLE = `
.us-content-cta {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  max-width: 880px; margin: 16px auto 8px; padding: 16px 20px;
  background: linear-gradient(135deg, rgba(99,102,241,.12), rgba(17,24,39,.55));
  border: 1px solid rgba(99,102,241,.4); border-radius: 14px;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.us-cta-text { flex: 1 1 320px; min-width: 240px; color: #cbd5e1; font-size: 14px; line-height: 1.5; }
.us-cta-text strong { color: #fff; }
.us-cta-btn {
  flex: none; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; border-radius: 10px;
  background: #4f46e5; color: #fff !important; font-weight: 600; font-size: 14px; text-decoration: none;
  transition: background .15s ease, transform .15s ease;
}
.us-cta-btn:hover { background: #4338ca; transform: translateY(-1px); }
@media (max-width: 640px) { .us-content-cta { margin: 12px; } .us-cta-btn { width: 100%; justify-content: center; } }
@media print { .us-content-cta { display: none; } }
`;

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
    var cta = buildRvr();

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
