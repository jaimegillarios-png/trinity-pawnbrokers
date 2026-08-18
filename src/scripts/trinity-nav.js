/* ==========================================================================
   Trinity — mobile navigation

   Progressive enhancement. The markup ships with the nav visible and the
   burger hidden, so with JS off the masthead simply stacks and every link is
   reachable. This script reveals the burger and collapses the nav behind it.

   State lives on <html> as data-nav="open|closed" so the CSS can key off it.
   ========================================================================== */
(function () {
  'use strict';

  // --- in-page links -------------------------------------------------------
  // Scroll even when the hash is already current. Each asset page has TWO
  // CTAs pointing at #value-form, so clicking the one in the closing band
  // after the one in the hero would otherwise do nothing at all — the browser
  // sees no change of hash and stays put. Falls back to the default anchor
  // jump if this script never runs.
  function anchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  }

  function init() {
    anchors();
    var burger = document.querySelector('.tr-burger');
    var masthead = document.querySelector('.masthead-grid');
    if (!burger || !masthead) return;

    var root = document.documentElement;
    burger.hidden = false;              // JS is running — the burger is now the control
    root.setAttribute('data-nav', 'closed');

    function setOpen(open) {
      root.setAttribute('data-nav', open ? 'open' : 'closed');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    }
    var isOpen = function () { return root.getAttribute('data-nav') === 'open'; };

    burger.addEventListener('click', function () { setOpen(!isOpen()); });

    // Close after following a link (same-page anchors would otherwise leave it open)
    masthead.addEventListener('click', function (e) {
      if (e.target.closest('a') && isOpen()) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { setOpen(false); burger.focus(); }
    });

    // Never leave the menu "closed" behind a burger that is no longer shown.
    // Asking whether the burger is actually rendered beats duplicating the
    // breakpoint here — the media query in trinity-components.css stays the
    // single place the number is written, so the two cannot drift apart.
    var queued = false;
    window.addEventListener('resize', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        var hidden = getComputedStyle(burger).display === 'none';
        if (hidden && isOpen()) setOpen(false);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
