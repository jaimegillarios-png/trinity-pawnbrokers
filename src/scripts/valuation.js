/**
 * The valuation form: photos, sending, and the confirmation.
 *
 * Progressive enhancement. With no JavaScript the form still posts to
 * /api/valuation as multipart and the server redirects to a thank-you page. With
 * it, this takes over for three reasons:
 *
 *  1. Photos. The bare file input gives no sign anything was chosen, cannot take
 *     a drop, and sends a phone's originals at several MB each. This previews
 *     them, lets one be removed, and shrinks each to about 1600px before sending.
 *
 *  2. The stepper disables whichever step is hidden, so its fields drop out of
 *     validation — which also means `new FormData(form)` on submit would lose
 *     everything from step one, photos included. Values are read directly.
 *
 *  3. The answer. Sending in place and swapping the form for a confirmation
 *     keeps the customer on the page they were reading.
 */
(function () {
  'use strict';

  var MAX_PHOTOS = 6;
  var MAX_EDGE = 1600;
  var QUALITY = 0.82;
  var CONTACT = ['wf-name', 'wf-email', 'wf-phone', 'wf-website'];

  function init(root) {
    var form = root.querySelector('[data-valuation]');
    if (!form) return;

    var input = form.querySelector('.tr-dropzone__input');
    var zone = form.querySelector('[data-dropzone]');
    var list = form.querySelector('[data-photo-list]');
    var meta = form.querySelector('[data-photo-meta]');
    var error = form.querySelector('[data-form-error]');
    var submit = form.querySelector('[data-submit]');
    var done = root.querySelector('[data-form-done]');
    var photos = []; // { id, file, url }
    var nextId = 0;

    /* ---- photos -------------------------------------------------------- */

    function render() {
      list.innerHTML = '';
      list.hidden = photos.length === 0;
      photos.forEach(function (photo) {
        var li = document.createElement('li');
        li.className = 'tr-photos__item';

        var img = document.createElement('img');
        img.src = photo.url;
        img.alt = '';
        li.appendChild(img);

        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'tr-photos__remove';
        remove.setAttribute('aria-label', 'Remove ' + photo.file.name);
        remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
        remove.addEventListener('click', function () {
          URL.revokeObjectURL(photo.url);
          photos = photos.filter(function (p) { return p.id !== photo.id; });
          render();
        });
        li.appendChild(remove);
        list.appendChild(li);
      });

      meta.textContent = photos.length
        ? photos.length + ' of ' + MAX_PHOTOS + ' added' + (photos.length >= MAX_PHOTOS ? ' — that is the limit' : '')
        : 'Up to ' + MAX_PHOTOS + ' · JPEG, PNG or HEIC';
      zone.classList.toggle('is-full', photos.length >= MAX_PHOTOS);
    }

    function add(fileList) {
      Array.prototype.forEach.call(fileList, function (file) {
        if (!file.type || file.type.indexOf('image/') !== 0) return;
        if (photos.length >= MAX_PHOTOS) return;
        // The same photo chosen twice is almost always a slip, not intent.
        var dupe = photos.some(function (p) {
          return p.file.name === file.name && p.file.size === file.size;
        });
        if (dupe) return;
        photos.push({ id: nextId++, file: file, url: URL.createObjectURL(file) });
      });
      render();
    }

    input.addEventListener('change', function () {
      add(input.files);
      // Clear it, so choosing the same file again after removing it still fires,
      // and so the originals are never sent alongside the shrunk copies.
      input.value = '';
    });

    ['dragenter', 'dragover'].forEach(function (type) {
      zone.addEventListener(type, function (event) {
        event.preventDefault();
        zone.classList.add('is-over');
      });
    });
    ['dragleave', 'drop'].forEach(function (type) {
      zone.addEventListener(type, function (event) {
        event.preventDefault();
        zone.classList.remove('is-over');
      });
    });
    zone.addEventListener('drop', function (event) {
      if (event.dataTransfer && event.dataTransfer.files) add(event.dataTransfer.files);
    });

    /**
     * Shrink a photo to MAX_EDGE on its long side and re-encode as JPEG.
     * imageOrientation keeps a phone's portrait shots the right way up. If the
     * browser cannot decode it — HEIC dropped into Chrome, say — send the
     * original and let the server decide whether it is small enough to keep.
     */
    function shrink(file) {
      if (!window.createImageBitmap) return Promise.resolve(file);
      return createImageBitmap(file, { imageOrientation: 'from-image' })
        .then(function (bitmap) {
          var scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
          var canvas = document.createElement('canvas');
          canvas.width = Math.round(bitmap.width * scale);
          canvas.height = Math.round(bitmap.height * scale);
          canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
          if (bitmap.close) bitmap.close();
          return new Promise(function (resolve) {
            canvas.toBlob(function (blob) {
              if (!blob) return resolve(file);
              var name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
              resolve(new File([blob], name, { type: 'image/jpeg' }));
            }, 'image/jpeg', QUALITY);
          });
        })
        .catch(function () { return file; });
    }

    /* ---- sending ------------------------------------------------------- */

    function labelFor(field) {
      var label = form.querySelector('label[for="' + field.id + '"]');
      if (!label) return field.name;
      var clone = label.cloneNode(true);
      clone.querySelectorAll('.tr-label__opt').forEach(function (n) { n.remove(); });
      return clone.textContent.replace(/\s+/g, ' ').trim();
    }

    function showError(message) {
      error.textContent = message;
      error.hidden = false;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      error.hidden = true;

      var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
      var value = function (id) {
        var el = form.querySelector('#' + id);
        return el ? el.value.trim() : '';
      };

      if (!value('wf-name') || !value('wf-email') || !value('wf-phone')) {
        return showError('Please give your name, email and phone number.');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('wf-email'))) {
        return showError('That email address does not look right.');
      }

      var data = new FormData();
      var details = [];
      fields.forEach(function (field) {
        if (field.type === 'file' || !field.name) return;
        if (field.type === 'hidden' || CONTACT.indexOf(field.name) !== -1) {
          data.append(field.name, field.value);
          return;
        }
        if (field.value && field.value.trim()) {
          details.push({ label: labelFor(field), value: field.value.trim() });
        }
      });
      data.append('details', JSON.stringify(details));

      var label = submit.textContent;
      submit.disabled = true;
      submit.textContent = photos.length ? 'Preparing your photos…' : 'Sending…';

      Promise.all(photos.map(function (p) { return shrink(p.file); }))
        .then(function (shrunk) {
          shrunk.forEach(function (file) { data.append('photos', file, file.name); });
          submit.textContent = 'Sending…';
          return fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { accept: 'application/json' },
          });
        })
        .then(function (response) {
          return response.json().catch(function () { return {}; }).then(function (body) {
            if (!response.ok || !body.ok) {
              throw new Error(body.error || 'We could not send that just now. Please try again, or call us.');
            }
            return body;
          });
        })
        .then(function (body) {
          done.querySelector('[data-done-ref]').textContent = body.reference;
          done.querySelector('[data-done-photos]').textContent =
            body.photos ? String(body.photos) : 'None — you can send some later';
          if (body.skipped) {
            var note = done.querySelector('[data-done-skipped]');
            note.textContent = body.skipped + (body.skipped === 1 ? ' photo was' : ' photos were') +
              ' too large to keep. We will ask you for ' + (body.skipped === 1 ? 'it' : 'them') + ' when we call.';
            note.hidden = false;
          }

          photos.forEach(function (p) { URL.revokeObjectURL(p.url); });
          /* Everything that was instructions for the form goes with it —
             "Tell us the make and model" above "Thank you — we have it" reads
             as though the form still wants something. */
          form.hidden = true;
          ['.step-divider', '.hero-form-card__intro', ':scope > h2'].forEach(function (sel) {
            var el = root.querySelector(sel);
            if (el) el.hidden = true;
          });
          done.hidden = false;
          done.querySelector('[data-done-title]').focus({ preventScroll: true });
          root.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        })
        .catch(function (err) {
          submit.disabled = false;
          submit.textContent = label;
          showError(err && err.message ? err.message : 'We could not send that just now. Please try again, or call us.');
        });
    });

    render();
  }

  document.querySelectorAll('[data-valuation-form]').forEach(init);
})();
