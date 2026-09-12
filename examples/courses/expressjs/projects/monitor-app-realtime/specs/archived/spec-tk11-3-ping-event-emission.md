# Spec TK11.3: Emissão Instantânea de Eventos em Ping.check

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.3
- **Branch**: feat/tk11-3-ping-event-emit
- **História de Usuário**: US12 (Ver a rede mudando ao vivo)
- **Requisitos Atendidos**: RF08

## 1. Contexto e Objetivos

Emitir evento "ping" imediatamente após persistência de medição no model.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/models/Ping.ts` | Modificar | Emissão de eventos em medições |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Emissão de Eventos**:
   - Notificar barramento de eventos após gravação de ping.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.2 - Evento de Ping Emitido
  Dado que uma medição de host foi persistida
  Quando o evento é emitido no barramento
  Então deve conter o bloco event: ping com hostId, success e latency
```

## 5. Plano de Verificação

- **Teste de Emissão**: Realizar medição e checar evento recebido.
