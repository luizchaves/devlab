# Spec TK04.4: Utilitário de Cookies e Validação de Cabeçalhos

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.4
- **Branch**: feat/tk04-4-cookies-validation
- **História de Usuário**: US04 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Criar back/src/utils/cookies.ts para parsing nativo de cookies e suporte a headers no validate.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/utils/cookies.ts` | Criar | Parser de cookies nativo |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Validação de Cookies**:
   - Implementar parseCookies sem pacotes externos e validar headers.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.8 - Validação de Cabeçalhos e Cookies
  Dado uma requisição com cookies e headers customizados
  Quando o validate executa
  Então deve validar as 5 fontes simultaneamente
```

## 5. Plano de Verificação

- **Teste de Fontes**: Validar cookies e headers.
