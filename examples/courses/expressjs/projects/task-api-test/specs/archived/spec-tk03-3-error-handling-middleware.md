# Spec TK03.3: Middleware Centralizado de Erros e 404

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.3
- **Branch**: feat/tk03-3-error-middleware
- **História de Usuário**: US04 (Cada responsabilidade no seu lugar)
- **Requisitos Atendidos**: RNF04

## 1. Contexto e Objetivos

Criar src/middlewares/error-handler.js contendo a classe HttpError, o manipulador notFound e o middleware central errorHandler.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/middlewares/error-handler.js` | Criar | Padronização de envelopes de erro |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Middleware de Erro**:
   - Criar HttpError, notFound e errorHandler de 4 parâmetros.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.5 - Envelope Único de Erro
  Dado que ocorre um erro na requisição
  Quando a resposta é enviada pelo errorHandler
  Então deve possuir o formato { error: { status, message } }
```

## 5. Plano de Verificação

- **Formato de Erro**: Checar envelope JSON padronizado.
