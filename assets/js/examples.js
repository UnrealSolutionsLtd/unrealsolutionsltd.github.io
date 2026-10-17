/**
 * Homepage examples: pick one of five sketches and see sketch + style = video.
 * Only the chosen example's video is loaded, and it starts when the section is
 * on screen. With reduced motion the video shows controls instead of autoplaying.
 */

(function () {
  'use strict';

  var LABELS = {
    whale: 'whale over a mountain village, watercolour',
    robot: 'robot watering a flower on a rooftop, clay',
    snail: 'child riding a giant snail through a mushroom forest, paper craft',
    fox: 'fox on a night train, 80s anime',
    lighthouse: 'cat at a lighthouse in a storm, risograph'
  };

  var tabs = document.querySelectorAll('.ex-tab');
  var sketch = document.getElementById('ex-sketch');
  var style = document.getElementById('ex-style');
  var video = document.getElementById('ex-video');
  var section = document.getElementById('examples');
  if (!tabs.length || !sketch || !style || !video || !section) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var onScreen = false;
  var current = null;
  if (reduce) video.controls = true;

  function ga() {
    if (typeof window.gtag === 'function') return window.gtag.apply(null, arguments);
    (window.dataLayer = window.dataLayer || []).push(arguments);
  }

  function play() {
    if (reduce || !onScreen) return;
    var p = video.play();
    if (p && p.catch) p.catch(function () { video.controls = true; });
  }

  function show(key, fromClick) {
    if (key === current) return;
    current = key;
    var base = '/assets/examples/' + key + '/';
    sketch.src = base + 'sketch.jpg';
    sketch.alt = 'Pencil sketch: ' + LABELS[key];
    style.src = base + 'style.jpg';
    style.alt = 'Style reference: ' + LABELS[key];
    video.poster = base + 'style.jpg';
    video.src = base + 'video.mp4';
    video.setAttribute('aria-label', 'Video: ' + LABELS[key]);
    if (onScreen) { video.preload = 'auto'; video.load(); play(); }
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].setAttribute('aria-selected', tabs[i].getAttribute('data-ex') === key ? 'true' : 'false');
    }
    if (fromClick) ga('event', 'select_content', { content_type: 'example', item_id: key });
  }

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () { show(this.getAttribute('data-ex'), true); });
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) {
        if (video.preload !== 'auto') { video.preload = 'auto'; video.load(); }
        play();
      } else {
        video.pause();
      }
    }, { threshold: 0.25 }).observe(section);
  } else {
    onScreen = true;
  }

  show('whale', false);
})();
