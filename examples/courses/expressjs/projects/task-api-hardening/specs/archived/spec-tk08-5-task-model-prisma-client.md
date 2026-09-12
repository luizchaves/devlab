# Spec TK08.5: Model de Tarefas com Prisma Client e Tradução P2025

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.5
- **Branch**: feat/tk08-5-model-prisma
- **História de Usuário**: US10 (Classificar tarefas com tags)
- **Requisitos Atendidos**: RF03, RNF03

## 1. Contexto e Objetivos

Reescrever src/models/task-model.ts utilizando Prisma Client, include de tags e tradução de erro P2025 para 404.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/models/task-model.ts` | Modificar | Model sobre Prisma Client |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Model Prisma**:
   - Integrar chamadas prisma.task e tratar erro P2025 retornando undefined.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.5 - Tratamento de Erro P2025
  Dado que uma tarefa inexistente é atualizada
  Quando o Prisma lança o código P2025
  Então a API deve responder status 404 sem expor detalhes internos do ORM
```

## 5. Plano de Verificação

- **Teste de 404 no ORM**: Atualizar id inexistente e checar 404.
