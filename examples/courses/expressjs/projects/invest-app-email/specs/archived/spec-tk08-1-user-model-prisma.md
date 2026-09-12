# Spec TK08.1: Model User no Schema Prisma com Relação de Posse

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.1
- **Branch**: feat/tk08-1-user-schema
- **História de Usuário**: US08 (Ter uma carteira própria)
- **Requisitos Atendidos**: RF02, RNF02

## 1. Contexto e Objetivos

Adicionar entidade User no schema Prisma com unicidade de e-mail e relação 1-N com Investment.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/prisma/schema.prisma` | Modificar | Entidade User e relação com Investment |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schema User**:
   - Adicionar model User e gerar migração relacional.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.1 - Cadastro de Usuário (201)
  Dado uma requisição POST /api/users com dados válidos
  Quando o usuário é criado
  Então deve responder 201 com dados públicos sem retornar a senha
```

## 5. Plano de Verificação

- **Migração de User**: Executar npx prisma migrate dev.
