# Spec TK03.5: Rotas de Atualização e Exclusão no Roteador

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.5
- **Branch**: feat/tk03-5-router-put-delete
- **História de Usuário**: US03 (Manter as tarefas de ponta a ponta)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Ampliar src/routes/task-router.js vinculando PUT /:id e DELETE /:id aos handlers do controller.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/routes/task-router.js` | Modificar | Mapeamento de PUT e DELETE |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Expansão de Rotas**:
   - Mapear router.put e router.delete conectando ao controller.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.1 - Atualização via PUT
  Dado uma tarefa existente
  Quando um PUT /tasks/:id é enviado com corpo válido
  Então deve responder 200 com a tarefa atualizada
```

## 5. Plano de Verificação

- **Validação CRUD**: Testar PUT e DELETE via requests.http.
