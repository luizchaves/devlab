import { z } from 'zod';

export const signinSchema = z.object({
  body: z.object({
    email: z.email('E-mail invalido'),
    password: z.string().min(1, 'A senha e obrigatoria'),
  }),
});

/** Tres blocos Base64URL separados por ponto: cabecalho, payload e assinatura. */
const JWT_FORMAT = /^[\w-]+\.[\w-]+\.[\w-]+$/;

/** A frase que o schema recusa e que a documentacao promete: uma fonte so. */
export const BEARER_FORMAT = 'Authorization: Bearer <jwt>';

export const jwtSchema = z.string().regex(JWT_FORMAT, 'Token malformado');

/**
 * A forma do cabecalho `Authorization`, e so a forma. Quem confere a
 * assinatura e a expiracao continua sendo `verifyJwt`, com `node:crypto`.
 * `z.object`, e nao `strictObject`: `req.headers` traz dezenas de chaves.
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
  description: `Token emitido por POST /api/signin, enviado como ${BEARER_FORMAT}.`,
} as const;

/**
 * Gancho para uma sessao em cookie `HttpOnly`: a mesma regra de forma, lida da
 * fonte `cookies` que o `validate` ja monta. Nenhuma rota usa este schema ainda.
 */
export const cookieSessionSchema = z.object({
  cookies: z.object({ token: jwtSchema }),
});
