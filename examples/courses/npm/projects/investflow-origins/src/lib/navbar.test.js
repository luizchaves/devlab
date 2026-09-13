import { beforeEach, describe, expect, it } from 'vitest';
import { renderNavbar } from './navbar.js';

describe('renderNavbar', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '<header></header>';
  });

  it('renderiza o navbar padrão para usuário investidor com email e links', () => {
    renderNavbar({
      userEmail: 'ana@example.com',
      role: 'investor',
      activePath: '/analytics',
    });

    const emailEl = document.querySelector('[data-user-email]');
    expect(emailEl?.textContent).toBe('ana@example.com');

    const links = document.querySelectorAll('nav a');
    expect(links.length).toBeGreaterThanOrEqual(4);

    const analyticsLink = document.querySelector('nav a[href="/analytics"]');
    expect(analyticsLink?.className).toContain('text-emerald-600');

    const adminLink = document.querySelector('[data-admin-nav]');
    expect(adminLink).toBeNull();
  });

  it('exibe link de admin quando o perfil for admin', () => {
    renderNavbar({
      userEmail: 'admin@example.com',
      role: 'admin',
      activePath: '/dashboard',
    });

    const adminLink = document.querySelector('[data-admin-nav]');
    expect(adminLink?.className).not.toContain('hidden');
  });

  it('renderiza layout específico na página de admin', () => {
    renderNavbar({
      userEmail: 'admin@example.com',
      role: 'admin',
      activePath: '/admin',
    });

    expect(document.body.textContent).toContain('InvestFlow Admin');
    expect(document.body.textContent).toContain('Perfil Administrador');
  });

  it('exibe o primeiro nome do usuario no avatar no lugar do email completo', () => {
    renderNavbar({
      userEmail: 'ana.silva@example.com',
      userName: 'Ana Paula Silva',
      role: 'investor',
    });

    const userButton = document.querySelector('[data-user-menu-btn]');
    expect(userButton?.textContent).toContain('Ana');
    expect(userButton?.textContent).not.toContain('ana.silva@example.com');

    const emailEl = document.querySelector('[data-user-email]');
    expect(emailEl?.textContent).toBe('ana.silva@example.com');
  });

  it('aponta o link da marca InvestFlow para /dashboard quando autenticado e para / quando deslogado', () => {
    renderNavbar({ userEmail: 'ana@example.com' });
    const authBrandLink = document.querySelector('a[data-brand-link]');
    expect(authBrandLink?.getAttribute('href')).toBe('/dashboard');

    renderNavbar({ userEmail: '' });
    const unauthBrandLink = document.querySelector('a[data-brand-link]');
    expect(unauthBrandLink?.getAttribute('href')).toBe('/');
  });

  it('renderiza botão de alternância de tema e link para edição de perfil no menu suspenso', () => {
    renderNavbar({
      userEmail: 'ana@example.com',
      role: 'investor',
    });

    const themeToggleBtn = document.querySelector('button[data-theme-toggle]');
    expect(themeToggleBtn).not.toBeNull();

    const privacyToggleBtn = document.querySelector('button[data-privacy-toggle]');
    expect(privacyToggleBtn).not.toBeNull();
    expect(privacyToggleBtn?.getAttribute('title')).toBe('Ocultar valores');

    const profileLink = document.querySelector('a[href="/profile"]');
    expect(profileLink).not.toBeNull();
    expect(profileLink?.textContent).toContain('Meu Perfil');
  });

  it('renderiza a tag img quando avatarUrl for fornecido e fallback inicial quando ausente', () => {
    renderNavbar({
      userEmail: 'ana@example.com',
      avatarUrl: 'https://example.com/avatar.png',
      role: 'investor',
    });

    const avatarImg = document.querySelector('img[data-navbar-avatar-img]');
    expect(avatarImg).not.toBeNull();
    expect(avatarImg?.getAttribute('src')).toBe('https://example.com/avatar.png');

    renderNavbar({
      userEmail: 'ana@example.com',
      avatarUrl: '',
      role: 'investor',
    });

    const avatarInitial = document.querySelector('[data-navbar-avatar-initial]');
    expect(avatarInitial).not.toBeNull();
    expect(avatarInitial?.textContent?.trim()).toBe('A');
  });
});
