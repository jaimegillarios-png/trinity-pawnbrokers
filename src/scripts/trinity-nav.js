/* ==========================================================================
   Trinity — mobile navigation

   Progressive enhancement. The markup ships with the nav visible and the
   burger hidden, so with JS off the masthead simply stacks and every link is
   reachable. This script reveals the burger and collapses the nav behind it.

   State lives on <html> as data-nav="open|closed" so the CSS can key off it.
   ========================================================================== */
(function () {
  'use strict';

  var BREAKPOINT = 760; // must match the media query in trinity-components.css

  function init() {
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

    // Never leave the menu "closed" behind a burger that is no longer shown
    var wide = window.matchMedia('(min-width: ' + (BREAKPOINT + 1) + 'px)');
    var onChange = function () { if (wide.matches && isOpen()) setOpen(false); };
    wide.addEventListener ? wide.addEventListener('change', onChange) : wide.addListener(onChange);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
