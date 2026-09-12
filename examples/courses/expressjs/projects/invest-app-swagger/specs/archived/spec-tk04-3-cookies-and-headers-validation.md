# Spec TK04.3: Utilitário de Cookies e Validação de Cabeçalhos

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.3
- **Branch**: feat/tk04-3-cookies-validation
- **História de Usuário**: US04 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Criar back/src/utils/cookies.ts com parser nativo de cookies e suporte a validação de headers.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/utils/cookies.ts` | Criar | Parser de cookies nativo |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Utilitário de Cookies**:
   - Implementar parseCookies e integrar no middleware validate.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.7 - Headers e Cookies como Fontes
  Dado uma requisição com cookies e headers customizados
  Quando o validate executa
  Então deve validar todas as 5 fontes simultaneamente
```

## 5. Plano de Verificação

- **Teste de Fontes**: Checar validação de cookies sem dependência externa.
