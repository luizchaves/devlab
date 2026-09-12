# Spec TK08.3: Singleton do Prisma Client com Driver Adapter

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.3
- **Branch**: feat/tk08-3-prisma-client
- **História de Usuário**: US10 (Classificar tarefas com tags)
- **Requisitos Atendidos**: RF03, RNF03

## 1. Contexto e Objetivos

Criar src/database/prisma.ts instanciando PrismaClient com driver adapter do SQLite (@prisma/adapter-better-sqlite3).

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/database/prisma.ts` | Criar | Client singleton do Prisma |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Prisma Singleton**:
   - Instanciar PrismaClient com driver adapter e exportar instância singleton.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.1 - Carregamento de Relações
  Dado que tarefas possuem tags associadas
  Quando uma consulta com include: { tags: true } é realizada
  Então as tags devem ser retornadas na mesma resposta
```

## 5. Plano de Verificação

- **Teste de Instanciação**: Verificar conexão singleton.
