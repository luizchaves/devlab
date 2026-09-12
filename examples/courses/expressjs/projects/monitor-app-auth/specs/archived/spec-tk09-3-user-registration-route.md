# Spec TK09.3: Rota de Cadastro de Usuários POST /api/users

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.3
- **Branch**: feat/tk09-3-users-route
- **História de Usuário**: US09 (Ter um inventário próprio)
- **Requisitos Atendidos**: RF05

## 1. Contexto e Objetivos

Criar rota POST /api/users com validação de e-mail único e confirmação de senha.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/users.routes.ts` | Criar | Rotas de usuários |
| `back/src/controllers/users.controller.ts` | Criar | Controller de usuários |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rota de Cadastro**:
   - Validar payload com Zod e persistir usuário com senha em hash.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.2 - Rejeição de E-mail Duplicado
  Dado que um e-mail já existe na base
  Quando um novo POST /api/users tenta utilizá-lo
  Então deve responder 409 Conflict
```

## 5. Plano de Verificação

- **Teste de Cadastro**: Cadastrar usuário e testar duplicidade.
