# Spec TK08.5: Associação de Investimentos ao Proprietário (userId)

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.5
- **Branch**: feat/tk08-5-investment-ownership
- **História de Usuário**: US08 (Ter uma carteira própria)
- **Requisitos Atendidos**: RF02

## 1. Contexto e Objetivos

Associar o campo userId a todos os investimentos no schema e atualizar queries.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/models/Investment.ts` | Modificar | Inclusão de userId nos investimentos |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Vínculo de Posse**:
   - Vincular cada registro ao userId do proprietário.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.5 - Posse de Investimento
  Dado um novo investimento cadastrado
  Quando o registro é persistido
  Então deve conter o userId correspondente ao investidor
```

## 5. Plano de Verificação

- **Auditoria de Dados**: Verificar presença de userId nos registros.
