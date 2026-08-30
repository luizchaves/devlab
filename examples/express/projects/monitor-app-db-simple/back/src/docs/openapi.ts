import { z } from 'zod';

import { createHostSchema, readHostByIdSchema, readHostsSchema } from '@/schemas/host.schema.ts';

/**
 * O Zod 4 converte um schema em JSON Schema sem biblioteca auxiliar. Como o
 * OpenAPI 3.0 usa um dialeto proprio de JSON Schema, o alvo e informado aqui.
 */
function toSchema(schema: z.ZodType) {
  return z.toJSONSchema(schema, { target: 'openapi-3.0', io: 'input' });
}

/** Extrai a parte de uma fonte (`body`, `params`, `query`) do schema da rota. */
function shapeOf(schema: z.ZodObject, source: 'body' | 'params' | 'query') {
  return toSchema(schema.shape[source] as z.ZodType) as {
    properties: Record<string, unknown>;
  };
}

const hostBody = shapeOf(createHostSchema, 'body');
const hostParams = shapeOf(readHostByIdSchema, 'params');
const hostQuery = shapeOf(readHostsSchema, 'query');

const host = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    ...hostBody.properties,
  },
} as const;

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: hostParams.properties.id,
  description: 'Identificador do host, em UUID.',
};

const jsonBody = {
  required: true,
  content: { 'application/json': { schema: hostBody } },
};

const validationError = {
  description: 'Alguma das fontes da requisição não passou no schema.',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Validation error' },
          issues: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
};

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'MonitorApp API',
    version: '1.0.0',
    description:
      'API de monitoramento de hosts de rede. Os schemas desta documentação são os mesmos que validam as requisições em tempo de execução.',
  },
  servers: [{ url: 'http://localhost:3000/api', description: 'Desenvolvimento' }],
  tags: [{ name: 'Hosts', description: 'CRUD de hosts monitorados' }],
  paths: {
    '/hosts': {
      get: {
        tags: ['Hosts'],
        summary: 'Lista os hosts',
        parameters: [
          {
            name: 'name',
            in: 'query',
            required: false,
            schema: hostQuery.properties.name,
            description: 'Filtra pelo nome do host.',
          },
        ],
        responses: {
          200: {
            description: 'Lista de hosts.',
            content: { 'application/json': { schema: { type: 'array', items: host } } },
          },
          400: validationError,
        },
      },
      post: {
        tags: ['Hosts'],
        summary: 'Cadastra um host',
        requestBody: jsonBody,
        responses: {
          201: {
            description: 'Host cadastrado.',
            content: { 'application/json': { schema: host } },
          },
          400: validationError,
        },
      },
    },
    '/hosts/{id}': {
      get: {
        tags: ['Hosts'],
        summary: 'Consulta um host por id',
        parameters: [idParameter],
        responses: {
          200: {
            description: 'Host encontrado.',
            content: { 'application/json': { schema: host } },
          },
          400: validationError,
          404: { description: 'Host não encontrado.' },
        },
      },
      put: {
        tags: ['Hosts'],
        summary: 'Atualiza um host',
        parameters: [idParameter],
        requestBody: jsonBody,
        responses: {
          200: {
            description: 'Host atualizado.',
            content: { 'application/json': { schema: host } },
          },
          400: validationError,
          404: { description: 'Host não encontrado.' },
        },
      },
      delete: {
        tags: ['Hosts'],
        summary: 'Remove um host',
        parameters: [idParameter],
        responses: {
          204: { description: 'Removido, sem corpo na resposta.' },
          400: validationError,
          404: { description: 'Host não encontrado.' },
        },
      },
    },
  },
} as const;
