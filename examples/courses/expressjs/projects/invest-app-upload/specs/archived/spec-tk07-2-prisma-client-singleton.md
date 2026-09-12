# Spec TK07.2: Singleton do Prisma Client e Script de Seed

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.2
- **Branch**: feat/tk07-2-prisma-singleton
- **História de Usuário**: US07 (Enxergar distribuição do patrimônio)
- **Requisitos Atendidos**: RF01, RNF03

## 1. Contexto e Objetivos

Criar back/src/database/prisma.ts instanciando PrismaClient e script de seed com categorias e corretoras.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/database/prisma.ts` | Criar | Client singleton do Prisma |
| `back/prisma/seed.ts` | Criar | Seed relacional com Prisma |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Setup Prisma**:
   - Instanciar client singleton e criar seed com upsert.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA07.2 - Inclusão de Categoria e Corretora
  Dado que investimentos possuem categoria e corretora associadas
  Quando uma consulta com include é realizada
  Então os dados relacionados devem ser retornados na resposta
```

## 5. Plano de Verificação

- **Seed Prisma**: Executar npx prisma db seed.
