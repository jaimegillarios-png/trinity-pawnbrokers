/**
 * Shows the rows for whatever is in the cart, and totals them.
 *
 * Every product is already in the page, hidden. The prices come from
 * data-price attributes written by the server at build time, never from
 * localStorage — the browser stores which pieces are in the cart, not what
 * they cost, so a stale or edited price cannot be carried into a total.
 */
(function () {
  function money(pence) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: pence % 100 === 0 ? 0 : 2,
    }).format(pence / 100);
  }

  var pruning = false;

  function render() {
    var slugs = (window.TrinityCart && window.TrinityCart.read()) || [];
    var rows = Array.prototype.slice.call(document.querySelectorAll('[data-cart-item]'));
    var total = 0;
    var shown = 0;

    /* Only pieces that were still for sale at build time have a row here. A
       cart left open across a sale keeps the slug of something since sold, and
       it would go on counting towards the badge while showing no row and no
       price — a cart claiming three items and listing two. This page is the
       one place that knows the current set, so it prunes as it renders.

       Removing dispatches cart:change, which calls this function again; the
       guard keeps that to one extra pass rather than a cascade, and the
       pruned list is used directly so the rest of the render does not depend
       on re-reading storage mid-flight. */
    var listed = rows.map(function (row) { return row.getAttribute('data-cart-item'); });
    var gone = slugs.filter(function (slug) { return listed.indexOf(slug) === -1; });
    if (gone.length && !pruning) {
      pruning = true;
      gone.forEach(function (slug) { window.TrinityCart.remove(slug); });
      pruning = false;
      slugs = slugs.filter(function (slug) { return gone.indexOf(slug) === -1; });
    }

    rows.forEach(function (row) {
      var inCart = slugs.indexOf(row.getAttribute('data-cart-item')) !== -1;
      row.hidden = !inCart;
      if (inCart) {
        total += Number(row.getAttribute('data-price')) || 0;
        shown += 1;
      }
    });

    var loading = document.querySelector('[data-cart-loading]');
    var empty = document.querySelector('[data-cart-empty]');
    var full = document.querySelector('[data-cart-full]');
    var totalEl = document.querySelector('[data-cart-total]');

    if (loading) loading.hidden = true;
    if (empty) empty.hidden = shown > 0;
    if (full) full.hidden = shown === 0;
    if (totalEl) totalEl.textContent = money(total);
  }

  /* ---- checkout ----
     Sends slugs and nothing else. The server re-reads every price from the CMS,
     checks the piece is still for sale, and holds it — so a basket edited in
     the console buys nothing it should not. */
  function checkout(button) {
    var slugs = (window.TrinityCart && window.TrinityCart.read()) || [];
    if (!slugs.length) return;

    var error = document.querySelector('[data-checkout-error]');
    var label = button.textContent;
    button.disabled = true;
    button.textContent = 'Taking you to payment…';
    if (error) error.hidden = true;

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slugs: slugs }),
    })
      .then(function (response) {
        return response.json().then(function (body) {
          return { ok: response.ok, body: body };
        });
      })
      .then(function (result) {
        if (result.ok && result.body.url) {
          window.location.href = result.body.url;
          return;
        }
        /* Something in the basket went while they were deciding. Drop it,
           re-render so they can see exactly what changed, and say so. */
        if (result.body.unavailable && result.body.unavailable.length) {
          result.body.unavailable.forEach(function (slug) {
            window.TrinityCart.remove(slug);
          });
          render();
        }
        fail(button, label, error, result.body.error || 'Something went wrong.');
      })
      .catch(function () {
        fail(button, label, error, 'We could not reach the payment page. Please try again.');
      });
  }

  function fail(button, label, error, message) {
    button.disabled = false;
    button.textContent = label;
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    var button = document.querySelector('[data-checkout]');
    if (button) {
      button.addEventListener('click', function () {
        checkout(button);
      });
    }
  });
  document.addEventListener('cart:change', render);
})();
