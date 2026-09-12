# Spec TK04.2: Schemas Zod de Validação para Investimentos

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK04.2
- **Branch**: feat/tk04-2-investment-schemas
- **História de Usuário**: US04 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Criar back/src/schemas/investment.schema.ts com validação de UUIDs, valores numéricos positivos e strings não-vazias.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/schemas/investment.schema.ts` | Criar | Schemas Zod de investimentos |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Schemas de Investimento**:
   - Declarar schemas para create, update, params e query.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA04.3 - Validação de ID UUID
  Dado uma requisição GET /api/investments/123-invalido
  Quando o schema de params avalia o ID
  Então deve responder 400 informando que o ID deve ser um UUID válido
```

## 5. Plano de Verificação

- **Validação de UUID**: Testar IDs inválidos e checar rejeição.
