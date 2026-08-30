import { z } from 'zod';

import { createHostSchema, readHostByIdSchema, readHostsSchema } from '@/schemas/host.schema.ts';
import { createTagSchema, readTagsSchema } from '@/schemas/tag.schema.ts';

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
const tagBody = shapeOf(createTagSchema, 'body');
const tagQuery = shapeOf(readTagsSchema, 'query');

const host = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    ...hostBody.properties,
  },
} as const;

const tag = {
  type: 'object',
  properties: { id: { type: 'string', format: 'uuid' }, ...tagBody.properties },
} as const;

const ping = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    latency: { type: 'integer', nullable: true, description: 'Latência em ms, ou nulo na falha.' },
    success: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    hostId: { type: 'string', format: 'uuid' },
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
  tags: [
    { name: 'Hosts', description: 'CRUD de hosts monitorados' },
    { name: 'Pings', description: 'Histórico de medições de latência' },
    { name: 'Tags', description: 'Rótulos compartilhados entre hosts' },
  ],
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
          {
            name: 'tag',
            in: 'query',
            required: false,
            schema: hostQuery.properties.tag,
            description: 'Filtra pelos hosts rotulados com esta tag.',
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
    '/hosts/{id}/pings': {
      get: {
        tags: ['Pings'],
        summary: 'Lista o histórico de medições de um host',
        parameters: [idParameter],
        responses: {
          200: {
            description: 'Medições da mais recente para a mais antiga.',
            content: { 'application/json': { schema: { type: 'array', items: ping } } },
          },
          400: validationError,
          404: { description: 'Host não encontrado.' },
        },
      },
      post: {
        tags: ['Pings'],
        summary: 'Executa um ping agora e grava o resultado',
        parameters: [idParameter],
        responses: {
          201: {
            description: 'Medição gravada — com falha, `latency` vem nulo.',
            content: { 'application/json': { schema: ping } },
          },
          400: validationError,
          404: { description: 'Host não encontrado.' },
        },
      },
    },
    '/tags': {
      get: {
        tags: ['Tags'],
        summary: 'Lista as tags',
        parameters: [
          {
            name: 'name',
            in: 'query',
            required: false,
            schema: tagQuery.properties.name,
            description: 'Filtra pelo nome da tag.',
          },
        ],
        responses: {
          200: {
            description: 'Lista de tags.',
            content: { 'application/json': { schema: { type: 'array', items: tag } } },
          },
          400: validationError,
        },
      },
      post: {
        tags: ['Tags'],
        summary: 'Cria uma tag',
        requestBody: { required: true, content: { 'application/json': { schema: tagBody } } },
        responses: {
          201: {
            description: 'Tag criada.',
            content: { 'application/json': { schema: tag } },
          },
          400: validationError,
          409: { description: 'Já existe uma tag com este nome.' },
        },
      },
    },
  },
} as const;
