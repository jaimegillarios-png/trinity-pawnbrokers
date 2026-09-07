/**
 * Fills in the confirmation page from /api/order.
 *
 * The page is prerendered and the order is fetched here, because a
 * server-rendered page does not survive deployment to Cloudflare Pages — see
 * the note at the top of order-confirmed.astro.
 */
(function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('session_id');

  function show(name) {
    ['loading', 'missing', 'found'].forEach(function (key) {
      var el = document.querySelector('[data-order-' + key + ']');
      if (el) el.hidden = key !== name;
    });
  }

  function money(pence) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: pence % 100 === 0 ? 0 : 2,
    }).format(pence / 100);
  }

  function set(selector, text) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = text;
    });
  }

  if (!id) {
    window.location.replace('/shop');
    return;
  }

  fetch('/api/order?session_id=' + encodeURIComponent(id), { headers: { accept: 'application/json' } })
    .then(function (r) { return r.json(); })
    .then(function (order) {
      if (!order || order.state === 'unknown') return show('missing');

      set('[data-order-ref]', order.reference);
      set(
        '[data-order-heading]',
        order.state === 'paid' ? 'Thank you — that is yours' : 'Thank you — payment is clearing',
      );

      var intro =
        order.state === 'paid'
          ? 'We have taken the piece off sale and it is being prepared for despatch.'
          : 'Your payment method settles over a day or two. We have held the piece for you and will confirm the moment it clears.';
      if (order.email) intro += ' A confirmation is on its way to ' + order.email + '.';
      set('[data-order-intro]', intro);

      var list = document.querySelector('[data-order-lines]');
      list.innerHTML = '';
      (order.lines || []).forEach(function (line) {
        var li = document.createElement('li');
        li.className = 'confirm__row';
        var name = document.createElement('span');
        name.className = 'confirm__name';
        name.textContent = line.name;
        var amount = document.createElement('span');
        amount.className = 'confirm__amount';
        amount.textContent = money(line.amount);
        li.appendChild(name);
        li.appendChild(amount);
        list.appendChild(li);
      });

      set('[data-order-total]', money(order.total || 0));
      show('found');

      /* Paid for, so it is no longer "being considered". Only on an order we
         actually found, so a stale link does not empty someone's cart. */
      if (window.TrinityCart) window.TrinityCart.clear();
    })
    .catch(function () { show('missing'); });
})();
