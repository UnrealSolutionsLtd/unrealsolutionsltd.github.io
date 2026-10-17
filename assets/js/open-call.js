/**
 * "Start now" on the homepage.
 * Any [data-open-form="start"] element opens the hosted Tally form in a new tab.
 * We link to the hosted page instead of an embedded popup: the popup breaks with
 * ad/privacy blockers, the hosted page doesn't.
 *
 * Attribution goes to Tally as URL params, which fill the form's hidden fields
 * (add hidden fields source, medium, campaign, originPage to the form).
 *
 * GA4:
 *   form_open      when the button is clicked
 *   generate_lead  when Tally sends the person back here after submitting
 *                  (Tally form settings > "Redirect on completion" to
 *                   https://unrealsolutions.com/?lead=harness_start)
 */

(function () {
  'use strict';
  if (window.__usOpenCallLoaded) return;
  window.__usOpenCallLoaded = true;

  var FORMS = {
    start: { tally: 'EqzAdq', leadType: 'harness_start' }
  };

  function ga() {
    if (typeof window.gtag === 'function') return window.gtag.apply(null, arguments);
    (window.dataLayer = window.dataLayer || []).push(arguments);
  }
  function attribution() {
    try { return (typeof window.getRVRUtmData === 'function' && window.getRVRUtmData()) || {}; }
    catch (e) { return {}; }
  }

  function formUrl(form) {
    var u = attribution();
    var q = new URLSearchParams({
      source: u.utm_source || 'website',
      medium: u.utm_medium || '',
      campaign: u.utm_campaign || '',
      originPage: location.pathname
    });
    return 'https://tally.so/r/' + form.tally + '?' + q.toString();
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-open-form]') : null;
    if (!t) return;
    var form = FORMS[t.getAttribute('data-open-form')];
    if (!form) return;
    e.preventDefault();
    var u = attribution();
    ga('event', 'form_open', {
      method: 'tally_page', form_type: t.getAttribute('data-open-form'),
      cta_location: t.getAttribute('data-cta-location') || 'home',
      traffic_source: u.utm_source, traffic_medium: u.utm_medium
    });
    var url = formUrl(form);
    var win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url; // new tab blocked: open it here instead
  });

  // Back from Tally after submitting: count the lead once, then tidy the URL.
  try {
    var params = new URLSearchParams(location.search);
    var lead = params.get('lead');
    var match = null;
    for (var k in FORMS) if (FORMS[k].leadType === lead) match = FORMS[k];
    if (match) {
      var u = attribution();
      ga('event', 'generate_lead', {
        lead_type: match.leadType, value: 0, currency: 'USD',
        traffic_source: u.utm_source, traffic_medium: u.utm_medium
      });
      params.delete('lead');
      var rest = params.toString();
      history.replaceState(null, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
    }
  } catch (e) { /* ignore */ }
})();
