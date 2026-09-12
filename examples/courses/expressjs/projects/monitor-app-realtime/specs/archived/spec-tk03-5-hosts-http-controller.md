# Spec TK03.5: Controller HTTP de Gerenciamento de Hosts

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.5
- **Branch**: feat/tk03-5-http-controller
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar back/src/controllers/hosts.controller.ts traduzindo requisições HTTP e lançando HttpError.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/controllers/hosts.controller.ts` | Criar | Controller de hosts |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Handlers de Host**:
   - Implementar métodos HTTP coordenando chamadas ao model.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.5 - Tratamento de Erros via HttpError
  Dado uma falha em uma operação de host
  Quando o controller processa a requisição
  Então deve lançar HttpError para ser tratado pelo errorHandler central
```

## 5. Plano de Verificação

- **Tratamento de Exceções**: Validar captura de erros no controller.
