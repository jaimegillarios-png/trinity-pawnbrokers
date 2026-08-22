/* ==========================================================================
   Trinity — asset page behaviours
   Shared by all six asset pages. Progressive enhancement only: with JS off
   the page is still readable — both form steps and every FAQ answer render.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 1. Valuation form: 2 steps with a directional slide -------------- */
  function initValuationForm(root) {
    var panes = root.querySelectorAll('[data-step]');
    var label = root.querySelector('[data-step-label]');
    if (!panes.length) return;

    var labels = {
      1: 'Step 1 of 2 · Your watch',
      2: 'Step 2 of 2 · Where to send your offer'
    };
    // Pages can override the step labels without touching this file.
    try {
      var custom = JSON.parse(root.getAttribute('data-step-labels') || 'null');
      if (custom) labels = custom;
    } catch (e) { /* keep defaults */ }

    function show(step, dir) {
      panes.forEach(function (pane) {
        var isTarget = pane.getAttribute('data-step') === String(step);
        pane.hidden = !isTarget;
        // A hidden field that is still required blocks submission, and the
        // browser reports it against an element nobody can see or focus.
        // Disabling the hidden pane takes its fields out of validation and
        // out of the submitted data, which is what we want either way.
        pane.querySelectorAll('input, select, textarea').forEach(function (el) {
          el.disabled = !isTarget;
        });
        if (!isTarget) return;
        pane.classList.toggle('step-back', dir === 'back');
        // restart the CSS animation
        pane.style.animation = 'none';
        void pane.offsetWidth;
        pane.style.animation = '';
      });
      if (label && labels[step]) label.textContent = labels[step];
    }

    root.addEventListener('click', function (e) {
      var next = e.target.closest('[data-step-next]');
      var back = e.target.closest('[data-step-back]');
      if (!next && !back) return;
      e.preventDefault();
      show(next ? next.getAttribute('data-step-next') : back.getAttribute('data-step-back'),
           next ? 'next' : 'back');
      root.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });

    show(1, 'next'); // JS on: collapse to a real 2-step flow
  }

  /* ---- 2. How-it-works: fill the connector, light the badges ------------ */
  function initHowItWorks(section) {
    if (!section || !('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      if (!entries.some(function (e) { return e.isIntersecting; })) return;
      obs.disconnect();
      var fill = section.querySelector('.how-line--fill');
      if (fill) fill.style.width = '100%';
      section.querySelectorAll('.how-num').forEach(function (el, i) {
        setTimeout(function () { el.classList.add('is-lit'); }, 250 + i * 420);
      });
    }, { threshold: 0.35 });
    obs.observe(section);
  }

  /* ---- 3. Reviews.co.uk badge — retry until the widget script lands ----- */
  function initReviewsBadge(el) {
    if (!el) return;
    // The widget takes literal colours, so resolve them from the token at runtime
    // rather than hard-coding a hex in the markup.
    var token = getComputedStyle(document.documentElement)
      .getPropertyValue(el.getAttribute('data-colour-token') || '--tr-gold-deep').trim();
    var tries = 0;
    (function attempt() {
      if (typeof window.reviewsBadgeModern === 'function') {
        window.reviewsBadgeModern(el.id, {
          store: el.getAttribute('data-store'),
          primaryClr: token,
          starsClr: token
        });
        return;
      }
      if (tries++ < 200) requestAnimationFrame(attempt);
    })();
  }

  /* ---- 4. FAQ accordion — one open at a time ---------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initValuationForm(document.querySelector('[data-valuation-form]'));
    initHowItWorks(document.getElementById('how'));
    initReviewsBadge(document.querySelector('[data-reviews-badge]'));
  });
})();
