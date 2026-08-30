/**
 * Hash de senha com Argon2id, usando apenas `node:crypto`.
 *
 * O formato de saida e o PHC string format, o mesmo que a biblioteca `argon2`
 * produz — parametros e sal viajam junto do hash, entao um registro antigo
 * continua verificavel depois de endurecermos os custos.
 *
 *   $argon2id$v=19$m=65536,t=3,p=4$<sal em base64>$<hash em base64>
 */
import { argon2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

type Argon2Algorithm = 'argon2d' | 'argon2i' | 'argon2id';

const ALGORITHM: Argon2Algorithm = 'argon2id';
const VERSION = 19;
/** Memoria em KiB (64 MiB): e o custo que torna o ataque em GPU caro. */
const MEMORY_KIB = 65536;
/** Numero de passagens sobre a memoria. */
const PASSES = 3;
/** Threads usadas em paralelo. */
const PARALLELISM = 4;
/** Tamanho do hash em bytes. */
const TAG_LENGTH = 32;

const PHC_REGEX =
  /^\$(argon2(?:d|i|id))\$v=(\d+)\$m=(\d+),t=(\d+),p=(\d+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/;

function toBase64(buffer: Buffer): string {
  return buffer.toString('base64').replace(/=+$/, '');
}

/** Deriva o hash de uma senha em claro. Cada chamada gera um sal novo. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);

  const hash = argon2Sync(ALGORITHM, {
    message: password,
    nonce: salt,
    memory: MEMORY_KIB,
    passes: PASSES,
    parallelism: PARALLELISM,
    tagLength: TAG_LENGTH,
  });

  return `$${ALGORITHM}$v=${VERSION}$m=${MEMORY_KIB},t=${PASSES},p=${PARALLELISM}$${toBase64(salt)}$${toBase64(hash)}`;
}

/**
 * Confere uma senha contra o hash armazenado.
 *
 * Os parametros vem do proprio hash, e a comparacao final usa
 * `timingSafeEqual` para nao vazar informacao pelo tempo de resposta.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const match = storedHash.match(PHC_REGEX);

  if (!match) return false;

  const [, algorithm, version, memory, passes, parallelism, saltB64, hashB64] = match;

  if (Number(version) !== VERSION) return false;

  const expected = Buffer.from(String(hashB64), 'base64');

  try {
    const derived = argon2Sync(algorithm as Argon2Algorithm, {
      message: password,
      nonce: Buffer.from(String(saltB64), 'base64'),
      memory: Number(memory),
      passes: Number(passes),
      parallelism: Number(parallelism),
      tagLength: expected.length,
    });

    return expected.length === derived.length && timingSafeEqual(expected, derived);
  } catch {
    return false;
  }
}
