# Spec TK03.5: Controller HTTP de Investimentos

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.5
- **Branch**: feat/tk03-5-http-controller
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar back/src/controllers/investments.controller.ts traduzindo requisições HTTP em chamadas ao model.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/controllers/investments.controller.ts` | Criar | Controller de investimentos |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Handlers do Controller**:
   - Implementar métodos HTTP e lançar HttpError em caso de falha.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.5 - Centralização no errorHandler
  Dado que uma falha de validação ou recurso ausente ocorre
  Quando o controller processa a ação
  Então deve lançar HttpError para ser tratado exclusivamente pelo errorHandler
```

## 5. Plano de Verificação

- **Teste de Controller**: Validar captura centralizada de erros.
