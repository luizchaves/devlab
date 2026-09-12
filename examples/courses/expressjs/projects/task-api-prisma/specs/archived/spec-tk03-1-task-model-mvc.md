# Spec TK03.1: Model de Tarefas em Camada MVC

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.1
- **Branch**: feat/tk03-1-task-model
- **História de Usuário**: US03 (Manter as tarefas de ponta a ponta)
- **Requisitos Atendidos**: RF01, RNF04

## 1. Contexto e Objetivos

Criar src/models/task-model.js isolando operações CRUD em funções puras assíncronas, desacopladas de objetos HTTP.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/models/task-model.js` | Criar | Operações de leitura e escrita sobre as tarefas |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Camada Model**:
   - Implementar findAll, findById, create, update e delete.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.2 - Desacoplamento do Model
  Dado o módulo src/models/task-model.js
  Quando suas funções são inspecionadas
  Então nenhuma função deve receber req ou res como parâmetro
```

## 5. Plano de Verificação

- **Checagem MVC**: Garantir model livre de req/res.
