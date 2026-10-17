/**
 * Open Call forms for the homepage (visual artist IP accelerator).
 * Any [data-open-form="start"] element opens the matching Tally
 * form as a popup, forwards attribution as Tally hidden fields, and fires GA4:
 *   form_open      when the popup opens
 *   generate_lead  on submit (lead_type: sketch_request)
 *
 * Paste the Tally form IDs below once the forms exist (tally.so/r/<ID>).
 * Until then the buttons fall back to an email to business@unrealsolutions.com.
 * Add hidden fields source, medium, campaign, originPage to each Tally form.
 */

(function () {
  'use strict';
  if (window.__usOpenCallLoaded) return;
  window.__usOpenCallLoaded = true;

  var FORMS = {
    start: { tally: '', leadType: 'sketch_request', subject: 'A sketch of my world' }
  };
  var EMAIL = 'business@unrealsolutions.com';

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

  function open(type, el) {
    var form = FORMS[type];
    if (!form) return;
    var u = attribution();
    var where = (el && el.getAttribute('data-cta-location')) || 'home';
    var base = { form_type: type, cta_location: where, traffic_source: u.utm_source, traffic_medium: u.utm_medium };

    if (!form.tally) {
      ga('event', 'form_open', Object.assign({ method: 'email_fallback' }, base));
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(form.subject);
      return;
    }
    loadTally(function () {
      if (!window.Tally || typeof window.Tally.openPopup !== 'function') {
        ga('event', 'form_open', Object.assign({ method: 'fallback' }, base));
        window.open('https://tally.so/r/' + form.tally, '_blank', 'noopener');
        return;
      }
      window.Tally.openPopup(form.tally, {
        layout: 'modal', width: 560, hideTitle: true, overlay: true,
        hiddenFields: {
          source: u.utm_source || 'website',
          medium: u.utm_medium || '',
          campaign: u.utm_campaign || '',
          originPage: location.pathname
        },
        onOpen: function () { ga('event', 'form_open', Object.assign({ method: 'tally' }, base)); },
        onSubmit: function () {
          ga('event', 'generate_lead', Object.assign({ lead_type: form.leadType, value: 0, currency: 'USD' }, base));
        }
      });
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-open-form]') : null;
    if (!t) return;
    e.preventDefault();
    open(t.getAttribute('data-open-form'), t);
  });

  window.usOpenForm = open;
})();
