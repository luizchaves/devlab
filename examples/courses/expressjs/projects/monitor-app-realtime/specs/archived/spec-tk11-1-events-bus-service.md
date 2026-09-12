# Spec TK11.1: Barramento de Eventos Pub/Sub em Memória

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.1
- **Branch**: feat/tk11-1-events-bus
- **História de Usuário**: US12 (Ver a rede mudando ao vivo)
- **Requisitos Atendidos**: RF08

## 1. Contexto e Objetivos

Criar back/src/services/events.ts gerenciando conexões SSE e publicação por userId.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/services/events.ts` | Criar | Barramento pub/sub de eventos SSE |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Barramento SSE**:
   - Gerenciar clientes por userId e emitir eventos de ping.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.5 - Encerramento de Conexão SSE
  Dado que um cliente fecha a aba do navegador
  Quando a conexão SSE é interrompida
  Então os listeners e heartbeats associados devem ser removidos da memória
```

## 5. Plano de Verificação

- **Teste de Conexão**: Conectar e desconectar cliente SSE.
