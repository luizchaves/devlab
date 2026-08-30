import { z } from 'zod';

import {
  createInvestmentSchema,
  readInvestmentByIdSchema,
  readInvestmentsSchema,
  updateInvestmentSchema,
} from '@/schemas/investment.schema.ts';

/**
 * O Zod 4 converte um schema em JSON Schema sem biblioteca auxiliar. Como o
 * OpenAPI 3.0 usa um dialeto proprio de JSON Schema, o alvo e informado aqui.
 */
function toSchema(schema: z.ZodType) {
  return z.toJSONSchema(schema, { target: 'openapi-3.0' });
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
  tags: [{ name: 'Investments', description: 'CRUD de investimentos' }],
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
  },
} as const;

// `updateInvestmentSchema` valida params e body ao mesmo tempo; a documentacao
// da rota PUT acima reflete exatamente essa combinacao.
void updateInvestmentSchema;
