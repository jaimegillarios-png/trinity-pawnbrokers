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

  var HERO_DELAY = 0.15;   // s before the first hero element moves
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

    // --- hero: plays on load, not on scroll ---------------------------------
    var hero = document.querySelector('[data-reveal-hero]') || document.querySelector('.hero-inner, .hero-copy');
    if (hero) {
      var seq = [].slice.call(hero.children);
      seq.forEach(function (el, i) {
        tag(el, i);
        el.style.setProperty('--rd', (HERO_DELAY + i * HERO_STEP).toFixed(2) + 's');
      });
      // two frames so the initial (hidden) state is painted before we flip it
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          seq.forEach(function (el) { el.classList.add('in'); });
        });
      });
    }

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
