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

  function render() {
    var slugs = (window.TrinityCart && window.TrinityCart.read()) || [];
    var rows = Array.prototype.slice.call(document.querySelectorAll('[data-cart-item]'));
    var total = 0;
    var shown = 0;

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

  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('cart:change', render);
})();
