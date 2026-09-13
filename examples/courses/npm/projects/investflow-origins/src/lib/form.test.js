import { beforeEach, describe, expect, it } from 'vitest';
import { initPasswordToggle, showError } from './form.js';

describe('form helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('showError', () => {
    it('mostra mensagem quando passada e esconde quando vazia', () => {
      const form = document.createElement('form');
      form.innerHTML = '<p data-error hidden></p>';
      document.body.appendChild(form);

      showError(form, 'Credenciais inválidas');
      const box = form.querySelector('[data-error]');
      expect(box.textContent).toBe('Credenciais inválidas');
      expect(box.hidden).toBe(false);

      showError(form, '');
      expect(box.textContent).toBe('');
      expect(box.hidden).toBe(true);
    });
  });

  describe('initPasswordToggle', () => {
    it('alterna o tipo de input entre password e text ao clicar no botão', () => {
      const form = document.createElement('form');
      form.innerHTML = `
        <div class="relative">
          <input type="password" name="password" id="password" value="secret123" />
          <button type="button" data-toggle-password="password">
            <svg data-eye-open></svg>
            <svg data-eye-closed class="hidden"></svg>
          </button>
        </div>
      `;
      document.body.appendChild(form);

      initPasswordToggle(form);

      const input = form.querySelector('#password');
      const btn = form.querySelector('[data-toggle-password]');
      const eyeOpen = form.querySelector('[data-eye-open]');
      const eyeClosed = form.querySelector('[data-eye-closed]');

      expect(input.type).toBe('password');

      // Primeiro clique: mostra senha (vira text)
      btn.click();
      expect(input.type).toBe('text');
      expect(eyeOpen.classList.contains('hidden')).toBe(true);
      expect(eyeClosed.classList.contains('hidden')).toBe(false);
      expect(btn.getAttribute('aria-label')).toBe('Ocultar senha');

      // Segundo clique: oculta senha (volta para password)
      btn.click();
      expect(input.type).toBe('password');
      expect(eyeOpen.classList.contains('hidden')).toBe(false);
      expect(eyeClosed.classList.contains('hidden')).toBe(true);
      expect(btn.getAttribute('aria-label')).toBe('Mostrar senha');
    });
  });
});
