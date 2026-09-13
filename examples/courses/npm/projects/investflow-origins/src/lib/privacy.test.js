import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyPrivacyMask,
  areValuesHidden,
  initPrivacyMask,
  setValuesHidden,
  toggleValuesHidden,
} from './privacy.js';

describe('privacy mask', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <button type="button" data-privacy-toggle>
        <span data-privacy-eye-open>Open</span>
        <span data-privacy-eye-closed class="hidden">Closed</span>
      </button>
      <div data-kpi="value">R$ 10.000,00</div>
      <table><tbody><tr><td>US$ 42,15</td></tr></tbody></table>
    `;
  });

  it('mascara e restaura valores financeiros marcados ou detectados', () => {
    setValuesHidden(true);

    const kpi = document.querySelector('[data-kpi="value"]');
    const cell = document.querySelector('td');

    expect(kpi?.textContent).toBe('••••••');
    expect(cell?.textContent).toBe('••••••');

    setValuesHidden(false);

    expect(kpi?.textContent).toBe('R$ 10.000,00');
    expect(cell?.textContent).toBe('US$ 42,15');
  });

  it('alterna estado persistido e atualiza icones do botao', () => {
    initPrivacyMask();

    expect(areValuesHidden()).toBe(false);
    expect(document.querySelector('[data-privacy-eye-open]')?.classList.contains('hidden')).toBe(
      false
    );

    const hidden = toggleValuesHidden();

    expect(hidden).toBe(true);
    expect(localStorage.getItem('investflow:hide-values')).toBe('true');
    expect(document.querySelector('[data-privacy-eye-open]')?.classList.contains('hidden')).toBe(
      true
    );
    expect(document.querySelector('[data-privacy-eye-closed]')?.classList.contains('hidden')).toBe(
      false
    );
  });

  it('atualiza o valor original quando a pagina rerenderiza com a mascara ativa', () => {
    setValuesHidden(true);

    const kpi = document.querySelector('[data-kpi="value"]');
    kpi.textContent = 'R$ 12.345,67';
    applyPrivacyMask();

    expect(kpi.textContent).toBe('••••••');

    setValuesHidden(false);

    expect(kpi.textContent).toBe('R$ 12.345,67');
  });
});
