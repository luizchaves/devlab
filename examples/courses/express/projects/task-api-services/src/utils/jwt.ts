/**
 * Assinatura e verificacao de JSON Web Token (HS256) com `node:crypto`.
 *
 * Um JWT e apenas tres partes em Base64URL separadas por ponto:
 *
 *   base64url(header) . base64url(payload) . base64url(HMAC-SHA256(header.payload, segredo))
 *
 * O payload NAO e criptografado — qualquer pessoa consegue le-lo. O que a
 * assinatura garante e que ele nao foi alterado.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

import { config } from '#config.ts';

export interface JwtPayload {
  /** Subject: o dono do token. */
  sub: string;
  name?: string;
  email?: string;
  /** Papel do usuario, usado pela autorizacao. */
  role?: string;
  /** Issued at, em segundos desde a epoca. */
  iat: number;
  /** Expiration, em segundos desde a epoca. */
  exp: number;
}

const SECRET = config.JWT_SECRET;
const EXPIRES_IN_SECONDS = config.JWT_EXPIRES_IN;

function toBase64Url(value: Buffer | string): string {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value);

  return buffer.toString('base64url');
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(data: string): string {
  return createHmac('sha256', SECRET).update(data).digest('base64url');
}

/** Gera um token para o payload informado, ja com `iat` e `exp`. */
export function signJwt(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  expiresInSeconds = EXPIRES_IN_SECONDS
): string {
  const now = Math.floor(Date.now() / 1000);

  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = toBase64Url(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds }));

  const data = `${header}.${body}`;

  return `${data}.${sign(data)}`;
}

/** Devolve o payload de um token valido; lanca `Error` caso contrario. */
export function verifyJwt(token: string): JwtPayload {
  const [header, body, signature] = token.split('.');

  if (!header || !body || !signature) {
    throw new Error('Token malformado');
  }

  const expected = Buffer.from(sign(`${header}.${body}`));
  const received = Buffer.from(signature);

  // O comprimento e comparado antes porque `timingSafeEqual` exige buffers iguais.
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    throw new Error('Assinatura invalida');
  }

  const { alg, typ } = JSON.parse(fromBase64Url(header));

  if (alg !== 'HS256' || typ !== 'JWT') {
    throw new Error('Cabecalho invalido');
  }

  const payload = JSON.parse(fromBase64Url(body)) as JwtPayload;

  if (!payload.sub || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expirado ou invalido');
  }

  return payload;
}
