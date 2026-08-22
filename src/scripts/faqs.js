/**
 * FAQ accordions. Shared by the item pages and /faq, so it initialises every
 * .faq-list on the page independently rather than the first one it finds.
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
        var answer = item.querySelector('.faq-a');
        var button = item.querySelector('.faq-q');
        var toggle = item.querySelector('.faq-toggle');
        answer.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? '−' : '+';
      });
    }

    items.forEach(function (item, i) {
      var button = item.querySelector('.faq-q');
      var answer = item.querySelector('.faq-a');
      if (!button || !answer) return;
      if (!answer.id) answer.id = 'faq-a-' + index + '-' + i;
      button.setAttribute('aria-controls', answer.id);
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
