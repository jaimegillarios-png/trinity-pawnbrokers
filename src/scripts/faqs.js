/**
 * FAQ accordions. Shared by the item pages and /faq, so it initialises every
 * .faq-list on the page independently rather than the first one it finds.
 *
 * Open state is a data-open attribute on the item, not the `hidden` attribute
 * on the answer: hidden cannot be transitioned, and the panel needs to animate
 * its height. Screen readers are handled in CSS instead — a closed panel is
 * visibility:hidden once the transition has run, which takes it out of the
 * accessibility tree as hidden would.
 *
 * A list opens with its first answer showing, matching the item-page design.
 * A list marked data-faq-start-closed opens with none — on /faq, four groups
 * each opening one answer would push the last group off the screen.
 */
(function () {
  function initFaqs(list, index) {
    var items = Array.prototype.slice.call(list.querySelectorAll('.faq-item'));
    if (!items.length) return;

    function setOpen(target) {
      items.forEach(function (item, i) {
        var open = i === target;
        var button = item.querySelector('.faq-q');
        if (open) item.setAttribute('data-open', '');
        else item.removeAttribute('data-open');
        button.setAttribute('aria-expanded', String(open));
      });
    }

    items.forEach(function (item, i) {
      var button = item.querySelector('.faq-q');
      var panel = item.querySelector('.faq-panel');
      if (!button || !panel) return;
      if (!panel.id) panel.id = 'faq-panel-' + index + '-' + i;
      button.setAttribute('aria-controls', panel.id);
      button.addEventListener('click', function () {
        setOpen(button.getAttribute('aria-expanded') === 'true' ? -1 : i);
      });
    });

    setOpen(list.hasAttribute('data-faq-start-closed') ? -1 : 0);
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice
      .call(document.querySelectorAll('.faq-list'))
      .forEach(initFaqs);
  });
})();
