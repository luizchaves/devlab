import { z } from 'zod';

const body = z.object({
  name: z.string().min(2, 'O nome da tag deve ter no mínimo 2 caracteres'),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, 'A cor deve estar no formato #rrggbb'),
});

const query = z.object({
  name: z.string().min(1, 'O filtro name não pode ser vazio').optional(),
});

export const createTagSchema = z.object({ body });

export const readTagsSchema = z.object({ query });
