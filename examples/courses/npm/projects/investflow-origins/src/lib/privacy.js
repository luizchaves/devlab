const STORAGE_KEY = 'investflow:hide-values';
const MASK_HTML = '<span class="select-none tracking-[0.18em]">••••••</span>';

const PRIVATE_KPIS = new Set([
  'value',
  'cost',
  'unrealized',
  'returnPct',
  'dividends',
  'dividendsLtm',
  'total-dividends',
  'ltm-dividends',
  'monthly-avg',
  'avg-yoc',
  'net-invested',
  'total-buys',
  'total-sells',
  'quantity',
  'averagePrice',
  'currentPrice',
  'realized',
  'totalReturnPct',
  'totalReturnSub',
]);

const MONEY_RE = /\b(?:R\$|US\$)\s*[\d.]+,\d{2}\b/;

let observer;
let scheduled = false;
let applying = false;
let hasClickListener = false;

export function areValuesHidden() {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function setValuesHidden(hidden) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(Boolean(hidden)));
  }

  updatePrivacyButtons();
  applyPrivacyMask();
}

export function toggleValuesHidden() {
  const hidden = !areValuesHidden();
  setValuesHidden(hidden);
  return hidden;
}

function updatePrivacyButtons(root) {
  if (typeof document === 'undefined') return;

  const hidden = areValuesHidden();
  const scope = root || document;
  for (const btn of scope.querySelectorAll('[data-privacy-toggle]')) {
    const eyeOpen = btn.querySelector('[data-privacy-eye-open]');
    const eyeClosed = btn.querySelector('[data-privacy-eye-closed]');

    eyeOpen?.classList.toggle('hidden', hidden);
    eyeClosed?.classList.toggle('hidden', !hidden);
    btn.setAttribute('aria-label', hidden ? 'Mostrar valores' : 'Ocultar valores');
    btn.setAttribute('title', hidden ? 'Mostrar valores' : 'Ocultar valores');
    btn.setAttribute('aria-pressed', String(hidden));
  }
}

// #region mask
// Dois criterios: os KPIs conhecidos pelo nome e qualquer texto que pareca
// dinheiro (R$ 1.234,56). O segundo alcanca tabelas e legendas sem marcacao.
function markKnownPrivateElements(root) {
  if (typeof document === 'undefined') return;
  const scope = root || document;

  for (const name of PRIVATE_KPIS) {
    for (const el of scope.querySelectorAll(`[data-kpi="${name}"]`)) {
      el.dataset.privateValue = '';
    }
  }

  for (const el of scope.querySelectorAll('[data-metric="aum"]')) {
    el.dataset.privateValue = '';
  }

  for (const el of scope.querySelectorAll('td, th, li, span, strong, text')) {
    if (el.closest('[data-private-value]')) continue;
    if (MONEY_RE.test(el.textContent || '')) {
      el.dataset.privateValue = '';
    }
  }
}

function maskElement(el) {
  const currentHtml = el.innerHTML;
  if (currentHtml !== MASK_HTML) {
    el.dataset.privateOriginal = currentHtml;
  }
  if (el.hasAttribute('title') && !el.dataset.privateOriginalTitle) {
    el.dataset.privateOriginalTitle = el.getAttribute('title') || '';
  }

  el.innerHTML = MASK_HTML;
  el.dataset.privateMasked = 'true';
  if (el.hasAttribute('title')) {
    el.setAttribute('title', 'Valor oculto');
  }
}

function unmaskElement(el) {
  if (el.dataset.privateMasked !== 'true') return;

  el.innerHTML = el.dataset.privateOriginal ?? '';
  if (el.dataset.privateOriginalTitle != null) {
    el.setAttribute('title', el.dataset.privateOriginalTitle);
  }
  delete el.dataset.privateMasked;
  delete el.dataset.privateOriginal;
  delete el.dataset.privateOriginalTitle;
}

// #endregion

// #region apply
export function applyPrivacyMask(root) {
  if (typeof document === 'undefined' || applying) return;

  applying = true;
  markKnownPrivateElements(root);

  const hidden = areValuesHidden();
  for (const el of document.querySelectorAll('[data-private-value]')) {
    if (hidden) {
      maskElement(el);
    } else {
      unmaskElement(el);
    }
  }

  applying = false;
}
// #endregion

function scheduleMask() {
  if (scheduled || applying) return;
  scheduled = true;
  const schedule =
    typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (callback) => setTimeout(callback, 0);
  schedule(() => {
    scheduled = false;
    applyPrivacyMask();
  });
}

// #region init
export function initPrivacyMask(root) {
  if (typeof document === 'undefined') return;

  updatePrivacyButtons(root);
  applyPrivacyMask(root);

  if (!hasClickListener) {
    hasClickListener = true;
    document.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-privacy-toggle]');
      if (!btn) return;
      toggleValuesHidden();
    });
  }

  if (!observer && typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(scheduleMask);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
}
// #endregion
