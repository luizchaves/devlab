import { z } from 'zod';

import {
  createInvestmentSchema,
  readInvestmentByIdSchema,
  readInvestmentsSchema,
} from '@/schemas/investment.schema.ts';
import {
  readCategoriesSchema,
  readCategoryByIdSchema,
} from '@/schemas/category.schema.ts';
import { readBrokerByIdSchema, readBrokersSchema } from '@/schemas/broker.schema.ts';
import { createUserSchema } from '@/schemas/user.schema.ts';

/**
 * O Zod 4 converte um schema em JSON Schema sem biblioteca auxiliar. Como o
 * OpenAPI 3.0 usa um dialeto proprio de JSON Schema, o alvo e informado aqui.
 */
function toSchema(schema: z.ZodType) {
  return z.toJSONSchema(schema, { target: 'openapi-3.0', io: 'input' });
}

/** Extrai a parte de uma fonte (`body`, `params`, `query`) do schema da rota. */
function shapeOf(schema: z.ZodObject, source: 'body' | 'params' | 'query') {
  return toSchema(schema.shape[source] as z.ZodType);
}

const investmentBody = shapeOf(createInvestmentSchema, 'body');
const investmentParams = shapeOf(readInvestmentByIdSchema, 'params');
const investmentQuery = shapeOf(readInvestmentsSchema, 'query');

const investment = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    ...(investmentBody as { properties: Record<string, unknown> }).properties,
  },
} as const;

const categoryQuery = shapeOf(readCategoriesSchema, 'query');
const categoryParams = shapeOf(readCategoryByIdSchema, 'params');

/** Categoria e corretora sao somente leitura: nao ha schema de escrita a derivar. */
const category = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string', example: 'Pos' },
    color: { type: 'string', example: '#6366f1' },
  },
} as const;

const brokerQuery = shapeOf(readBrokersSchema, 'query');
const brokerParams = shapeOf(readBrokerByIdSchema, 'params');

const broker = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string', example: 'Banco Inter' },
  },
} as const;

const userBody = shapeOf(createUserSchema, 'body');

/** O usuario como ele sai da API: sem a senha, nem em hash. */
const user = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
} as const;

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: (investmentParams as { properties: Record<string, unknown> }).properties.id,
  description: 'Identificador do investimento, em UUID.',
};

const jsonBody = {
  required: true,
  content: { 'application/json': { schema: investmentBody } },
};

const validationError = {
  description: 'Alguma das fontes da requisicao nao passou no schema.',
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
    title: 'InvestApp API',
    version: '1.0.0',
    description:
      'API de controle de investimentos. Os schemas desta documentacao sao os mesmos que validam as requisicoes em tempo de execucao.',
  },
  servers: [{ url: 'http://localhost:3000/api', description: 'Desenvolvimento' }],
  tags: [
    { name: 'Investments', description: 'CRUD de investimentos' },
    { name: 'Categories', description: 'Categorias de ativos, somente leitura' },
    { name: 'Brokers', description: 'Corretoras de custodia, somente leitura' },
    { name: 'Users', description: 'Cadastro e perfil' },
  ],
  paths: {
    '/investments': {
      get: {
        tags: ['Investments'],
        summary: 'Lista os investimentos',
        parameters: [
          {
            name: 'name',
            in: 'query',
            required: false,
            schema: (investmentQuery as { properties: Record<string, unknown> }).properties.name,
            description: 'Filtra pelo nome do investimento.',
          },
        ],
        responses: {
          200: {
            description: 'Lista de investimentos.',
            content: {
              'application/json': { schema: { type: 'array', items: investment } },
            },
          },
          400: validationError,
        },
      },
      post: {
        tags: ['Investments'],
        summary: 'Cria um investimento',
        requestBody: jsonBody,
        responses: {
          201: {
            description: 'Investimento criado.',
            content: { 'application/json': { schema: investment } },
          },
          400: validationError,
        },
      },
    },
    '/investments/{id}': {
      get: {
        tags: ['Investments'],
        summary: 'Consulta um investimento por id',
        parameters: [idParameter],
        responses: {
          200: {
            description: 'Investimento encontrado.',
            content: { 'application/json': { schema: investment } },
          },
          400: validationError,
          404: { description: 'Investimento nao encontrado.' },
        },
      },
      put: {
        tags: ['Investments'],
        summary: 'Atualiza um investimento',
        parameters: [idParameter],
        requestBody: jsonBody,
        responses: {
          200: {
            description: 'Investimento atualizado.',
            content: { 'application/json': { schema: investment } },
          },
          400: validationError,
          404: { description: 'Investimento nao encontrado.' },
        },
      },
      delete: {
        tags: ['Investments'],
        summary: 'Remove um investimento',
        parameters: [idParameter],
        responses: {
          204: { description: 'Removido, sem corpo na resposta.' },
          400: validationError,
          404: { description: 'Investimento nao encontrado.' },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Lista categorias',
        parameters: [
          {
            name: 'name',
            in: 'query',
            required: false,
            schema: (categoryQuery as { properties: Record<string, unknown> }).properties.name,
            description: 'Filtra pelo nome.',
          },
        ],
        responses: {
          200: {
            description: 'Lista de categorias.',
            content: { 'application/json': { schema: { type: 'array', items: category } } },
          },
          400: validationError,
          401: unauthorized,
        },
      },
    },
    '/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Consulta categoria por id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: (categoryParams as { properties: Record<string, unknown> }).properties.id,
            description: 'Identificador, em UUID.',
          },
        ],
        responses: {
          200: {
            description: 'Encontrado.',
            content: { 'application/json': { schema: category } },
          },
          400: validationError,
          401: unauthorized,
          404: { description: 'Nao encontrado.' },
        },
      },
    },
    '/brokers': {
      get: {
        tags: ['Brokers'],
        summary: 'Lista corretoras',
        parameters: [
          {
            name: 'name',
            in: 'query',
            required: false,
            schema: (brokerQuery as { properties: Record<string, unknown> }).properties.name,
            description: 'Filtra pelo nome.',
          },
        ],
        responses: {
          200: {
            description: 'Lista de corretoras.',
            content: { 'application/json': { schema: { type: 'array', items: broker } } },
          },
          400: validationError,
          401: unauthorized,
        },
      },
    },
    '/brokers/{id}': {
      get: {
        tags: ['Brokers'],
        summary: 'Consulta corretora por id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: (brokerParams as { properties: Record<string, unknown> }).properties.id,
            description: 'Identificador, em UUID.',
          },
        ],
        responses: {
          200: {
            description: 'Encontrado.',
            content: { 'application/json': { schema: broker } },
          },
          400: validationError,
          401: unauthorized,
          404: { description: 'Nao encontrado.' },
        },
      },
    },
    '/users': {
      post: {
        tags: ['Users'],
        summary: 'Cadastra um usuario',
        security: [],
        requestBody: { required: true, content: { 'application/json': { schema: userBody } } },
        responses: {
          201: {
            description: 'Conta criada. A resposta nunca inclui a senha.',
            content: { 'application/json': { schema: user } },
          },
          400: validationError,
          409: { description: 'Ja existe uma conta com este e-mail.' },
        },
      },
    },
  },
} as const;
