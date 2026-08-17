/* Trinity — asset page template
 *
 * The layout for every asset page. Takes a content object from src/content/
 * and returns the finished HTML. Nothing per-asset belongs in this file: if
 * you find yourself writing "watch" or "gold" here, it belongs in content.
 *
 * Shared config lives in trinity.config.mjs alongside this file.
 */
import site from './trinity.config.mjs';

const chip = (t) => (t ? ` <span class="confirm-chip">${t}</span>` : '');
const opt = (f) => (f.optional ? ' <span class="tr-label__opt">(optional)</span>' : '');

/* ---- shared chrome (identical markup on every page) --------------------- */
const ruleBar = () => `
<div class="rule-bar">
  <div class="rule-bar-inner">
    <div class="rule-bar__track">
      <div class="rule-bar__group">
        <span>${site.ruleBar.left}</span>
        <span class="rule-bar__reg">${site.ruleBar.right}</span>
      </div>
      <div class="rule-bar__group" aria-hidden="true" hidden>
        <span>${site.ruleBar.left}</span>
        <span class="rule-bar__reg">${site.ruleBar.right}</span>
      </div>
    </div>
  </div>
</div>`;

const mark = () => `<span class="tr-mark" aria-hidden="true">
        <span></span>
        <span class="tr-mark__pair"><span></span><span></span></span>
      </span>`;

const masthead = () => `
<header class="masthead">
  <div class="masthead-grid">
    <nav>
      <a href="#index" class="tr-navlink">What we lend against</a>
      <a href="#how" class="tr-navlink">How it works</a>
    </nav>
    <a href="./" class="tr-wordmark" aria-label="${site.name} — home">
      ${mark()}
      <span class="tr-wordmark__name">Trinity</span>
      <span class="tr-wordmark__sub">Pawnbrokers</span>
    </a>
    <nav>
      <a href="#" class="tr-navlink">Trust &amp; security</a>
      <a href="tel:${site.phoneHref}" class="tr-phone-btn">${site.phone}</a>
    </nav>
    <button class="tr-burger" type="button" aria-label="Menu" aria-expanded="false" hidden>
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;

const footer = () => `
<footer class="tr-footer">
  ${mark()}
  <div class="tr-footer__name">Trinity</div>
  <div class="tr-footer__sub">Pawnbrokers</div>
  <div class="tr-footer__legal">${site.legal}</div>
