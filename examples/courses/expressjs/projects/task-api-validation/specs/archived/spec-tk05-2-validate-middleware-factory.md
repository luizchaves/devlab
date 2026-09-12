# Spec TK05.2: Fábrica de Middleware de Validação Declarativa

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK05.2
- **Branch**: feat/tk05-2-validate-middleware
- **História de Usuário**: US06 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Criar src/middlewares/validate.ts e src/types/express.d.ts para validação declarativa e injeção de dados validados em req.valid.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/middlewares/validate.ts` | Criar | Fábrica de validação Zod |
| `src/types/express.d.ts` | Criar | Extensão de tipagem do Request Express |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Middleware Validate**:
   - Implementar validação unificada de body, params, query, headers e cookies.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA06.2 - Estrutura de Issues por Fonte
  Dado uma requisição com dados inválidos
  Quando o middleware validate processa as fontes
  Então cada issue deve iniciar o path pela fonte (body, params, query)
```

## 5. Plano de Verificação

- **Checagem de Issues**: Verificar formato de erro com path de fonte.
