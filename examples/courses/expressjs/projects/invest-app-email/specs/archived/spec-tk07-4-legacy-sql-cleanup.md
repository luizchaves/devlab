# Spec TK07.4: Remoção da Camada Legada de SQL Manual

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.4
- **Branch**: feat/tk07-4-sql-cleanup
- **História de Usuário**: US07 (Enxergar distribuição do patrimônio)
- **Requisitos Atendidos**: RNF03

## 1. Contexto e Objetivos

Remover arquivos de banco manuais eliminando código SQL cru da aplicação.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/database/database.ts` | Remover | Camada SQL manual legada |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Limpeza de Código**:
   - Excluir arquivos legados de conexão SQL.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA07.5 - Ausência de Queries SQL Manuais
  Dado a base de código do InvestApp
  Quando os arquivos em back/src/ são inspecionados
  Então não deve existir código SQL manual
```

## 5. Plano de Verificação

- **Auditoria de Código**: Confirmar uso exclusivo do Prisma.
