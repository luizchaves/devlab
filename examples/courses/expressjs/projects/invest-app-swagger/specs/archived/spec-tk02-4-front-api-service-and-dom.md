# Spec TK02.4: Camada de Serviços Front e Renderização Dinâmica

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.4
- **Branch**: feat/tk02-4-front-services
- **História de Usuário**: US02 (Manter a carteira pela aplicação)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Criar front/js/services/api.js com chamadas fetch e front/js/index.js para renderização dinâmica dos cartões.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/js/services/api.js` | Criar | Cliente HTTP fetch |
| `front/js/index.js` | Criar | Manipulação de DOM e listagem dinâmica |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Integração Front**:
   - Consumir API via fetch e renderizar cartões e métricas no DOM.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.7 - Renderização Dinâmica no Front
  Dado que a API responde a lista de investimentos
  Quando front/js/index.js carrega os dados
  Então os cartões de investimentos e totais devem ser gerados dinamicamente no DOM
```

## 5. Plano de Verificação

- **Teste de Front**: Abrir front no navegador e validar renderização dinâmica.
