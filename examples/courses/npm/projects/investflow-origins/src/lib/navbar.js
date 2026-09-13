import { initPrivacyMask } from './privacy.js';
import { updateToggleButtons } from './theme.js';

// #region navbar
/**
 * Renderiza o Header e Navegação global compartilhado em todas as páginas privadas com Avatar e Menu Suspenso.
 * @param {{ userEmail?: string, userName?: string, avatarUrl?: string, role?: string, activePath?: string }} options
 */
export function renderNavbar({
  userEmail = '',
  userName = '',
  avatarUrl = '',
  role = 'investor',
  activePath = typeof window !== 'undefined' ? window.location.pathname : '',
} = {}) {
  const header = document.querySelector('header') || document.querySelector('[data-navbar]');
  if (!header) return;

  header.className =
    'border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-40';

  const ICONS = {
    dashboard:
      '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
    analytics:
      '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
    dividends:
      '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    movements:
      '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>',
    origins:
      '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
    admin:
      '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    profile:
      '<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
  };

  const navItems = [
    { label: 'Carteira', href: '/dashboard', match: 'dashboard', icon: ICONS.dashboard },
    { label: 'Rentabilidade', href: '/analytics', match: 'analytics', icon: ICONS.analytics },
    { label: 'Proventos', href: '/dividends', match: 'dividends', icon: ICONS.dividends },
    { label: 'Aportes', href: '/movements', match: 'movements', icon: ICONS.movements },
    { label: 'Origem', href: '/origins', match: 'origins', icon: ICONS.origins },
  ];

  const cleanPath = (activePath || '').toLowerCase();

  const navLinksHtml = navItems
    .map((item) => {
      const isActive =
        cleanPath.includes(item.match) ||
        (item.match === 'dashboard' &&
          (cleanPath.endsWith('/') || cleanPath === '' || cleanPath.endsWith('/index.html')));
      const activeClass = isActive
        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';
      return `<a href="${item.href}" class="inline-flex items-center gap-1.5 ${activeClass}">${item.icon}<span>${item.label}</span></a>`;
    })
    .join('');

  const isAdmin = role === 'admin';
  const isAdminPage = cleanPath.includes('admin');
  const adminActiveClass = isAdminPage
    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';

  const adminLinkHtml = isAdmin
    ? `<a href="/admin" data-admin-nav class="inline-flex items-center gap-1.5 ${adminActiveClass}">${ICONS.admin}<span>Painel Admin</span></a>`
    : '';

  const LOGO_SVG = `
    <svg class="h-8 w-8 flex-shrink-0 shadow-sm" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="9" fill="url(#if-grad-em)" />
      <path d="M8.5 22.5L14.5 16.5L19 21L27.5 11.5" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21.5 11.5H27.5V17.5" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8.5 27.5C13 27.5 15 23 19 23C23 23 24.5 26.5 28 20.5" stroke="white" stroke-width="1.75" stroke-linecap="round" opacity="0.55"/>
      <defs>
        <linearGradient id="if-grad-em" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#059669" />
          <stop offset="100%" stop-color="#0d9488" />
        </linearGradient>
      </defs>
    </svg>`;

  const LOGO_ADMIN_SVG = `
    <svg class="h-8 w-8 flex-shrink-0 shadow-sm" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="9" fill="url(#if-grad-adm)" />
      <path d="M8.5 22.5L14.5 16.5L19 21L27.5 11.5" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21.5 11.5H27.5V17.5" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8.5 27.5C13 27.5 15 23 19 23C23 23 24.5 26.5 28 20.5" stroke="white" stroke-width="1.75" stroke-linecap="round" opacity="0.55"/>
      <defs>
        <linearGradient id="if-grad-adm" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#4f46e5" />
          <stop offset="100%" stop-color="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>`;

  const adminBadgeHtml = isAdminPage
    ? '<div class="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mt-1 inline-block">Perfil Administrador</div>'
    : '';

  const brandLogo = isAdminPage ? LOGO_ADMIN_SVG : LOGO_SVG;
  const brandName = isAdminPage
    ? '<span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Invest<span class="text-indigo-600 dark:text-indigo-400">Flow</span> <span class="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 ml-1">Admin</span></span>'
    : '<span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Invest<span class="text-emerald-600 dark:text-emerald-400">Flow</span></span>';

  const navContent = isAdminPage
    ? `<a href="/dashboard" class="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">${ICONS.dashboard}<span>Carteira Pessoal</span></a><a href="/admin" class="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">${ICONS.admin}<span>Visão Global</span></a>`
    : `${navLinksHtml}${adminLinkHtml}`;

  // Extrai o primeiro nome de forma inteligente a partir do nome ou e-mail
  let rawName = (userName || '').trim();
  if (!rawName && userEmail) {
    const beforeAt = userEmail.split('@')[0];
    const clean = beforeAt.split(/[._-]/)[0];
    rawName = clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  const firstName = rawName.split(' ')[0] || 'Usuário';
  const displayName = userName || firstName;
  const initialLetter = (firstName || userEmail || 'U').trim().charAt(0).toUpperCase();
  const avatarBg = isAdmin ? 'bg-indigo-600' : 'bg-emerald-600';
  const avatarButtonHtml = avatarUrl
    ? `<img src="${avatarUrl}" alt="Avatar" data-navbar-avatar-img class="h-8 w-8 rounded-full object-cover shadow-sm" />`
    : `<div data-navbar-avatar-initial class="h-8 w-8 rounded-full ${avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-sm">${initialLetter}</div>`;
  const avatarMenuHtml = avatarUrl
    ? `<img src="${avatarUrl}" alt="Avatar" data-navbar-menu-avatar-img class="h-9 w-9 rounded-full object-cover shadow-sm flex-shrink-0" />`
    : `<div data-navbar-menu-avatar-initial class="h-9 w-9 rounded-full ${avatarBg} text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">${initialLetter}</div>`;

  const brandHref = userEmail ? '/dashboard' : '/';

  // Opções contextuais do menu suspenso simplificado
  const adminSwitchOption = isAdmin
    ? isAdminPage
      ? `<a href="/dashboard" class="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          ${ICONS.dashboard}
          <span>Minha Carteira</span>
        </a>`
      : `<a href="/admin" class="flex items-center gap-2.5 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition">
          ${ICONS.admin}
          <span>Painel Admin</span>
        </a>`
    : '';

  header.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-4 sm:gap-6">
        <a href="${brandHref}" data-brand-link class="flex items-center gap-2.5 flex-shrink-0">
          ${brandLogo}
          ${brandName}
        </a>
        <nav class="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium overflow-x-auto">
          ${navContent}
        </nav>
      </div>

      <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button type="button" data-privacy-toggle aria-label="Ocultar valores" aria-pressed="false" title="Ocultar valores" class="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
          <svg data-privacy-eye-open class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          <svg data-privacy-eye-closed class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
        </button>

        <!-- Botão de Alternância de Tema Dark/Light/Auto -->
        <button type="button" data-theme-toggle aria-label="Alternar tema" title="Alternar tema" class="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
          <svg data-theme-icon-sun class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <svg data-theme-icon-moon class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          <svg data-theme-icon-auto class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </button>

        <!-- Menu de Usuário com Avatar e Dropdown -->
        <div class="relative flex items-center gap-3 flex-shrink-0" data-user-dropdown>
          <button type="button" data-user-menu-btn aria-expanded="false" class="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
            ${avatarButtonHtml}
            <div class="hidden md:flex flex-col text-left">
              <span class="text-xs font-semibold text-slate-900 dark:text-white max-w-[140px] truncate" title="${displayName}">${firstName}</span>
              <span class="text-[10px] text-slate-500 capitalize">${isAdmin ? 'Admin' : 'Investidor'}</span>
            </div>
            <svg class="w-4 h-4 text-slate-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          <!-- Dropdown Menu Simplificado -->
          <div data-user-menu hidden class="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl py-2 z-50 transition-all">
            <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3">
                ${avatarMenuHtml}
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-semibold text-slate-900 dark:text-white truncate" title="${displayName}">${displayName}</div>
                  <div data-user-email class="text-[11px] text-slate-500 dark:text-slate-400 truncate" title="${userEmail}">${userEmail || 'Conta Ativa'}</div>
                  <div class="text-[10px] text-slate-400 capitalize mt-0.5">${isAdmin ? 'Administrador da Plataforma' : 'Investidor'}</div>
                </div>
              </div>
              ${adminBadgeHtml}
            </div>

            <div class="py-1 text-xs text-slate-700 dark:text-slate-300">
              <a href="/profile" class="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                ${ICONS.profile}
                <span>Meu Perfil</span>
              </a>
              ${adminSwitchOption}
            </div>

            <div class="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
              <button type="button" data-sign-out data-sign-out-menu class="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left">
                <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  updateToggleButtons();
  initPrivacyMask(header);

  // Comportamento interativo do Menu Suspenso
  const btn = header.querySelector('[data-user-menu-btn]');
  const menu = header.querySelector('[data-user-menu]');

  if (btn && menu) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = menu.hidden;
      menu.hidden = !isHidden;
      btn.setAttribute('aria-expanded', String(isHidden));
    });

    if (typeof document !== 'undefined' && !header._hasDropdownEvents) {
      header._hasDropdownEvents = true;
      document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-user-dropdown]')) {
          const currentMenu = document.querySelector('[data-user-menu]');
          const currentBtn = document.querySelector('[data-user-menu-btn]');
          if (currentMenu && !currentMenu.hidden) {
            currentMenu.hidden = true;
            currentBtn?.setAttribute('aria-expanded', 'false');
          }
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const currentMenu = document.querySelector('[data-user-menu]');
          const currentBtn = document.querySelector('[data-user-menu-btn]');
          if (currentMenu && !currentMenu.hidden) {
            currentMenu.hidden = true;
            currentBtn?.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }
  }
}
// #endregion
