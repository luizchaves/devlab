import { z } from 'zod';

const body = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  // O front envia a confirmacao; ela e conferida aqui e nao vai para o banco.
  confirmationPassword: z.string().optional(),
});

export const createUserSchema = z.object({
  body: body.refine(
    ({ password, confirmationPassword }) =>
      confirmationPassword === undefined || password === confirmationPassword,
    { message: 'As senhas não conferem', path: ['confirmationPassword'] }
  ),
});
