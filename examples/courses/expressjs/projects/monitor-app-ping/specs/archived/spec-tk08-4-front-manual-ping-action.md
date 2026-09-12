# Spec TK08.4: Botão de Ação "Medir agora" na Interface de Histórico

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.4
- **Branch**: feat/tk08-4-manual-ping-front
- **História de Usuário**: US08 (Saber se o host está no ar sem abrir o terminal)
- **Requisitos Atendidos**: RF04

## 1. Contexto e Objetivos

Adicionar botão "Medir agora" em host.html disparando medição sob demanda com atualização da tabela.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/js/host.js` | Modificar | Ação de medição manual |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Ação Manual**:
   - Vincular clique do botão a POST /api/hosts/:id/pings e atualizar DOM.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.1 - Medição sob Demanda no Front
  Dado que o usuário está na tela host.html
  Quando clica no botão "Medir agora"
  Então uma nova medição deve ser registrada e adicionada à tabela
```

## 5. Plano de Verificação

- **Teste de Ação**: Clicar no botão e verificar nova linha na tabela.
