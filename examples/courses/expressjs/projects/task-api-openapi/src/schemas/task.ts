import { z } from 'zod';

// #region body
/**
 * O corpo aceito na criacao. Cada regra vira uma mensagem que o cliente le:
 * a validacao e tambem documentacao executavel do contrato.
 */
const createBody = z.strictObject({
  title: z.string().trim().min(3, 'O titulo deve ter no minimo 3 caracteres'),
  description: z.string().trim().max(500).nullish(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.iso.date('A data deve estar no formato YYYY-MM-DD').nullish(),
});

/**
 * Na atualizacao todo campo e opcional. `strictObject` recusa chaves que o
 * schema nao declara: um `PUT` com "hacker": 1 vira 422, em vez de ser
 * silenciosamente ignorado.
 */
const updateBody = createBody.partial().extend({
  done: z.boolean().optional(),
});
// #endregion

// #region params
const params = z.object({
  id: z.coerce.number().int().positive('O id deve ser um inteiro positivo'),
});
// #endregion

// #region query
/**
 * `query` chega sempre como string: `coerce` converte antes de validar, e o
 * `default` garante que o controller receba numeros mesmo sem os parametros.
 */
// `query` nao e estrita de proposito: proxies e clientes acrescentam
// parametros proprios (utm_source, _cache) que nao deveriam quebrar a rota.
const query = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  done: z.enum(['true', 'false']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  q: z.string().trim().min(1).optional(),
  sort: z
    .enum(['title', '-title', 'dueDate', '-dueDate', 'createdAt', '-createdAt'])
    .default('-createdAt'),
});
// #endregion

// #region schemas
export const createTaskSchema = z.object({ body: createBody });
export const listTasksSchema = z.object({ query });
export const showTaskSchema = z.object({ params });
export const updateTaskSchema = z.object({ params, body: updateBody });
export const removeTaskSchema = z.object({ params });
// #endregion

export type CreateTaskBody = z.infer<typeof createBody>;
export type UpdateTaskBody = z.infer<typeof updateBody>;
export type ListTasksQuery = z.infer<typeof query>;
