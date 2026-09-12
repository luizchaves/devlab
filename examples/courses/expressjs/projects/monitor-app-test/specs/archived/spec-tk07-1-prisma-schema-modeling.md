# Spec TK07.1: Modelagem do Schema Prisma (Host, Ping, Tag)

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.1
- **Branch**: feat/tk07-1-prisma-schema
- **História de Usuário**: US07 (Organizar e comparar os hosts)
- **Requisitos Atendidos**: RF02, RF03, RNF03

## 1. Contexto e Objetivos

Criar prisma/schema.prisma modelando Host, Ping e Tag com relação N-N e migrações versionadas.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/prisma/schema.prisma` | Criar | Schema declarativo do Prisma |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schema Prisma**:
   - Declarar modelos Host, Ping e Tag com onDelete: Cascade.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA07.1 - Migrações Versionadas com Prisma
  Dado o schema prisma/schema.prisma
  Quando npx prisma migrate dev é executado
  Então as tabelas Host, Ping, Tag e _HostTags devem ser criadas
```

## 5. Plano de Verificação

- **Prisma Migrate**: Executar npx prisma migrate dev.
