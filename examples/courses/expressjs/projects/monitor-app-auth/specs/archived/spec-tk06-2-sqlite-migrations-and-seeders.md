# Spec TK06.2: Scripts de Migração e Sementes do Inventário

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK06.2
- **Branch**: feat/tk06-2-migrations-seeders
- **História de Usuário**: US06 (Não perder o inventário ao fechar o sistema)
- **Requisitos Atendidos**: RF01, RNF03

## 1. Contexto e Objetivos

Criar scripts de migração e sementes e script npm run db:load no package.json.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/database/migration.ts` | Criar | Criação de tabela de hosts |
| `back/src/database/seed.ts` | Criar | Inserção de hosts iniciais |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Carga do Banco**:
   - Criar tabela e popular dados iniciais via db:load.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA06.1 - Carga do Banco de Dados
  Dado que o banco está vazio
  Quando o comando npm run db:load é executado
  Então as tabelas e dados iniciais de hosts devem ser criados
```

## 5. Plano de Verificação

- **Carga de Dados**: Executar npm run db:load.
