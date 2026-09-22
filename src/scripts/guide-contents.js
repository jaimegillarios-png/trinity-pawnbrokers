/**
 * The guide's contents list: marks the section you are reading, and behaves
 * as a disclosure on a phone.
 *
 * The markup ships the list open, so it works with no JavaScript at all. On a
 * narrow screen this closes it on load — a full contents list above the first
 * paragraph pushes the guide itself off the screen — and closes it again after
 * a link is followed, so the reader lands on the section rather than the list.
 */
(function () {
  var details = document.querySelector('[data-guide-contents]');
  if (!details) return;

  var narrow = window.matchMedia('(max-width: 900px)');
  if (narrow.matches) details.open = false;

  var links = Array.prototype.slice.call(document.querySelectorAll('[data-contents-link]'));
  var sections = links
    .map(function (link) { return document.getElementById(link.getAttribute('data-contents-link')); })
    .filter(Boolean);

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      if (narrow.matches) details.open = false;
    });
  });

  if (!('IntersectionObserver' in window) || !sections.length) return;

  /* The current section is the last heading that has scrolled past the top
     third of the screen. Tracking "visible" instead would light up two at once
     whenever a short section sat between them. */
  function mark(id) {
    links.forEach(function (link) {
      var on = link.getAttribute('data-contents-link') === id;
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  var current = null;
  function update() {
    var line = window.innerHeight * 0.33;
    var active = null;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= line) active = section.id;
    });
    if (active !== current) {
      current = active;
      mark(active);
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  update();
})();