</footer>`;

/* ---- components -------------------------------------------------------- */
const field = (f) => {
  const label = `<label class="tr-field__label" for="${f.id}">${f.label}${opt(f)}</label>`;
  if (f.type === 'select') {
    return `<span class="tr-field tr-field--select">${label}<select id="${f.id}">${
      f.options.map((o) => `<option>${o}</option>`).join('')
    }</select></span>`;
  }
  const ph = f.placeholder ? ` placeholder="${f.placeholder}"` : '';
  const ac = f.autocomplete ? ` autocomplete="${f.autocomplete}"` : '';
  return `<span class="tr-field">${label}<input id="${f.id}" type="${f.type}"${ph}${ac}></span>`;
};

const fieldRow = (row) =>
  row.length === 1
    ? `        <div>\n          ${field(row[0])}\n        </div>`
    : `        <div class="field-row">\n${row.map((f) => `          <div>\n            ${field(f)}\n          </div>`).join('\n')}\n        </div>`;

const card = (c) => `      <article class="tr-card">
        <i class="ph-light ${c.icon} tr-card__icon" aria-hidden="true"></i>
        <h3 class="tr-h3">${c.title}</h3>
        <p class="tr-body-sm">${c.body}</p>
      </article>`;

const ledgerRow = (r, i, all) => {
  const cls = r.total ? ' tr-ledger__row--total' : i === all.length - 1 && !all.some((x) => x.total) ? ' tr-ledger__row--last' : '';
  const val = r.total ? 'tr-ledger__value--total' : `tr-ledger__value${r.small ? ' tr-ledger__value--sm' : ''}`;
  return `          <div class="tr-ledger__row${cls}"><span class="tr-ledger__label">${r.label}</span><span class="${val}">${r.value}</span></div>`;
};

const ledger = (rows, small = false) =>
  `        <div class="tr-ledger">\n${rows.map((r, i) => ledgerRow({ ...r, small }, i, rows)).join('\n')}\n        </div>`;

/* ---- page -------------------------------------------------------------- */
export default function assetPage(c) {
  const revealGroups = [
    '.lend-grid > *', '.borrow-grid > *', '.how-grid > .how-step', '.value-points > *',
    '.compare-grid > *', '.proof-grid > *', '.faq-item', '.rep-card', '.closing-inner > *',
  ].join(', ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.meta.title}</title>
<meta name="description" content="${c.meta.description}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${site.fontsHref}" rel="stylesheet">
<link href="${site.phosphorLight}" rel="stylesheet">
<link href="${site.phosphorFill}" rel="stylesheet">

<!-- Design tokens: the single source of truth. Imported before any component CSS. -->
<link rel="stylesheet" href="src/styles/trinity-tokens.css">
<link rel="stylesheet" href="src/styles/trinity-components.css">
<link rel="stylesheet" href="src/styles/asset-page.css">

<script src="${site.reviewsWidget}" defer></script>
<script src="src/scripts/trinity-nav.js" defer></script>
<script src="src/scripts/trinity-reveal.js" defer></script>
<script src="src/scripts/asset-page.js" defer></script>
</head>

<!-- Set data-confirm-notes="off" to hide every amber compliance chip at launch. -->
<body data-confirm-notes="on" data-reveal="${revealGroups}">
${ruleBar()}
${masthead()}
<!-- ===== HERO + VALUATION ENTRY ===== -->
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media">
    <img src="${c.hero.image.src}" alt="${c.hero.image.alt}" fetchpriority="high">
  </div>
  <div class="hero__scrim"></div>

  <div class="hero-grid">
    <div class="hero-copy" data-reveal-hero>
      <p class="tr-eyebrow">${c.hero.eyebrow}</p>
      <h1 id="hero-title" class="tr-h1">${c.hero.heading}</h1>
      <p class="hero__intro">${c.hero.intro}</p>
      <div class="hero__actions">
        <a href="${c.hero.ctaPrimary.href}" class="tr-cta tr-cta--gold">${c.hero.ctaPrimary.label}</a>
        <a href="${c.hero.ctaGhost.href}" class="tr-cta tr-cta--ghost">${c.hero.ctaGhost.label}</a>
      </div>
      <p class="hero__reassure">${c.hero.reassurance}</p>
    </div>

    <!-- Valuation entry — the conversion object -->
    <div id="value-form" class="hero-form-card" data-valuation-form data-reveal-skip
         data-step-labels='${JSON.stringify(c.form.stepLabels)}'>
      <h2>${c.form.heading}</h2>
      <p class="hero-form-card__intro">${c.form.intro}</p>

      <p class="step-divider"><span data-step-label>${c.form.stepLabels[1]}</span></p>

      <div class="step-pane" data-step="1">
${c.form.fields.map(fieldRow).join('\n')}
        <div>
          <p class="tr-label">${c.form.photos.label}</p>
          <div class="tr-dropzone" role="button" tabindex="0">${c.form.photos.hint}</div>
        </div>
        <button type="button" class="tr-cta tr-cta--gold tr-cta--block" data-step-next="2">${c.form.continueLabel}</button>
        <p class="tr-form-note">${c.form.noteStep1}</p>
      </div>

      <div class="step-pane" data-step="2">
        <div>
          ${field({ id: 'wf-name', label: 'Full name', type: 'text', autocomplete: 'name' })}
        </div>
        <div class="field-row">
          <div>
            ${field({ id: 'wf-email', label: 'Email address', type: 'email', autocomplete: 'email' })}
          </div>
          <div>
            ${field({ id: 'wf-phone', label: 'Phone number', type: 'tel', autocomplete: 'tel' })}
          </div>
        </div>
        <button type="submit" class="tr-cta tr-cta--gold tr-cta--block">${c.form.submitLabel}</button>
        <button type="button" class="tr-back-btn" data-step-back="1">${c.form.backLabel}</button>
        <p class="tr-form-note">${c.form.noteStep2}</p>
      </div>
    </div>
  </div>

  <!-- ===== TRUST STRIP ===== -->
  <div class="trust">
    <div class="trust-inner">
${c.trust.map((t) => `      <span${t.highlight ? ' class="trust__highlight"' : ''}>${t.text}${chip(t.chip)}</span>`).join('\n')}
    </div>
  </div>
</section>

<!-- ===== WHAT WE LEND AGAINST ===== -->
<section id="index" class="tr-band tr-band--white">
  <div class="tr-inner">
    <div class="tr-head">
      <p class="tr-eyebrow">${c.lendAgainst.eyebrow}</p>
      <h2 class="tr-h2">${c.lendAgainst.heading}</h2>
    </div>
    <p class="tr-intro tr-section-intro">${c.lendAgainst.intro}</p>

    <div class="lend-grid">
${c.lendAgainst.cards.map(card).join('\n')}
    </div>
  </div>
</section>

<!-- ===== WHAT IT COSTS TO BORROW ===== -->
<section class="tr-band tr-band--grey">
  <div class="tr-inner">
    <div class="borrow-grid">
      <div>
        <p class="tr-eyebrow">${c.borrow.eyebrow}</p>
        <h2 class="tr-h2" style="margin-bottom:16px">${c.borrow.heading}</h2>
        <p class="tr-body" style="margin:0 0 24px">${c.borrow.intro}</p>

        <div class="tr-specs">
${c.borrow.specs.map((s) => `          <div>
            <p class="tr-spec__label">${s.label}${chip(s.chip)}</p>
            <p class="tr-spec__value">${s.value}</p>
          </div>`).join('\n')}
        </div>
      </div>

      <div class="tr-card tr-card--panel example-panel">
        <div class="tr-spec__label" style="margin-bottom:16px">${c.borrow.example.label}${chip(c.borrow.example.chip)}</div>
        <p class="rep-card__statement" style="font-size:26px;line-height:1.3;text-align:left">${c.borrow.example.statement}</p>

${ledger(c.borrow.example.rows)}
        <p class="tr-body-sm" style="margin:24px 0 0">${c.borrow.example.note}</p>
      </div>
    </div>
  </div>
</section>

<!-- ===== HOW IT WORKS ===== -->
<section id="how" class="tr-band tr-band--white">
  <div class="tr-inner">
    <div class="tr-head--centred">
      <p class="tr-eyebrow">${c.how.eyebrow}</p>
      <h2 class="tr-h2">${c.how.heading}</h2>
    </div>

    <div id="how-track">
      <div class="how-line how-line--track" aria-hidden="true"></div>
      <div class="how-line how-line--fill" aria-hidden="true"></div>
      <div class="how-grid">
${c.how.steps.map((s, i) => `        <div class="how-step">
          <div class="how-num" aria-hidden="true"><span class="how-num__glyph"><i class="ph-fill ${s.icon}"></i><i class="ph-light ${s.icon}"></i></span></div>
          <p class="how-step__label">Step ${String(i + 1).padStart(2, '0')}</p>
          <h4 class="tr-h4">${s.title}</h4>
          <p>${s.body}</p>
        </div>`).join('\n')}
      </div>
    </div>

    <p style="text-align:center;margin-top:44px">
      <a href="${c.how.link.href}" class="tr-inline-link">${c.how.link.label}</a>
    </p>
  </div>
</section>

<!-- ===== HOW WE VALUE ===== -->
<section class="tr-band tr-band--grey">
  <div class="tr-inner">
    <div class="value-split">
      <div class="tr-sticky">
        <p class="tr-eyebrow">${c.valuation.eyebrow}</p>
        <h2 class="tr-h2" style="margin-bottom:16px">${c.valuation.heading}</h2>
        <p class="tr-body" style="margin:0">${c.valuation.intro}</p>
      </div>
      <div class="value-points">
${c.valuation.points.map(card).join('\n')}
      </div>
    </div>
  </div>
</section>

<!-- ===== WHY TRINITY ===== -->
<section class="tr-band tr-band--white">
  <div class="tr-inner" style="padding-top:110px;padding-bottom:110px">
    <div class="why-head">
      <p class="tr-eyebrow">${c.why.eyebrow}</p>
      <h2 class="tr-h2">${c.why.heading.replace('<span>', '<span style="color:var(--tr-gold-deep)">')}</h2>
      <p class="tr-intro">${c.why.intro}</p>
    </div>

    <div class="compare-grid">
      <div class="cmp-head-spacer"></div>
      <div class="cmp-head-tri"><div>Trinity</div></div>
      <div class="cmp-head-hs"><div>The high street</div></div>
${c.why.rows.map((r) => `
      <div class="cmp-row"><i class="ph-light ${r.icon}" aria-hidden="true"></i>${r.label}</div>
      <div class="cmp-tri"><i class="ph-fill ph-check-circle" aria-hidden="true"></i><span>${r.trinity}${chip(r.trinityChip)}</span></div>
      <div class="cmp-hs"><i class="ph-light ph-x" aria-hidden="true"></i><span>${r.highStreet}</span></div>`).join('')}
    </div>
  </div>
</section>

<!-- ===== PROOF ===== -->
<section class="tr-band tr-band--grey">
  <div class="proof-grid">
    <div>
      <div id="badge-200" style="width:200px;margin-bottom:20px"
           data-reviews-badge
           data-store="${site.reviewsStore}"
           data-colour-token="--tr-gold-deep"></div>
      <p class="tr-body" style="margin:0;max-width:44ch">${c.proof.reviewsNote}</p>
    </div>

    <div class="tr-card tr-card--panel">
      <p class="tr-spec__label" style="margin-bottom:16px">${c.proof.caseStudy.label}</p>
      <p style="font:500 var(--tr-h3) var(--tr-font-display);line-height:1.45;margin:0;color:var(--tr-green-vault);text-wrap:pretty">${c.proof.caseStudy.statement}</p>

${ledger(c.proof.caseStudy.rows, true)}
      <p class="tr-caption" style="margin:22px 0 0">${c.proof.caseStudy.note}</p>
    </div>
  </div>
</section>

<!-- ===== FAQS ===== -->
<section class="tr-band tr-band--white">
  <div class="tr-inner">
    <div class="faq-split">
      <div class="tr-sticky">
        <p class="tr-eyebrow">${c.faqs.eyebrow}</p>
        <h2 class="tr-h2">${c.faqs.heading}</h2>
      </div>

      <div class="faq-list">
${c.faqs.items.map((f, i) => `        <div class="faq-item">
          <button type="button" class="faq-q" aria-expanded="${i === 0}"><span>${f.q}</span><span class="faq-toggle" aria-hidden="true">${i === 0 ? '−' : '+'}</span></button>
          <p class="faq-a">${f.a}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </div>
