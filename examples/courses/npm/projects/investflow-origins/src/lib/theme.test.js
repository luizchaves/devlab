import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyTheme, getCurrentTheme, initTheme, setTheme, toggleTheme } from './theme.js';

describe('theme manager', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.body.innerHTML = `
      <button type="button" data-theme-toggle>
        <span data-theme-icon-sun class="hidden">Sun</span>
        <span data-theme-icon-moon class="hidden">Moon</span>
        <span data-theme-icon-auto>Auto</span>
      </button>
    `;
  });

  it('determina o tema padrão e aplica na raiz', () => {
    applyTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    applyTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('CA11.9: alterna o tema em ciclo light -> dark -> auto -> light e persiste no localStorage', () => {
    setTheme('light');
    expect(getCurrentTheme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    const dark = toggleTheme();
    expect(dark).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    const auto = toggleTheme();
    expect(auto).toBe('auto');
    expect(localStorage.getItem('theme')).toBe('auto');

    const light = toggleTheme();
    expect(light).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('atualiza os ícones do botão de tema conforme o modo ativo', () => {
    applyTheme('dark');
    const sunIcon = document.querySelector('[data-theme-icon-sun]');
    const moonIcon = document.querySelector('[data-theme-icon-moon]');
    const autoIcon = document.querySelector('[data-theme-icon-auto]');
    expect(sunIcon?.classList.contains('hidden')).toBe(true);
    expect(moonIcon?.classList.contains('hidden')).toBe(false);
    expect(autoIcon?.classList.contains('hidden')).toBe(true);

    applyTheme('light');
    expect(sunIcon?.classList.contains('hidden')).toBe(false);
    expect(moonIcon?.classList.contains('hidden')).toBe(true);
    expect(autoIcon?.classList.contains('hidden')).toBe(true);

    applyTheme('auto');
    expect(sunIcon?.classList.contains('hidden')).toBe(true);
    expect(moonIcon?.classList.contains('hidden')).toBe(true);
    expect(autoIcon?.classList.contains('hidden')).toBe(false);
  });

  it('inicia o tema e captura cliques nos botões data-theme-toggle', () => {
    setTheme('light');
    initTheme();

    const btn = document.querySelector('[data-theme-toggle]');
    btn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getCurrentTheme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
