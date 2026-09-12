# Spec TK11.5: Barramento de Eventos em Tempo Real (SSE Service)

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.5
- **Branch**: feat/tk11-5-events-service
- **História de Usuário**: US18 (Ser avisado no instante da mudança)
- **Requisitos Atendidos**: RF09

## 1. Contexto e Objetivos

Criar src/services/events-service.ts gerenciando conexões Server-Sent Events por dono e método publish.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/services/events-service.ts` | Criar | Gerenciamento de streams SSE |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Barramento SSE**:
   - Registrar clientes em Map por userId e emitir mensagens no formato text/event-stream.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA18.1 - Conexão SSE Aberta
  Dado um usuário autenticado conectando em GET /events
  Quando a resposta é iniciada
  Então deve responder com Content-Type: text/event-stream e manter a conexão aberta
```

## 5. Plano de Verificação

- **Teste de Stream**: Abrir stream SSE e verificar permanência.
