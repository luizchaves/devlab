# Spec TK07.2: Scripts de Migração e Sementes Relacionais

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.2
- **Branch**: feat/tk07-2-migration-seed
- **História de Usuário**: US09 (Não perder tarefas ao reiniciar)
- **Requisitos Atendidos**: RNF03

## 1. Contexto e Objetivos

Criar src/database/migration.ts e seed.ts, e scripts db:migrate, db:seed e db:reset no package.json.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/database/migration.ts` | Criar | Criação da tabela tasks |
| `src/database/seed.ts` | Criar | Inserção de tarefas iniciais |
| `package.json` | Modificar | Scripts de gerenciamento do banco |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Migração e Seed**:
   - Criar tabela com UNIQUE em title e script de seed com dados iniciais.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.1 - Comandos de Migração e Seed
  Dado que o banco de dados está vazio
  Quando o comando "npm run db:migrate" seguido de "npm run db:seed" é executado
  Então a tabela tasks deve ser criada e populada com os registros iniciais
```

## 5. Plano de Verificação

- **Execução de Migrações**: Rodar db:migrate e db:seed.
