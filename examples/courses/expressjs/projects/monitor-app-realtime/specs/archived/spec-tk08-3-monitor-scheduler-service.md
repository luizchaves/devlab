# Spec TK08.3: Agendador Periódico de Coletas com Promise.allSettled

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.3
- **Branch**: feat/tk08-3-monitor-scheduler
- **História de Usuário**: US08 (Saber se o host está no ar sem abrir o terminal)
- **Requisitos Atendidos**: RF04

## 1. Contexto e Objetivos

Criar back/src/services/monitor.ts com rodadas periódicas a cada MONITOR_INTERVAL segundos usando Promise.allSettled.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/services/monitor.ts` | Criar | Serviço de agendamento de coletas |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Agendador de Monitoramento**:
   - Implementar timer periódico tolerante a falhas individuais de hosts.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.6 - Rodada Tolerante a Falhas
  Dado uma lista de hosts onde um host está offline
  Quando a rodada periódica executa
  Então a falha do host offline não deve interromper a medição dos demais hosts
```

## 5. Plano de Verificação

- **Teste de Agendador**: Verificar rodadas periódicas no log.
