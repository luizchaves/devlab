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

// #region bearer
/** Tres blocos Base64URL separados por ponto: cabecalho, payload e assinatura. */
const JWT_FORMAT = /^[\w-]+\.[\w-]+\.[\w-]+$/;

/** A frase que o schema recusa e que a documentacao promete: uma fonte so. */
export const BEARER_FORMAT = 'Authorization: Bearer <jwt>';

export const jwtSchema = z.string().regex(JWT_FORMAT, 'Token malformado');

/**
 * A forma do cabecalho `Authorization`, e so a forma. Quem confere a
 * assinatura e a expiracao continua sendo `verifyJwt`, com `node:crypto`;
 * o schema apenas garante que o que chega ali tem cara de token.
 *
 * `z.object`, e nao `strictObject`: `req.headers` traz dezenas de chaves e
 * nenhuma delas e erro.
 */
export const bearerSchema = z.object({
  headers: z.object({
    authorization: z
      .string('Cabecalho Authorization ausente')
      .regex(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/, `Esperado: ${BEARER_FORMAT}`),
  }),
});

/** O `securitySchemes` do OpenAPI, descrito com a mesma frase do schema. */
export const bearerSecurityScheme = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: `Token emitido por POST /auth/signin, enviado como ${BEARER_FORMAT}.`,
} as const;
// #endregion

// #region cookie
/**
 * Gancho para uma sessao em cookie `HttpOnly`: a mesma regra de forma, lida da
 * fonte `cookies` que o `validate` ja monta. Nenhuma rota usa este schema
 * ainda — ele existe para que a alternativa ao `localStorage`, discutida no
 * topico de Autenticacao, tenha onde entrar.
 */
export const cookieSessionSchema = z.object({
  cookies: z.object({ token: jwtSchema }),
});
// #endregion
