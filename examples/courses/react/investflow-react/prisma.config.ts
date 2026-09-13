import { defineConfig } from 'prisma/config';

// O Node carrega o `.env` sozinho desde a versão 20.6: `process.loadEnvFile()`
// aqui, e a flag `--env-file` nos scripts. Não é preciso instalar `dotenv`.
// Quando a variável já veio do ambiente (testes), o `.env` não a sobrescreve.
if (!process.env.DATABASE_URL) {
  process.loadEnvFile();
}

/**
 * A partir do Prisma 7 a string de conexão e o comando de seed saem do
 * `schema.prisma` e do `package.json` e passam a viver aqui: o schema descreve
 * o modelo, e esta configuração descreve o ambiente.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node --env-file=.env prisma/seed.ts',
  },
  datasource: { url: process.env.DATABASE_URL },
});
