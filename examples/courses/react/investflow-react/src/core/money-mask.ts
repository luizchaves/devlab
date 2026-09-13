// #region mask
/**
 * Máscara monetária no padrão brasileiro (RNF08): ponto separa milhar, vírgula
 * separa decimal. `maskMoney` recebe o que a pessoa digitou e devolve o texto
 * formatado; `parseMoney` transforma o texto em número. As duas são puras.
 */
export type MaskOptions = { decimals?: number };

const group = (digits: string) => digits.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export function maskMoney(raw: string, { decimals = 2 }: MaskOptions = {}): string {
  const cleaned = raw.replace(/[^\d,]/g, '');
  if (cleaned === '') return '';

  const [integer = '', ...rest] = cleaned.split(',');
  const hasComma = cleaned.includes(',');
  const fraction = rest.join('').slice(0, decimals);
  const whole = group(integer) || (hasComma || fraction ? '0' : '');

  if (!hasComma || decimals === 0) return whole;
  return `${whole},${fraction}`;
}

/** `"1.234,56"` → `1234.56`; texto vazio ou só separadores → `null`. */
export function parseMoney(text: string): number | null {
  const normalized = text.replace(/\./g, '').replace(',', '.').trim();
  if (normalized === '' || normalized === '.') return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/** Número → texto no formato da máscara, para preencher o campo a partir de um valor. */
export function formatMoneyInput(value: number | null | undefined, { decimals = 2 }: MaskOptions = {}): string {
  if (value == null || Number.isNaN(value)) return '';
  const fixed = value.toFixed(decimals).replace('.', ',');
  const trimmed = decimals > 0 ? fixed.replace(/,?0+$/, '') : fixed;
  return maskMoney(trimmed, { decimals });
}
// #endregion
