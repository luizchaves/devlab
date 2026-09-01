import { defineConfig } from 'prisma/config';

// O Node carrega o `.env` sozinho desde a versao 20.6 — `process.loadEnvFile()`
// aqui, e a flag `--env-file` nos scripts. Nao e preciso instalar `dotenv`.
process.loadEnvFile();

/**
 * A partir do Prisma 7 a string de conexao e o comando de seed saem do
 * `schema.prisma` e do `package.json` e passam a viver aqui — o schema descreve
 * o modelo, e esta configuracao descreve o ambiente.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node src/database/seed.ts',
  },
  datasource: { url: process.env.DATABASE_URL },
});
