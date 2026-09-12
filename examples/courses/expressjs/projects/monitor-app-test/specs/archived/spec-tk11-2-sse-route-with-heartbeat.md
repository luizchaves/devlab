# Spec TK11.2: Rota Server-Sent Events GET /api/events com Heartbeat

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.2
- **Branch**: feat/tk11-2-sse-route
- **História de Usuário**: US12 (Ver a rede mudando ao vivo)
- **Requisitos Atendidos**: RF08

## 1. Contexto e Objetivos

Criar back/src/routes/events.routes.ts abrindo stream text/event-stream com heartbeat a cada 15 segundos.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/events.routes.ts` | Criar | Rota de stream SSE |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Stream SSE**:
   - Manter stream aberto com headers apropriados e heartbeats.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.1 - Stream Contínuo de Eventos
  Dado um usuário autenticado conectando em GET /api/events
  Quando a resposta é iniciada
  Então deve responder com Content-Type: text/event-stream e manter a conexão aberta
```

## 5. Plano de Verificação

- **Teste de Stream**: Conectar via EventSource e checar permanência.
