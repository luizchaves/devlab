import { z } from 'zod';

// Uma fonte de dados por schema, para as rotas comporem so o que usam.
const body = z.object({
  name: z.string().min(3, 'O nome deve ter no minimo 3 caracteres'),
  value: z.number().positive('O valor deve ser positivo'),
});

const params = z.object({
  id: z.uuid('O id deve ser um UUID valido'),
});

const query = z.object({
  name: z.string().min(1, 'O filtro name nao pode ser vazio').optional(),
});

export const createInvestmentSchema = z.object({ body });

export const readInvestmentsSchema = z.object({ query });

export const readInvestmentByIdSchema = z.object({ params });

export const updateInvestmentSchema = z.object({ params, body });

export const removeInvestmentSchema = z.object({ params });
