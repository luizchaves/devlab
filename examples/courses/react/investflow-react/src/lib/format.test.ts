import { describe, expect, it } from 'vitest';
import { formatDate, formatMoney, formatPercent } from './format';

describe('format', () => {
  it('formata reais e dólares no padrão brasileiro', () => {
    expect(formatMoney(1234.5)).toBe('R$ 1.234,50');
    expect(formatMoney(1234.5, 'USD')).toBe('US$ 1.234,50');
  });

  it('formata fração como porcentagem com duas casas', () => {
    expect(formatPercent(0.125)).toBe('12,50%');
  });

  it('formata data ISO sem deslocar o fuso', () => {
    expect(formatDate('2026-03-01')).toBe('01/03/2026');
  });
});
