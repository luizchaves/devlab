import { z } from 'zod';
import { CATEGORIES } from './portfolio';
import { YIELD_INDEXES } from './yield';

// #region schemas
const tickerSchema = z
  .string()
  .trim()
  .toUpperCase()
  .max(24, 'Ticker longo demais.')
  .regex(/^[A-Z0-9.\-]*$/, 'Use letras, números, ponto ou hífen.');

/**
 * Regras do formulário de ativo. Renda fixa pode vir sem ticker (recebe um
 * automático) e fica sempre em BRL (CA10.1); as demais precisam de ticker.
 */
export const assetSchema = z
  .object({
    ticker: tickerSchema.optional().default(''),
    name: z.string().trim().min(2, 'Informe o nome.').max(120),
    category: z.enum(CATEGORIES, { message: 'Categoria inválida.' }),
    issuer: z.string().trim().max(120).optional().default(''),
    brokerName: z.string().trim().max(80).optional().default(''),
    currency: z.enum(['BRL', 'USD']).optional().default('BRL'),
  })
  .superRefine((value, ctx) => {
    if (value.category !== 'renda_fixa' && !value.ticker) {
      ctx.addIssue({ code: 'custom', path: ['ticker'], message: 'Informe o ticker.' });
    }
    if (value.category === 'renda_fixa' && value.currency !== 'BRL') {
      ctx.addIssue({ code: 'custom', path: ['currency'], message: 'Renda fixa fica em reais.' });
    }
  });

export type AssetInput = z.input<typeof assetSchema>;
export type AssetData = z.output<typeof assetSchema>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.');

export const transactionSchema = z.object({
  assetId: z.string().min(1),
  type: z.enum(['buy', 'sell', 'update']),
  quantity: z.coerce.number().positive('Quantidade precisa ser maior que zero.'),
  price: z.coerce.number().min(0, 'Preço não pode ser negativo.'),
  transactionDate: isoDate,
  /** Rendimento contratado em % a.a., opcional (renda fixa, CA14.2). Vazio vira `null`. */
  yieldRate: z.preprocess(
    (value) => (value === '' || value == null ? null : value),
    z.coerce.number().min(0, 'Rendimento não pode ser negativo.').max(1000, 'Rendimento fora do intervalo.').nullable()
  ),
  /** A que a taxa se refere: prefixado, % do CDI ou IPCA + (CA14.4). */
  yieldIndex: z.enum(YIELD_INDEXES, { message: 'Indexador inválido.' }).default('fixed'),
});

export type TransactionInput = z.input<typeof transactionSchema>;
export type TransactionData = z.output<typeof transactionSchema>;
// #endregion

// #region ticker
/**
 * Renda fixa não tem código de bolsa: sem ticker, o sistema inventa um
 * (`RF-<NOME>-<sufixo>`), único por dono (CA08.6).
 */
export function normalizeTicker(ticker: string, category: string, name: string, random = Math.random) {
  if (ticker.trim()) return ticker.trim().toUpperCase();
  if (category !== 'renda_fixa') return '';

  const cleanName = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'RF';
  const suffix = random().toString(36).slice(2, 7).toUpperCase().padEnd(5, '0');
  return `RF-${cleanName}-${suffix}`;
}

/** Ticker só de letras sugere dólar (VT, AAPL); com dígitos, real (PETR4) (CA10.2). */
export function suggestCurrency(ticker: string): 'BRL' | 'USD' {
  const clean = ticker.trim().toUpperCase();
  return /^[A-Z]+$/.test(clean) ? 'USD' : 'BRL';
}
// #endregion
