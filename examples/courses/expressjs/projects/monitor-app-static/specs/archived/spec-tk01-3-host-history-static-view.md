# Spec TK01.3: Tela Estática de Histórico de Host (host.html)

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.3
- **Branch**: feat/tk01-3-host-history-static-view
- **História de Usuário**: US01 (Conhecer o sistema antes de usá-lo)
- **Requisitos Atendidos**: RF03, RNF05, RNF06

## 1. Contexto e Objetivos

Criar front/host.html com cabeçalho de status, métricas de disponibilidade, gráfico de série temporal (sparkline) e tabela semântica de pings.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/host.html` | Criar | Tela estática de detalhes e histórico do host |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Tela de Histórico**:
   - Construir cabeçalho, cartões de métricas, sparkline SVG e tabela de pings.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.2 - Navegação para Histórico
  Dado que o usuário está em index.html
  Quando clica no link para host.html
  Então a tela de histórico deve ser exibida sem necessidade de backend ativo
```

## 5. Plano de Verificação

- **Navegação Estática**: Testar transição de links entre index.html e host.html.
