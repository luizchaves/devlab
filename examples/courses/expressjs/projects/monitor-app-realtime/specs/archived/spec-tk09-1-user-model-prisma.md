# Spec TK09.1: Model User no Schema Prisma com Relação de Posse

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.1
- **Branch**: feat/tk09-1-user-schema
- **História de Usuário**: US09 (Ter um inventário próprio)
- **Requisitos Atendidos**: RF05, RNF02

## 1. Contexto e Objetivos

Adicionar entidade User no schema Prisma com unicidade de e-mail e gerar migração.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/prisma/schema.prisma` | Modificar | Model User no Prisma |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schema User**:
   - Adicionar model User e gerar migração versionada.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.1 - Cadastro de Usuário (201)
  Dado uma requisição POST /api/users com dados válidos
  Quando o usuário é criado
  Então deve responder 201 com dados públicos sem retornar a senha
```

## 5. Plano de Verificação

- **Migração User**: Executar npx prisma migrate dev.
