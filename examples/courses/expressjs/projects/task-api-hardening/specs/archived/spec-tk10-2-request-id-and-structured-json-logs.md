# Spec TK10.2: Rastreabilidade com Request ID e Logs Estruturados em JSON

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.2
- **Branch**: feat/tk10-2-structured-logging
- **História de Usuário**: US14 (Saber como o serviço está)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar src/middlewares/request-id.ts e reescrever logger.ts gerando logs estruturados em JSON no evento finish.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/middlewares/request-id.ts` | Criar | Injeção e propagação de X-Request-Id |
| `src/middlewares/logger.ts` | Modificar | Emissão de log JSON com duração e status |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Logs JSON**:
   - Injetar X-Request-Id e emitir log estruturado com requestId e duração.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA14.2 - Log Estruturado em JSON
  Dado uma requisição HTTP processada
  Quando a resposta é finalizada
  Então o log deve ser emitido como uma linha JSON com requestId, method, path, status e durationMs
```

## 5. Plano de Verificação

- **Inspeção de Log**: Checar saída JSON no console.
