import { z } from 'zod';

// #region schema
/**
 * O ambiente tambem e entrada nao confiavel.
 *
 * Um `PORT=abc` ou um `JWT_SECRET` ausente devem derrubar o processo no
 * arranque, com uma mensagem clara — nunca virar um `NaN` ou um segredo vazio
 * descoberto meses depois.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL e obrigatoria'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET precisa de no minimo 32 caracteres'),
  JWT_EXPIRES_IN: z.coerce.number().int().positive().default(3600),
  CORS_ORIGINS: z
    .string()
    .default('')
    .transform((value) => value.split(',').map((item) => item.trim()).filter(Boolean)),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});
// #endregion

// #region fail-fast
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Nao ha `errorHandler` aqui: o processo ainda nem subiu.
  console.error('Configuracao invalida:');

  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }

  process.exit(1);
}
// #endregion

// #region export
/**
 * A aplicacao le `config`, nunca `process.env`.
 *
 * Assim os valores chegam ja validados e no tipo certo, e existe um unico
 * arquivo para descobrir tudo que o servico precisa do ambiente.
 */
export const config = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === 'production',
  isTest: parsed.data.NODE_ENV === 'test',
} as const;
// #endregion
