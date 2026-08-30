import { z } from 'zod';

const body = z.object({
  name: z.string().min(3, 'O nome deve ter no minimo 3 caracteres'),
  email: z.email('E-mail invalido'),
  password: z.string().min(8, 'A senha deve ter no minimo 8 caracteres'),
  // O front envia a confirmacao; ela e conferida aqui e nao vai para o banco.
  confirmationPassword: z.string().optional(),
});

export const createUserSchema = z.object({
  body: body.refine(
    ({ password, confirmationPassword }) =>
      confirmationPassword === undefined || password === confirmationPassword,
    { message: 'As senhas nao conferem', path: ['confirmationPassword'] },
  ),
});
