import { z } from 'zod';

/**
 * O endereco de um host e um IPv4 ou um nome de dominio — nunca uma URL
 * completa. Os dois formatos aceitos ficam declarados aqui, e nao espalhados
 * em `if`s pelas rotas.
 */
const address = z
  .string()
  .min(1, 'O endereço é obrigatório')
  .refine(
    (value) => z.ipv4().safeParse(value).success || /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value),
    'O endereço deve ser um IPv4 ou um nome de domínio'
  );

// Uma fonte de dados por schema, para as rotas comporem so o que usam.
const body = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  address,
});

const params = z.object({
  id: z.uuid('O id deve ser um UUID válido'),
});

const query = z.object({
  name: z.string().min(1, 'O filtro name não pode ser vazio').optional(),
});

export const createHostSchema = z.object({ body });

export const readHostsSchema = z.object({ query });

export const readHostByIdSchema = z.object({ params });

export const updateHostSchema = z.object({ params, body });

export const removeHostSchema = z.object({ params });
