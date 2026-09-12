# Spec TK03.2: Controller HTTP de Tarefas

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.2
- **Branch**: feat/tk03-2-task-controller
- **História de Usuário**: US03 (Manter as tarefas de ponta a ponta)
- **Requisitos Atendidos**: RF01, RNF04

## 1. Contexto e Objetivos

Criar src/controllers/task-controller.js para intermediar requisições HTTP e o model, traduzindo erros em lançamentos de HttpError.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/controllers/task-controller.js` | Criar | Handlers HTTP e coordenação de chamadas |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Handlers HTTP**:
   - Implementar list, getById, create, update e remove.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.3 - Lançamento de Erros no Controller
  Dado que um ID inexistente é solicitado
  Quando o controller processa a requisição
  Então deve lançar HttpError com status 404
```

## 5. Plano de Verificação

- **Tratamento de Exceções**: Confirmar lançamento de HttpError.
