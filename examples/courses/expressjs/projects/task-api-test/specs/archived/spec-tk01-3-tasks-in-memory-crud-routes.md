# Spec TK01.3: Rotas RESTful em Memória para Tarefas

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.3
- **Branch**: feat/tk01-3-in-memory-crud
- **História de Usuário**: US01 (Criar e consultar tarefas por HTTP)
- **Requisitos Atendidos**: RF01, RF02, RNF01

## 1. Contexto e Objetivos

Declarar array em memória de tarefas e implementar rotas RESTful GET /tasks, GET /tasks/:id e POST /tasks em src/server.js.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/server.js` | Modificar | Array em memória e rotas RESTful de tarefas |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Estado em Memória**:
   - Declarar array tasks com registros iniciais.

2. **Fase 2 · Rotas REST**:
   - Implementar rotas GET /tasks, GET /tasks/:id e POST /tasks.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.2 - Listagem de Tarefas
  Dado que o servidor possui tarefas em memória
  Quando uma requisição "GET /tasks" é enviada
  Então a resposta deve ter status 200 com array de tarefas
```

## 5. Plano de Verificação

- **Testes de Rotas**: Testar criação e listagem via requests.http.
