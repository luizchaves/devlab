import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// Configuração plana do ESLint 9 com as regras do Next (Core Web Vitals + TypeScript).
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'node_modules/**', 'prisma/migrations/**', 'storage/**']),
]);
