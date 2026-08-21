/* ==========================================================================
   Trinity — homepage

   Ported from the inline script on the original index.html.
   ========================================================================== */
(function () {
  'use strict';

  function init() {
    // "How it works" — fill the connecting line and light the numerals when
    // the section scrolls into view.
    var how = document.getElementById('how');
    if (!how || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      if (!entries.some(function (e) { return e.isIntersecting; })) return;
      observer.disconnect();

      var fill = document.getElementById('how-fill');
      if (fill) fill.style.width = '100%';

      var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.querySelectorAll('.how-num').forEach(function (el, i) {
        var delay = still ? 0 : 250 + i * 420;
        setTimeout(function () { el.style.color = 'var(--tr-gold-deep)'; }, delay);
      });
    }, { threshold: 0.35 });

    observer.observe(how);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
