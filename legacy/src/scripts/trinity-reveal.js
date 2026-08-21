/* ==========================================================================
   Trinity — entrance animations (shared)

   Hero content rises in on load; everything below reveals as it scrolls into
   view, staggered within each group. One implementation for every page, so
   the motion is identical across the site.

   A page declares WHAT to reveal via  data-reveal="sel, sel, ..."  on <body>;
   the timing, easing and distance live here. Elements are hidden by JS, never
   by the stylesheet, so with JS off or on error the page is simply visible.

   Respects prefers-reduced-motion: no tagging at all, nothing animates.
   ========================================================================== */
(function () {
  'use strict';

  var HERO_DELAY = 0.24;   // s before the first hero element moves (after the chrome)
  var CHROME_STEP = 0.07;  // s between the rule bar and the masthead
  var HERO_STEP  = 0.12;   // s between hero elements
  var GROUP_STEP = 0.10;   // s between items within a revealed group

  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function tag(el, i) {
      if (!el || el.classList.contains('rv')) return;
      // data-reveal-skip opts an element (and its subtree) out of being hidden —
      // used for conversion objects that must never be delayed or transformed.
      if (el.closest('[data-reveal-skip]')) return;
      el.classList.add('rv');
      el.style.setProperty('--rd', ((i || 0) * GROUP_STEP).toFixed(2) + 's');
    }

    // --- on load: the chrome settles, then the hero rises --------------------
    // Both flip in the same pair of frames so they read as one arrival rather
    // than two animations that happen to overlap.
    var onLoad = [];

    var chrome = [document.querySelector('.rule-bar'), document.querySelector('.masthead')];
    chrome.forEach(function (el, i) {
      if (!el) return;
      el.classList.add('rv-chrome');
      el.style.setProperty('--rd', (i * CHROME_STEP).toFixed(2) + 's');
      onLoad.push(el);
    });

    var hero = document.querySelector('[data-reveal-hero]') || document.querySelector('.hero-inner, .hero-copy');
    if (hero) {
      [].slice.call(hero.children).forEach(function (el, i) {
        tag(el, i);
        el.style.setProperty('--rd', (HERO_DELAY + i * HERO_STEP).toFixed(2) + 's');
        onLoad.push(el);
      });
    }

    // two frames so the initial (hidden) state is painted before we flip it
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        onLoad.forEach(function (el) { el.classList.add('in'); });

        // The masthead is also the sticky nav, which animates with its own
        // transform. Hand it back once the settle has played, so the two never
        // fight over the same property. Timed from HERE, not from init: on a
        // throttled tab these frames can be ~500ms apart, and an independent
        // timer would strip the classes before they were ever applied.
        setTimeout(function () {
          chrome.forEach(function (el) {
            if (!el) return;
            el.classList.remove('rv-chrome', 'in');
            el.style.removeProperty('--rd');
          });
        }, 900);
      });
    });

    // --- everything else: reveals on scroll ---------------------------------
    // Every section opener, plus whatever groups the page declares.
    document.querySelectorAll('h2').forEach(function (h) { tag(h.parentElement, 0); });

    var declared = (document.body.getAttribute('data-reveal') || '')
      .split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    declared.forEach(function (sel) {
      try { document.querySelectorAll(sel).forEach(tag); } catch (e) { /* bad selector — skip */ }
    });

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.rv:not(.in)').forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
