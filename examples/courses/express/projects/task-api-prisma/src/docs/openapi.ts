import type { z } from 'zod';
import { z as zod } from 'zod';

import {
  createTaskSchema,
  listTasksSchema,
  showTaskSchema,
  updateTaskSchema,
} from '#schemas/task.ts';

// #region to-json-schema
/**
 * O Zod 4 converte um schema em JSON Schema sem biblioteca auxiliar. Como o
 * OpenAPI 3.0 usa um dialeto proprio de JSON Schema, o alvo e informado aqui.
 *
 * E por isso que a documentacao nao envelhece: ela nasce do mesmo schema que
 * valida a requisicao. Mudar a regra muda o contrato publicado.
 */
function toSchema(schema: z.ZodType) {
  return zod.toJSONSchema(schema, { target: 'openapi-3.0', io: 'input' });
}

/** Extrai a parte de uma fonte (`body`, `params`, `query`) do schema da rota. */
function shapeOf(schema: z.ZodObject, source: 'body' | 'params' | 'query') {
  return toSchema(schema.shape[source] as z.ZodType);
}
// #endregion

const taskBody = shapeOf(createTaskSchema, 'body');
const taskUpdateBody = shapeOf(updateTaskSchema, 'body');
const taskParams = shapeOf(showTaskSchema, 'params');
const taskQuery = shapeOf(listTasksSchema, 'query');

const properties = (schema: unknown) =>
  (schema as { properties: Record<string, unknown> }).properties;

// #region components
const task = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    ...properties(taskBody),
    done: { type: 'boolean', example: false },
    createdAt: { type: 'string', format: 'date-time' },
  },
} as const;

const page = {
  type: 'object',
  properties: {
    data: { type: 'array', items: task },
    meta: {
      type: 'object',
      properties: {
        page: { type: 'integer', example: 1 },
        perPage: { type: 'integer', example: 10 },
        total: { type: 'integer', example: 2 },
        totalPages: { type: 'integer', example: 1 },
      },
    },
  },
} as const;

const errorBody = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: {
        status: { type: 'integer' },
        message: { type: 'string' },
        issues: { type: 'array', items: { type: 'object' } },
      },
    },
  },
} as const;
// #endregion

const jsonError = (description: string) => ({
  description,
  content: { 'application/json': { schema: errorBody } },
});

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: properties(taskParams).id,
  description: 'Identificador da tarefa.',
};

const queryParameters = Object.entries(properties(taskQuery)).map(([name, schema]) => ({
  name,
  in: 'query',
  required: false,
  schema,
}));

// #region document
export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'TaskAPI',
    version: '1.0.0',
    description:
      'API de tarefas do Guia de Express.js. O contrato abaixo e gerado a partir dos mesmos schemas Zod que validam as requisicoes.',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Ambiente local' }],
  paths: {
    '/health': {
      get: {
        tags: ['Operacao'],
        summary: 'Estado do servico',
        responses: {
          200: {
            description: 'O processo esta no ar.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    uptime: { type: 'number', example: 12.48 },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/tasks': {
      get: {
        tags: ['Tarefas'],
        summary: 'Lista as tarefas, com filtros e paginacao',
        parameters: queryParameters,
        responses: {
          200: { description: 'Pagina de tarefas.', content: { 'application/json': { schema: page } } },
          422: jsonError('Algum parametro da query nao passou no schema.'),
        },
      },
      post: {
        tags: ['Tarefas'],
        summary: 'Cria uma tarefa',
        requestBody: { required: true, content: { 'application/json': { schema: taskBody } } },
        responses: {
          201: { description: 'Tarefa criada.', content: { 'application/json': { schema: task } } },
          409: jsonError('Ja existe uma tarefa com esse titulo.'),
          415: jsonError('Content-Type diferente de application/json.'),
          422: jsonError('O corpo nao passou no schema.'),
        },
      },
    },
    '/tasks/{id}': {
      get: {
        tags: ['Tarefas'],
        summary: 'Busca uma tarefa pelo id',
        parameters: [idParameter],
        responses: {
          200: { description: 'A tarefa.', content: { 'application/json': { schema: task } } },
          404: jsonError('Nao existe tarefa com esse id.'),
          422: jsonError('O id nao passou no schema.'),
        },
      },
      put: {
        tags: ['Tarefas'],
        summary: 'Atualiza uma tarefa',
        parameters: [idParameter],
        requestBody: { required: true, content: { 'application/json': { schema: taskUpdateBody } } },
        responses: {
          200: { description: 'Tarefa atualizada.', content: { 'application/json': { schema: task } } },
          404: jsonError('Nao existe tarefa com esse id.'),
          415: jsonError('Content-Type diferente de application/json.'),
          422: jsonError('O corpo nao passou no schema.'),
        },
      },
      delete: {
        tags: ['Tarefas'],
        summary: 'Remove uma tarefa',
        parameters: [idParameter],
        responses: {
          204: { description: 'Removida. Sem corpo.' },
          404: jsonError('Nao existe tarefa com esse id.'),
        },
      },
    },
  },
} as const;
// #endregion
