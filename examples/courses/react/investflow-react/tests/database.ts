import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

/** Carrega o `.env` sem sobrescrever o que já veio do ambiente (CI). */
export function loadEnv() {
  if (existsSync('.env')) process.loadEnvFile('.env');
}

// #region reset
/**
 * Cada camada de teste usa um schema próprio no Postgres da stack local
 * (`?schema=integration`, `?schema=e2e`): o schema é apagado e recriado pelas
 * migrações, e o `dev.db` do desenvolvimento não é tocado.
 */
export function databaseUrlFor(schema: string) {
  const base = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:54342/postgres';
  const url = new URL(base);
  url.searchParams.set('schema', schema);
  return url.toString();
}

export async function resetDatabase(schema: string) {
  const url = databaseUrlFor(schema);
  const { Client } = await import('pg');
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await client.end();

  execSync('pnpm exec prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: url },
  });
}
// #endregion
