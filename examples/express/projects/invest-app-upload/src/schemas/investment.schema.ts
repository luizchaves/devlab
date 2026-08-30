import { z } from 'zod';

// O corpo cresce com as relacoes: categoria por id, corretora por nome.
const body = z.object({
  name: z.string().min(3, 'O nome deve ter no minimo 3 caracteres'),
  value: z.number().positive('O valor deve ser positivo'),
  interest: z.string().min(1, 'A taxa e obrigatoria'),
  createdAt: z.string().optional(),
  categoryId: z.uuid('A categoria deve ser um UUID valido'),
  broker: z.string().min(1, 'A corretora e obrigatoria'),
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
