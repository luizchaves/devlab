# Spec TK11.4: Módulo Front de Eventos e Atualização em Tempo Real

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK11.4
- **Branch**: feat/tk11-4-front-sse
- **História de Usuário**: US12 (Ver a rede mudando ao vivo)
- **Requisitos Atendidos**: RF08

## 1. Contexto e Objetivos

Criar front/js/lib/events.js escutando SSE e atualizando cores e métricas nos cartões sem reload.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/js/lib/events.js` | Criar | Consumo de SSE no front |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Mutações no DOM**:
   - Conectar EventSource e atualizar latency-bar e status-dot ao vivo.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.3 - Atualização sem Reload
  Dado que um evento de ping é recebido no front
  Quando o módulo events.js processa a mensagem
  Então o cartão do host correspondente deve atualizar cores e latência sem recarregar a página
```

## 5. Plano de Verificação

- **Teste Visual ao Vivo**: Executar medição e observar mutação dinâmica na tela.
