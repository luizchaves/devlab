# Spec TK05.4: Filtros, Ordenação e Paginação no Model

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK05.4
- **Branch**: feat/tk05-4-pagination-filtering
- **História de Usuário**: US07 (Encontrar tarefas sem baixar tudo)
- **Requisitos Atendidos**: RF02

## 1. Contexto e Objetivos

Ampliar task-model.ts para suportar filtros combinados (done, priority, q), ordenação dinâmica e envelope de paginação data + meta.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/models/task-model.ts` | Modificar | Filtros, ordenação e paginação no model |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Paginação e Filtros**:
   - Implementar filtros de busca, ordenação por campos e cálculo de meta.total e totalPages.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA07.1 - Envelope Paginado
  Dado que a listagem GET /tasks é chamada sem parâmetros
  Quando a resposta é retornada
  Então deve trazer o envelope { data, meta } com page 1, perPage 10 e ordenação -createdAt
```

## 5. Plano de Verificação

- **Teste de Paginação**: Testar paginação e filtros combinados.
