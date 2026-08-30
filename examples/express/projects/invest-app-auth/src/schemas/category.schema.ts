import { z } from 'zod';

const params = z.object({
  id: z.uuid('O id deve ser um UUID valido'),
});

const query = z.object({
  name: z.string().min(1, 'O filtro name nao pode ser vazio').optional(),
});

export const readCategoriesSchema = z.object({ query });

export const readCategoryByIdSchema = z.object({ params });
