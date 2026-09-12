# Spec TK03.6: Classe Tipada de Erro HttpError e Handlers

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.6
- **Branch**: feat/tk03-6-http-error
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar back/src/errors/HttpError.ts e middlewares de erro centralizados.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/errors/HttpError.ts` | Criar | Classe tipada HttpError |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Classe HttpError**:
   - Definir classe com status e mensagem padronizada.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.5 - Formato Padronizado de Erro
  Dado que um erro é lançado na aplicação
  Quando o errorHandler responde
  Então deve emitir o envelope { error: { status, message } }
```

## 5. Plano de Verificação

- **Checagem de Formato**: Verificar resposta JSON de erro.
