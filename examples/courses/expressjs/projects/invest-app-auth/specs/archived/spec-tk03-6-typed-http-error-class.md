# Spec TK03.6: Classe Tipada de Erro HttpError

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.6
- **Branch**: feat/tk03-6-http-error
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Criar back/src/errors/HttpError.ts e middleware central de erro.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/errors/HttpError.ts` | Criar | Classe de erro HTTP |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Classe HttpError**:
   - Definir HttpError com status code e mensagem descritiva.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.5 - Envelope de Erro Padronizado
  Dado um erro emitido pelo backend
  Quando a resposta é gerada
  Então deve conter o formato { error: { status, message } }
```

## 5. Plano de Verificação

- **Checagem de Erro**: Confirmar formatação de erro JSON.
