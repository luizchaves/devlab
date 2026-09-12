# Spec TK03.3: Declaração de Tipos e Interfaces de Investimentos

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK03.3
- **Branch**: feat/tk03-3-domain-types
- **História de Usuário**: US03 (Mudar o código sem medo)
- **Requisitos Atendidos**: RNF06

## 1. Contexto e Objetivos

Declarar interfaces Investment e InvestmentInput em back/src/types/investment.ts.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/types/investment.ts` | Criar | Tipagem de domínio |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Tipos de Domínio**:
   - Declarar Investment com id, name, value e InvestmentInput.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA03.6 - Compatibilidade de Contrato
  Dado as interfaces tipadas de investimentos
  Quando os controllers e models consomem os tipos
  Então os contratos de entrada e saída devem ser estritamente verificados
```

## 5. Plano de Verificação

- **Validação de Tipagem**: Checar conformidade de tipos.
