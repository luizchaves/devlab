import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// #region hash
/**
 * Hash de senha com `scrypt` do próprio Node: sem `bcrypt`. O formato guardado
 * é `scrypt$<salt>$<hash>`, o suficiente para verificar depois.
 */
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [algorithm, salt, hash] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !hash) return false;

  const candidate = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, 'hex');
  // Comparação em tempo constante: o tempo de resposta não revela em que byte a senha divergiu.
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}
// #endregion
