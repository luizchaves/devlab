# Spec TK08.1: Modelagem Prisma com Relação N-N entre Task e Tag

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.1
- **Branch**: feat/tk08-1-prisma-schema
- **História de Usuário**: US10 (Classificar tarefas com tags)
- **Requisitos Atendidos**: RF03, RNF03

## 1. Contexto e Objetivos

Modelar prisma/schema.prisma declarando entidades Task, Tag e relação N-N sem tabelas de junção manuais.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `prisma/schema.prisma` | Criar | Schema declarativo do Prisma ORM |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schema Prisma**:
   - Definir modelos Task e Tag com relação muitos-para-muitos.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.2 - Relação N-N Declarativa
  Dado o arquivo prisma/schema.prisma
  Quando os modelos Task e Tag são lidos
  Então a relação muitos-para-muitos deve ser declarada sem tabela intermediária manual
```

## 5. Plano de Verificação

- **Prisma Validate**: Executar npx prisma validate.
