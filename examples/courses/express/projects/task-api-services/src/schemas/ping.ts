import { z } from 'zod';

// #region schema
/**
 * O host vai virar argumento de um comando do sistema. Mesmo com `execFile`,
 * que ja elimina o shell, a validacao restringe a entrada ao que um host pode
 * ser — defesa em profundidade.
 */
const query = z.object({
  host: z
    .string()
    .trim()
    .min(1)
    .max(253)
    .regex(/^[a-zA-Z0-9.-]+$/, 'O host aceita apenas letras, numeros, ponto e hifen'),
});
// #endregion

export const pingSchema = z.object({ query });
