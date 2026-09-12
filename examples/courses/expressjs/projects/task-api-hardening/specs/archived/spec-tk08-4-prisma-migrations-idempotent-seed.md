# Spec TK08.4: Migrações Versionadas e Seed Idempotente

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.4
- **Branch**: feat/tk08-4-prisma-migrations
- **História de Usuário**: US10 (Classificar tarefas com tags)
- **Requisitos Atendidos**: RF03, RNF03

## 1. Contexto e Objetivos

Gerar migração inicial com prisma migrate dev e reescrever src/database/seed.ts com upsert e connect idempotentes.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `prisma/migrations/` | Criar | Migrações versionadas do banco |
| `src/database/seed.ts` | Modificar | Seed idempotente com Prisma |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Migração e Seed Prisma**:
   - Gerar migração e escrever seed com upsert evitando duplicatas.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.4 - Seed Idempotente
  Dado que o script de seed já foi executado
  Quando o comando "npm run db:seed" é executado novamente
  Então nenhuma tarefa ou tag duplicada deve ser criada no banco
```

## 5. Plano de Verificação

- **Idempotência do Seed**: Executar seed duas vezes consecutivas.
