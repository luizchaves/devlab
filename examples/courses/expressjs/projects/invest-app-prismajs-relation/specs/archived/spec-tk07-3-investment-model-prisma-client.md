# Spec TK07.3: Model de Investimentos com Prisma Client e Inclusões

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.3
- **Branch**: feat/tk07-3-model-prisma
- **História de Usuário**: US07 (Enxergar distribuição do patrimônio)
- **Requisitos Atendidos**: RF01, RNF03

## 1. Contexto e Objetivos

Reescrever back/src/models/Investment.ts com Prisma Client incluindo category e broker nas consultas.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/models/Investment.ts` | Modificar | Model sobre Prisma Client |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Model Prisma**:
   - Migrar consultas para Prisma com include e connect.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA07.3 - Criação Automática de Corretora
  Dado um cadastro de investimento com corretora inédita
  Quando o payload é processado com connectOrCreate
  Então a corretora deve ser criada e associada dinamicamente
```

## 5. Plano de Verificação

- **Teste de Relações**: Criar investimento com nova corretora.
