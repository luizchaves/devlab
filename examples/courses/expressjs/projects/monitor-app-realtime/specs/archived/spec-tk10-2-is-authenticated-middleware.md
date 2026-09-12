# Spec TK10.2: Middleware de Autenticação isAuthenticated

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.2
- **Branch**: feat/tk10-2-auth-middleware
- **História de Usuário**: US10 (Entrar no sistema)
- **Requisitos Atendidos**: RF06

## 1. Contexto e Objetivos

Criar back/src/middlewares/isAuthenticated.ts estendendo a tipagem de Request com userId autenticado.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/middlewares/isAuthenticated.ts` | Criar | Middleware de autenticação |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Middleware de Auth**:
   - Validar Bearer token e injetar req.userId no request.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.3 - Bloqueio sem Token
  Dado uma rota protegida do MonitorApp
  Quando uma requisição sem cabeçalho Authorization é enviada
  Então deve responder 401 Unauthorized
```

## 5. Plano de Verificação

- **Teste de Bloqueio**: Acessar rota protegida sem token.
