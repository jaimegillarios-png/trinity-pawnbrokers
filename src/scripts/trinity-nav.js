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

  // --- sticky nav ----------------------------------------------------------
  // Hide on the way down, return on the way up. Reads scroll position inside a
  // rAF so a fast flick costs one measurement per frame, not one per event.
  function stickyNav() {
    var mast = document.querySelector('.masthead');
    if (!mast) return;
    var root = document.documentElement;
    var last = window.scrollY;
    var ticking = false;
    var JITTER = 8;   // px of travel before we act, so a trackpad nudge is ignored

    function measure() { root.style.setProperty('--tr-mast-h', mast.offsetHeight + 'px'); }
    measure();
    window.addEventListener('resize', measure);
    root.setAttribute('data-mast', 'shown');

    function show() { root.setAttribute('data-mast', 'shown'); }
    // Tabbing into a hidden nav would otherwise focus something off-screen
    mast.addEventListener('focusin', show);

    // While the hero is on screen the nav stays out of it entirely. Sticky
    // means anything within the nav's own height scrolls underneath it, and
    // the hero's first line is right there — so scrolling back up towards the
    // top slid the eyebrow under a nav that was showing, and the hero's top
    // padding appeared to vanish. Padding cannot fix that (it only moves the
    // point where it happens); keeping the nav away from the hero can.
    var hero = document.querySelector('.hero');
    var bar = document.querySelector('.rule-bar');
    // Below this the nav is still in normal flow and cannot overlap anything.
    function stickPoint() { return bar ? bar.offsetHeight : 0; }
    function inHero(y) {
      if (!hero) return false;
      return y < hero.offsetTop + hero.offsetHeight - mast.offsetHeight;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var y = window.scrollY;
        var delta = y - last;
        if (Math.abs(delta) < JITTER) return;   // leave `last` alone so small moves accumulate
        // Never retract while the mobile menu is open, or near the top of the
        // page where there is nothing to gain by hiding.
        if (root.getAttribute('data-nav') === 'open' || y <= stickPoint()) show();
        else if (inHero(y)) root.setAttribute('data-mast', 'hidden');
        else root.setAttribute('data-mast', delta > 0 ? 'hidden' : 'shown');
        last = y;
      });
    }, { passive: true });
  }

  function init() {
    anchors();
    var burger = document.querySelector('.tr-burger');
    var masthead = document.querySelector('.masthead-grid');
    if (!burger || !masthead) return;

    var root = document.documentElement;
    burger.hidden = false;              // JS is running — the burger is now the control
    root.setAttribute('data-nav', 'closed');

    // Only now is the nav collapsed, so the masthead measures its real height.
    // Called earlier it read 261px — the full open-menu height — and every
    // anchor would have scrolled to a target sitting 200px too low.
    stickyNav();

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
