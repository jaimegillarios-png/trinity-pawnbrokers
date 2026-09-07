/**
 * The cart. Kept in localStorage because every piece is unique and the basket
 * is nearly always one item — a server-side cart would be a database and a
 * session for something the browser can hold on its own.
 *
 * Stored as an array of slugs. Prices and titles are never stored: they are
 * read from the page at render time, so a price change cannot be carried
 * around in someone's browser, and the server prices the order at checkout
 * regardless.
 */
(function () {
  var KEY = 'trinity-cart';

  function read() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter(function (s) { return typeof s === 'string'; }) : [];
    } catch (e) {
      return [];               // private window, cleared storage, quota
    }
  }

  function write(slugs) {
    try {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    } catch (e) {
      /* nothing sensible to do; the page still works, the cart just won't persist */
    }
    paint();
    document.dispatchEvent(new CustomEvent('cart:change', { detail: { slugs: slugs } }));
  }

  function paint() {
    var slugs = read();
    Array.prototype.forEach.call(document.querySelectorAll('[data-cart-count]'), function (el) {
      el.textContent = String(slugs.length);
      el.hidden = slugs.length === 0;
    });
    // A piece already in the cart says so rather than offering to add it twice.
    Array.prototype.forEach.call(document.querySelectorAll('[data-add-to-cart]'), function (btn) {
      var inCart = slugs.indexOf(btn.getAttribute('data-add-to-cart')) !== -1;
      btn.setAttribute('data-in-cart', inCart ? 'true' : 'false');
      var label = btn.querySelector('[data-add-label]');
      if (label) label.textContent = inCart ? 'In your cart' : btn.getAttribute('data-label-idle');
    });
  }

  window.TrinityCart = {
    read: read,
    add: function (slug) { var s = read(); if (s.indexOf(slug) === -1) { s.push(slug); write(s); } },
    remove: function (slug) { write(read().filter(function (x) { return x !== slug; })); },
    clear: function () { write([]); },
  };

  document.addEventListener('DOMContentLoaded', function () {
    paint();

    document.addEventListener('click', function (event) {
      var add = event.target.closest ? event.target.closest('[data-add-to-cart]') : null;
      if (add) {
        event.preventDefault();
        var slug = add.getAttribute('data-add-to-cart');
        if (read().indexOf(slug) === -1) window.TrinityCart.add(slug);
        else window.location.href = '/shop/cart';
        return;
      }
      var remove = event.target.closest ? event.target.closest('[data-remove-from-cart]') : null;
      if (remove) {
        event.preventDefault();
        window.TrinityCart.remove(remove.getAttribute('data-remove-from-cart'));
      }
    });
  });

  // Another tab changed the cart.
  window.addEventListener('storage', function (e) { if (e.key === KEY) paint(); });
})();
