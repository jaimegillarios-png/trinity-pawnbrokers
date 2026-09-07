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
    }

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () { show(i); });
    });
    if (prev) prev.addEventListener('click', function () { show(index - 1); });
    if (next) next.addEventListener('click', function () { show(index + 1); });

    /* Arrow keys, but only while the gallery has focus — hijacking them for
       the whole page would break scrolling everywhere else. */
    root.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { show(index - 1); event.preventDefault(); }
      if (event.key === 'ArrowRight') { show(index + 1); event.preventDefault(); }
    });

    show(0);
  });
})();
