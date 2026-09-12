# Spec TK07.1: Modelagem do Schema Prisma (Investment, Category, Broker)

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.1
- **Branch**: feat/tk07-1-prisma-schema
- **História de Usuário**: US07 (Enxergar distribuição do patrimônio)
- **Requisitos Atendidos**: RF01, RNF03

## 1. Contexto e Objetivos

Criar prisma/schema.prisma modelando Investment, Category e Broker com relacionamentos e migrações versionadas.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/prisma/schema.prisma` | Criar | Schema declarativo do Prisma |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schema Prisma**:
   - Declarar modelos e relações de categorias e corretoras.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA07.1 - Migração Versionada do Prisma
  Dado o schema prisma/schema.prisma
  Quando npx prisma migrate dev é executado
  Então as tabelas Investment, Category e Broker devem ser criadas
```

## 5. Plano de Verificação

- **Prisma Migrate**: Rodar npx prisma migrate dev.
