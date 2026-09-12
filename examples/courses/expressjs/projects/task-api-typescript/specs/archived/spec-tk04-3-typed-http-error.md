# Spec TK04.3: Classe de Erro Tipada HttpError

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.3
- **Branch**: feat/tk04-3-http-error-class
- **História de Usuário**: US05 (Deixar o compilador apontar a quebra)
- **Requisitos Atendidos**: RNF04, RNF10

## 1. Contexto e Objetivos

Criar src/errors/HttpError.ts com classe tipada herdando de Error contendo status HTTP e mensagem.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/errors/HttpError.ts` | Criar | Classe tipada HttpError |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Classe HttpError**:
   - Criar classe HttpError com status numérico e mensagem.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.3 - Instanciação Tipada de Erro
  Dado que um erro HTTP precisa ser emitido
  Quando HttpError é instanciado com status e mensagem
  Então o erro deve preservar status numérico e stack trace
```

## 5. Plano de Verificação

- **Checagem de Erro**: Confirmar instanciação tipada.
