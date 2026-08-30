import { z } from 'zod';

const params = z.object({
  id: z.uuid('O id deve ser um UUID válido'),
});

export const readPingsSchema = z.object({ params });
