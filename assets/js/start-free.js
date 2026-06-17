/**
 * "Start Free" — opens the Tally trial form (mZDq7v) as a popup.
 * Any [data-start-free] element triggers it. Forwards attribution as Tally
 * hidden fields and fires GA4 funnel events (start_free_open, generate_lead,
 * trial_key_requested).
 *
 * Key generation happens on Tally's side:
 *   form submit -> Make/relay -> generate_api_key.yml -> key emailed.
 *
 * Tally's embed script is loaded on demand; for a snappier first open, also add
 *   <script async src="https://tally.so/widgets/embed.js"></script>
 * to the page (done on index.html).
 */

(function () {
  'use strict';
  if (window.__usStartFreeLoaded) return;
  window.__usStartFreeLoaded = true;

  var TALLY_FORM = 'mZDq7v';

  function ga() {
    if (typeof window.gtag === 'function') return window.gtag.apply(null, arguments);
    (window.dataLayer = window.dataLayer || []).push(arguments);
  }
  function attribution() {
    try { return (typeof window.getRVRUtmData === 'function' && window.getRVRUtmData()) || {}; }
    catch (e) { return {}; }
  }

  function loadTally(cb) {
    if (window.Tally) return cb();
    var src = 'https://tally.so/widgets/embed.js';
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) { existing.addEventListener('load', cb); existing.addEventListener('error', cb); return; }
    var s = document.createElement('script');
    s.src = src; s.async = true; s.onload = cb; s.onerror = cb;
    document.body.appendChild(s);
  }

  function open() {
    var u = attribution();
    loadTally(function () {
      if (!window.Tally || typeof window.Tally.openPopup !== 'function') {
        // Fallback: open the hosted form in a new tab if the embed script is blocked.
        ga('event', 'start_free_open', { method: 'fallback' });
        window.open('https://tally.so/r/' + TALLY_FORM, '_blank', 'noopener');
        return;
      }
      window.Tally.openPopup(TALLY_FORM, {
        layout: 'modal',
        width: 500,
        hideTitle: true,
        overlay: true,
        // These populate matching Tally "hidden fields" (add them in the form):
        hiddenFields: {
          source: u.utm_source || 'website',
          medium: u.utm_medium || '',
          campaign: u.utm_campaign || '',
          originPage: location.pathname
        },
        onOpen: function () {
          ga('event', 'start_free_open', { method: 'tally' });
        },
        onSubmit: function () {
          ga('event', 'generate_lead', {
            lead_type: 'free_trial', value: 0, currency: 'USD',
            traffic_source: u.utm_source, traffic_medium: u.utm_medium
          });
          ga('event', 'trial_key_requested', { method: 'tally' });
        }
      });
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-start-free]') : null;
    if (!t) return;
    e.preventDefault();
    open();
  });

  window.usStartFree = open;
})();
