import { z } from 'zod';

// #region body
const signupBody = z.strictObject({
  name: z.string().trim().min(2, 'O nome deve ter no minimo 2 caracteres'),
  email: z.email('Informe um e-mail valido'),
  password: z.string().min(8, 'A senha deve ter no minimo 8 caracteres'),
});

const signinBody = z.strictObject({
  email: z.email('Informe um e-mail valido'),
  // Sem regra de tamanho: a senha antiga de um usuario pode ser mais curta que
  // a regra atual, e recusa-la aqui daria a ele um 422 em vez de um 401.
  password: z.string().min(1, 'Informe a senha'),
});
// #endregion

export const signupSchema = z.object({ body: signupBody });
export const signinSchema = z.object({ body: signinBody });
