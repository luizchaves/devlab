# Spec TK09.1: Entidade User no Schema Prisma com Relação por Dono

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.1
- **Branch**: feat/tk09-1-user-schema
- **História de Usuário**: US11 (Ter uma conta)
- **Requisitos Atendidos**: RF04, RNF02

## 1. Contexto e Objetivos

Adicionar entidade User em prisma/schema.prisma com email, password, role e unicidade composta @@unique([userId, title]) em Task.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `prisma/schema.prisma` | Modificar | Modelagem de User e relação de posse |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Model User**:
   - Adicionar User com email único, role e relação 1-N com Task.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA11.1 - Cadastro sem Exposição de Senha
  Dado uma requisição POST /auth/signup com dados válidos
  Quando o usuário é criado
  Então deve responder 201 com id, name, email, role e sem o campo password
```

## 5. Plano de Verificação

- **Validação de Schema**: Executar migração de User com sucesso.
