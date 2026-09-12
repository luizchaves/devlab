# Spec TK11.6: Controller de Eventos e Publicação nas Mutações de Tarefas

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.6
- **Branch**: feat/tk11-6-events-controller
- **História de Usuário**: US18 (Ser avisado no instante da mudança)
- **Requisitos Atendidos**: RF09

## 1. Contexto e Objetivos

Criar src/controllers/events-controller.ts, rota GET /events e acionar publish em task-controller.ts.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/controllers/events-controller.ts` | Criar | Handler de SSE |
| `src/routes/events-router.ts` | Criar | Rota de eventos |
| `src/controllers/task-controller.ts` | Modificar | Disparo de eventos em mutações |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Disparo de Eventos**:
   - Emitir task.created e task.updated nas mutações.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA18.2 - Notificação de Mutação em Tempo Real
  Dado um cliente conectado ao stream de eventos
  Quando uma nova tarefa é criada pelo mesmo usuário
  Então o evento "task.created" deve ser emitido instantaneamente no stream
```

## 5. Plano de Verificação

- **Teste de Emissão**: Criar tarefa e conferir evento recebido.
