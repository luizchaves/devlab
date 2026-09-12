# Spec TK05.6: Utilitário de Cookies e Validação de Cinco Fontes

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK05.6
- **Branch**: feat/tk05-6-cookies-validation
- **História de Usuário**: US06 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Criar src/utils/cookies.ts e estender validate.ts para validar simultaneamente body, query, params, headers e cookies sem pacotes externos.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/utils/cookies.ts` | Criar | Parser nativo de cookies |
| `src/middlewares/validate.ts` | Modificar | Suporte a headers e cookies |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Cinco Fontes**:
   - Implementar parseCookies e incluir headers e cookies no validate.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA06.7 - Validação de Cinco Fontes
  Dado uma requisição HTTP completa
  Quando o middleware validate executa
  Então deve validar body, query, params, headers e cookies de forma unificada
```

## 5. Plano de Verificação

- **Teste de Cookies**: Testar parsing de cookies sem cookie-parser.
