import { z } from 'zod';

// #region schemas
/**
 * Regras dos formulários de conta, sem dependência de React ou de banco:
 * o mesmo schema valida no cliente (mensagem imediata) e no servidor (proteção final).
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Informe um e-mail válido.');

export const passwordSchema = z
  .string()
  .min(8, 'A senha precisa de pelo menos 8 caracteres.')
  .max(72, 'A senha pode ter no máximo 72 caracteres.');

export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe a senha.'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
// #endregion

/** Mensagem única para credenciais inválidas: não revela qual campo existe (CA02.2). */
export const INVALID_CREDENTIALS_MESSAGE = 'E-mail ou senha inválidos.';
