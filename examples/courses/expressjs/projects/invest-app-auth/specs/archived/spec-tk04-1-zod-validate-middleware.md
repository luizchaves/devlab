# Spec TK04.1: Middleware Genérico de Validação com Zod

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.1
- **Branch**: feat/tk04-1-validate-middleware
- **História de Usuário**: US04 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Criar back/src/middlewares/validate.ts aplicando validação Zod sobre body, params, query, headers e cookies.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/middlewares/validate.ts` | Criar | Middleware de validação Zod |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Middleware Zod**:
   - Validar entradas e responder 400 estruturado com issues do Zod.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.1 - Resposta Estruturada de Erro (400)
  Dado uma requisição com dados inválidos
  Quando o middleware validate executa
  Então deve responder status 400 com lista de issues detalhadas
```

## 5. Plano de Verificação

- **Teste de Validação**: Enviar payload malformado e checar 400.