</section>

<!-- ===== REPRESENTATIVE EXAMPLE ===== -->
<section class="tr-band tr-band--grey">
  <div class="tr-inner tr-inner--narrow" style="max-width:760px;padding:90px var(--tr-pad-side);display:flex;flex-direction:column;align-items:center">
    <div class="rep-card">
      <p class="tr-spec__label" style="justify-content:center;margin-bottom:18px">${c.repExample.label}${chip(c.repExample.chip)}</p>
      <p class="rep-card__statement">${c.repExample.statement}</p>
      <p class="tr-body-sm" style="margin:20px 0 0;color:var(--tr-ink-62);text-wrap:pretty">${c.repExample.note}</p>
    </div>
  </div>
</section>

<!-- ===== CLOSING CTA ===== -->
<section class="closing">
  <div class="closing-inner">
    <p class="tr-eyebrow tr-eyebrow--on-green" style="margin-bottom:18px">${c.closing.eyebrow}</p>
    <h2>${c.closing.heading}</h2>
    <p class="closing__intro">${c.closing.intro}</p>
    <a href="${c.closing.cta.href}" class="tr-cta tr-cta--gold">${c.closing.cta.label}</a>
    <p class="closing__contact">${c.closing.contactPrefix} <a href="tel:${site.phoneHref}">${site.phone}</a> ${c.closing.contactSuffix}</p>
  </div>
</section>
${footer()}
<!-- Specimen bar — remove for launch -->
<div class="specimen-bar">${c.specimenBar}</div>

</body>
</html>
`;
}
