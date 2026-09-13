import { describe, expect, it } from 'vitest';
import { formatMoneyInput, maskMoney, parseMoney } from './money-mask';

describe('máscara monetária', () => {
  it('CA13.1 — agrupa o milhar com ponto enquanto a pessoa digita', () => {
    expect(maskMoney('1')).toBe('1');
    expect(maskMoney('1500')).toBe('1.500');
    expect(maskMoney('1234567')).toBe('1.234.567');
    expect(maskMoney('R$ 6400')).toBe('6.400');
  });

  it('CA13.2 — a vírgula separa até duas casas decimais; o resto é descartado', () => {
    expect(maskMoney('30,5')).toBe('30,5');
    expect(maskMoney('1250,56')).toBe('1.250,56');
    expect(maskMoney('1250,567')).toBe('1.250,56');
    expect(maskMoney(',5')).toBe('0,5');
    expect(maskMoney('1234,5678', { decimals: 4 })).toBe('1.234,5678');
    expect(maskMoney('12', { decimals: 0 })).toBe('12');
  });

  it('CA13.3 — o valor numérico enviado é o do texto mascarado, sem separador de milhar', () => {
    expect(parseMoney('1.250,56')).toBe(1250.56);
    expect(parseMoney('6.400')).toBe(6400);
    expect(parseMoney('0,5')).toBe(0.5);
    expect(parseMoney('')).toBeNull();
    expect(parseMoney('abc')).toBeNull();
  });

  it('formata um número para preencher o campo e volta ao mesmo número', () => {
    expect(formatMoneyInput(1250.5)).toBe('1.250,5');
    expect(formatMoneyInput(6400)).toBe('6.400');
    expect(formatMoneyInput(0.25)).toBe('0,25');
    expect(formatMoneyInput(null)).toBe('');
    expect(parseMoney(formatMoneyInput(1234.56))).toBe(1234.56);
  });
});
