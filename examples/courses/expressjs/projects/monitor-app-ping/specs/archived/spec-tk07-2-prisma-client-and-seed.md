# Spec TK07.2: Singleton do Prisma Client e Script de Seed com Tags

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.2
- **Branch**: feat/tk07-2-prisma-singleton
- **História de Usuário**: US07 (Organizar e comparar os hosts)
- **Requisitos Atendidos**: RF02, RF03, RNF03

## 1. Contexto e Objetivos

Criar back/src/database/prisma.ts instanciando PrismaClient e script de seed com tags.

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
Cenário: CA07.2 - Inclusão de Tags e Pings
  Dado que hosts possuem tags e medições associadas
  Quando uma consulta com include é realizada
  Então tags e histórico recente devem ser retornados na resposta
```

## 5. Plano de Verificação

- **Seed Prisma**: Executar npx prisma db seed.
