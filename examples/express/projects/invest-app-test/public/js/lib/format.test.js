import { describe, expect, it } from 'vitest';

import { formatCurrency, formatDate } from './format.js';

describe('formatCurrency', () => {
  it('formata um numero em reais', () => {
    // Atencao ao separador: `toLocaleString` usa espaco NAO-QUEBRAVEL (U+00A0)
    // entre o simbolo e o numero, e nao o espaco comum. Comparar com ' ' falha.
    expect(formatCurrency(1000)).toBe('R$ 1.000,00');
  });

  it('sempre usa duas casas decimais', () => {
    expect(formatCurrency(1)).toBe('R$ 1,00');
    expect(formatCurrency(1.5)).toBe('R$ 1,50');
  });

  it('formata zero sem sinal negativo', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });
});

describe('formatDate', () => {
  it('formata no padrao brasileiro', () => {
    expect(formatDate('2025-02-10T12:00:00')).toBe('10/02/2025');
  });

  it('inverte para o formato do input date com o padrao ymd', () => {
    expect(formatDate('2025-02-10T12:00:00', 'ymd')).toBe('2025-02-10');
  });
});
