// #region theme
/**
 * Utilitário para gerenciamento do tema Dark / Light / Auto (sistema) com persistência em localStorage
 * e sincronização automática de classes e ícones de alternância.
 */

export function getStoredTheme() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return localStorage.getItem('theme') || 'auto';
}

export function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// #region effective
export function getEffectiveTheme(preference) {
  const pref = preference || getStoredTheme();
  if (pref === 'dark') return 'dark';
  if (pref === 'light') return 'light';
  return getSystemTheme();
}
// #endregion

export function getCurrentTheme() {
  return getStoredTheme();
}

export function updateToggleButtons(preference) {
  if (typeof document === 'undefined') return;
  const pref = preference || getStoredTheme();
  const effective = getEffectiveTheme(pref);
  const buttons = document.querySelectorAll('[data-theme-toggle]');
  for (const btn of buttons) {
    const label =
      pref === 'dark'
        ? 'Tema: Escuro (clique para alternar)'
        : pref === 'light'
          ? 'Tema: Claro (clique para alternar)'
          : `Tema: Automático (${effective === 'dark' ? 'Escuro' : 'Claro'})`;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);

    const sunIcon = btn.querySelector('[data-theme-icon-sun]');
    const moonIcon = btn.querySelector('[data-theme-icon-moon]');
    const autoIcon = btn.querySelector('[data-theme-icon-auto]');

    if (autoIcon && sunIcon && moonIcon) {
      sunIcon.classList.toggle('hidden', pref !== 'light');
      moonIcon.classList.toggle('hidden', pref !== 'dark');
      autoIcon.classList.toggle('hidden', pref !== 'auto');
    } else if (sunIcon && moonIcon) {
      if (effective === 'dark') {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
    }
  }
}

export function applyTheme(preference) {
  const pref = preference || getStoredTheme();
  const effective = getEffectiveTheme(pref);
  const isDark = effective === 'dark';
  if (typeof document !== 'undefined' && document.documentElement) {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  updateToggleButtons(pref);
}

export function setTheme(preference) {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('theme', preference);
  }
  applyTheme(preference);
}

// #region toggle
export function toggleTheme() {
  const current = getStoredTheme();
  let next = 'light';
  if (current === 'light') next = 'dark';
  else if (current === 'dark') next = 'auto';
  else next = 'light';

  setTheme(next);
  return next;
}
// #endregion

export function initTheme() {
  const pref = getStoredTheme();
  applyTheme(pref);

  if (typeof document !== 'undefined' && !document._hasThemeListener) {
    document._hasThemeListener = true;
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-theme-toggle]');
      if (btn) {
        e.preventDefault();
        toggleTheme();
      }
    });

    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener?.('change', () => {
        const stored = localStorage.getItem('theme');
        if (!stored || stored === 'auto') {
          applyTheme('auto');
        }
      });
    }
  }
}
// #endregion
