# Spec TK07.3: Models de Host, Tag e Ping com Prisma Client e Cascade

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.3
- **Branch**: feat/tk07-3-prisma-models
- **História de Usuário**: US07 (Organizar e comparar os hosts)
- **Requisitos Atendidos**: RF02, RF03, RNF03

## 1. Contexto e Objetivos

Reescrever models Host, Tag e Ping com Prisma Client garantindo exclusão em cascata de medições.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/models/Host.ts` | Modificar | Model Host sobre Prisma |
| `back/src/models/Tag.ts` | Criar | Model Tag sobre Prisma |
| `back/src/models/Ping.ts` | Criar | Model Ping sobre Prisma |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Models Prisma**:
   - Implementar CRUD com Prisma Client e cascade.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA07.5 - Exclusão em Cascata do Histórico
  Dado um host contendo múltiplos pings registrados
  Quando o host é excluído
  Então todo o histórico de pings vinculado deve ser removido automaticamente
```

## 5. Plano de Verificação

- **Teste de Cascata**: Excluir host e verificar limpeza de pings.
