# Spec TK09.3: Consultas e Mutações Escopadas pelo Usuário Autenticado

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.3
- **Branch**: feat/tk09-3-scoped-queries
- **História de Usuário**: US10 (Ver apenas a minha carteira)
- **Requisitos Atendidos**: RF04

## 1. Contexto e Objetivos

Escopar todas as operações do model de investimentos pelo userId extraído do token.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/models/Investment.ts` | Modificar | Consultas escopadas por userId |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Isolamento de Carteira**:
   - Filtrar find, update e delete pelo par id + userId.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.1 - Isolamento por Proprietário
  Dado que o investidor A está autenticado
  Quando consulta a lista de investimentos
  Então deve visualizar exclusivamente os seus próprios investimentos cadastrados
```

## 5. Plano de Verificação

- **Teste de Isolamento**: Garantir que usuários diferentes não visualizem carteiras alheias.
