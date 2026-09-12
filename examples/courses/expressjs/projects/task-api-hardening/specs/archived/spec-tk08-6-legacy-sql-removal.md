# Spec TK08.6: Remoção da Camada Legada de SQL Manual

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.6
- **Branch**: feat/tk08-6-remove-legacy-sql
- **História de Usuário**: US10 (Classificar tarefas com tags)
- **Requisitos Atendidos**: RNF03

## 1. Contexto e Objetivos

Remover arquivos legados src/database/database.ts e migration.ts eliminando strings SQL manuais da base de código.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/database/database.ts` | Remover | Invólucro SQL legado |
| `src/database/migration.ts` | Remover | Script SQL legado |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Limpeza de Código**:
   - Excluir arquivos legados de SQL e atualizar imports.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.7 - Ausência de SQL no Model
  Dado a base de código refatorada com Prisma
  Quando os arquivos em src/models/ são inspecionados
  Então não deve existir nenhuma query SQL escrita manualmente
```

## 5. Plano de Verificação

- **Busca por SQL**: Garantir 0 strings SQL manuais no projeto.
