# Spec TK10.3: Sondas de Saúde (Health/Ready) e Métricas Prometheus

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.3
- **Branch**: feat/tk10-3-telemetry-metrics
- **História de Usuário**: US14 (Saber como o serviço está)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar src/routes/health-router.ts e src/telemetry.ts exportando /health, /ready (com checagem de banco) e /metrics com percentis.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/routes/health-router.ts` | Criar | Rotas de sondas operacionais |
| `src/telemetry.ts` | Criar | Coleta de métricas e percentis |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Telemetria**:
   - Implementar /health, /ready e exportação de contadores em /metrics.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA14.4 - Sonda de Prontidão /ready
  Dado que o banco de dados está inacessível
  Quando a sonda GET /ready é consultada
  Então deve responder status 503 Service Unavailable
```

## 5. Plano de Verificação

- **Teste de Sondas**: Consultar /health, /ready e /metrics.
