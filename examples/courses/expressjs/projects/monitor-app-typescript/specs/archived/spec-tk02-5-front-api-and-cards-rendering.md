# Spec TK02.5: Camada Front de API e Renderização de Cartões

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.5
- **Branch**: feat/tk02-5-front-api-cards
- **História de Usuário**: US02 (Manter o inventário de hosts)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Criar front/js/services/api.js e front/js/index.js para consumo da API e renderização dos cartões de host.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/js/services/api.js` | Criar | Serviço fetch da API |
| `front/js/index.js` | Criar | Renderização dinâmica de cartões |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Integração Front**:
   - Listar hosts, atualizar indicadores e criar novos hosts via formulário.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.7 - Renderização dos Cartões
  Dado que a API responde a lista de hosts
  Quando index.js processa os dados
  Então os cartões de status e métricas devem ser gerados no DOM
```

## 5. Plano de Verificação

- **Teste de Interface**: Abrir front no navegador e validar cartões.
