/**
 * Standardized GA4 Funnel Instrumentation
 * One shared layer that fires GA4-recommended funnel events consistently on
 * every page, regardless of per-page markup or legacy event handlers.
 *
 * Funnel:
 *   Land     -> session_start            (automatic, GA4)
 *   Engage   -> view_item / select_content (pricing in view, demo video)
 *   Intent   -> begin_checkout           (any Stripe buy link, with value+currency)
 *   Lead     -> generate_lead            (Perpetual Tally form + business@ mailto)
 *
 * Usage:  <script src="/assets/js/funnel-analytics.js" defer></script>
 * Self-contained, no dependencies. Sends NEW standard event names, so it does
 * not collide with the existing legacy events (buy_license_click, etc.).
 */

(function () {
  'use strict';

  if (window.__usFunnelLoaded) return;
  window.__usFunnelLoaded = true;

  // --- Product catalog, keyed by the Stripe Payment Link id ----------------
  var CHECKOUTS = [
    { match: '28E00keo69T54zHe7xdIA0d', item_id: 'rvr_standard',     item_name: 'RVR Standard License', price: 299,   plan: 'one_time' },
    { match: '9B6fZibbU3uHeah3sTdIA0g', item_id: 'rvr_subscription', item_name: 'RVR Subscription',     price: 24.99, plan: 'subscription' }
  ];
  var LEAD_TALLY  = 'tally.so/r/mZDq7v';                 // Perpetual "Contact Us"
  var LEAD_MAILTO = 'mailto:business@unrealsolutions.com'; // sales/quote email
  var CURRENCY = 'USD';
  // -------------------------------------------------------------------------

  function ga() {
    if (typeof window.gtag === 'function') return window.gtag.apply(null, arguments);
    (window.dataLayer = window.dataLayer || []).push(arguments);
  }

  // Pull attribution set up by the page's UTM block, if present.
  function attribution() {
    try {
      var u = (typeof window.getRVRUtmData === 'function') ? window.getRVRUtmData() : null;
      if (u) return { traffic_source: u.utm_source, traffic_medium: u.utm_medium, traffic_campaign: u.utm_campaign };
    } catch (e) { /* ignore */ }
    return {};
  }

  function merge(base, extra) {
    for (var k in extra) if (extra[k] != null) base[k] = extra[k];
    return base;
  }

  function fireBeginCheckout(cfg, el) {
    ga('event', 'begin_checkout', merge({
      currency: CURRENCY,
      value: cfg.price,
      items: [{ item_id: cfg.item_id, item_name: cfg.item_name, price: cfg.price, quantity: 1, item_category: cfg.plan }],
      plan_type: cfg.plan,
      cta_location: (el && el.getAttribute('data-cta-position')) || 'pricing'
    }, attribution()));
  }

  function fireLead(leadType, el) {
    ga('event', 'generate_lead', merge({
      currency: CURRENCY,
      value: 0,
      lead_type: leadType,
      cta_location: (el && (el.getAttribute('data-cta-position') || (el.textContent || '').trim().slice(0, 40))) || leadType
    }, attribution()));
  }

  // Single capture-phase listener handles every current and future link.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';

    for (var i = 0; i < CHECKOUTS.length; i++) {
      if (href.indexOf(CHECKOUTS[i].match) > -1) { fireBeginCheckout(CHECKOUTS[i], a); return; }
    }
    if (href.indexOf(LEAD_TALLY) > -1) { fireLead('perpetual_quote', a); return; }
    if (href.toLowerCase().indexOf(LEAD_MAILTO) === 0) { fireLead('sales_email', a); return; }
    if (href.indexOf('youtu.be') > -1 || href.indexOf('youtube.com/watch') > -1) {
      ga('event', 'select_content', merge({ content_type: 'video', item_id: 'demo_video' }, attribution()));
      return;
    }
  }, true);

  // view_item once the pricing/licensing section scrolls into view.
  function watchPricing() {
    var el = document.getElementById('licensing') || document.querySelector('[data-pricing]');
    if (!el || !('IntersectionObserver' in window)) return;
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting && !fired) {
          fired = true;
          io.disconnect();
          ga('event', 'view_item', merge({
            currency: CURRENCY,
            value: 299,
            items: [
              { item_id: 'rvr_subscription', item_name: 'RVR Subscription',     price: 24.99, item_category: 'subscription' },
              { item_id: 'rvr_standard',     item_name: 'RVR Standard License', price: 299,   item_category: 'one_time' },
              { item_id: 'rvr_perpetual',    item_name: 'RVR Perpetual License', price: 0,     item_category: 'enterprise' }
            ]
          }, attribution()));
        }
      }
    }, { threshold: 0.4 });
    io.observe(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchPricing);
  } else {
    watchPricing();
  }
})();
