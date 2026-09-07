/**
 * Turns the stack of photographs into a gallery.
 *
 * The markup ships every image visible, so this is an enhancement rather than
 * a requirement: if it never runs, the page is a long column of photographs,
 * which is worse-looking but entirely usable. Everything it hides, it hides
 * only after deciding it can do the job.
 */
(function () {
  document.querySelectorAll('[data-gallery]').forEach(function (root) {
    var frames = Array.prototype.slice.call(root.querySelectorAll('[data-gallery-frame]'));
    var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-gallery-thumb]'));
    if (frames.length < 2) return;

    var counter = root.querySelector('[data-gallery-count]');
    var prev = root.querySelector('[data-gallery-prev]');
    var next = root.querySelector('[data-gallery-next]');
    var rail = root.querySelector('[data-gallery-thumb]') && thumbs[0].parentElement;
    var railPrev = root.querySelector('[data-rail-prev]');
    var railNext = root.querySelector('[data-rail-next]');
    var index = 0;

    root.setAttribute('data-ready', 'true');
    [prev, next, counter].forEach(function (el) { if (el) el.hidden = false; });

    function show(to) {
      index = (to + frames.length) % frames.length;
      frames.forEach(function (frame, i) {
        frame.hidden = i !== index;
        /* Leaving a frame while it is playing should stop it — otherwise the
           sound follows you through the rest of the photographs. */
        if (i !== index) {
          var playing = frame.querySelector('video');
          if (playing && !playing.paused) playing.pause();
        }
      });
      thumbs.forEach(function (thumb, i) {
        thumb.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      if (counter) counter.textContent = index + 1 + ' / ' + frames.length;

      var active = thumbs[index];
      if (active && active.scrollIntoView) {
        active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      updateRailArrows();
    }

    /* An arrow that cannot move is worse than no arrow, so each one appears
       only while the rail has somewhere to go on that side. The rail is
       hidden entirely on a phone, where the buttons would be measuring a
       zero-width element — hence the offsetParent check. */
    function updateRailArrows() {
      if (!rail || !railPrev || !railNext) return;
      if (!rail.offsetParent) {
        railPrev.hidden = true;
        railNext.hidden = true;
        return;
      }
      var max = rail.scrollWidth - rail.clientWidth;
      railPrev.hidden = max <= 1 || rail.scrollLeft <= 1;
      railNext.hidden = max <= 1 || rail.scrollLeft >= max - 1;
    }

    function slide(direction) {
      if (!rail) return;
      // Most of a screenful, so the eye keeps a couple of thumbnails as anchors.
      rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: 'smooth' });
    }

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () { show(i); });
    });
    if (prev) prev.addEventListener('click', function () { show(index - 1); });
    if (next) next.addEventListener('click', function () { show(index + 1); });
    if (railPrev) railPrev.addEventListener('click', function () { slide(-1); });
    if (railNext) railNext.addEventListener('click', function () { slide(1); });
    if (rail) rail.addEventListener('scroll', updateRailArrows, { passive: true });
    window.addEventListener('resize', updateRailArrows);

    /* Arrow keys, but only while the gallery has focus — hijacking them for
       the whole page would break scrolling everywhere else. */
    root.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { show(index - 1); event.preventDefault(); }
      if (event.key === 'ArrowRight') { show(index + 1); event.preventDefault(); }
    });

    show(0);
    updateRailArrows();
  });
})();
