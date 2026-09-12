# Spec TK09.2: Rota de Login POST /api/signin e Emissão de Token

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.2
- **Branch**: feat/tk09-2-signin-route
- **História de Usuário**: US09 (Entrar no sistema)
- **Requisitos Atendidos**: RF03

## 1. Contexto e Objetivos

Criar rota POST /api/signin autenticando usuário e respondendo 200 com token JWT.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/auth.routes.ts` | Criar | Rotas de autenticação |
| `back/src/controllers/auth.controller.ts` | Criar | Controller de login |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rota de Login**:
   - Comparar hash da senha e emitir JWT assinado com dados públicos.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.1 - Login com Sucesso
  Dado credenciais válidas de investidor
  Quando o POST /api/signin é processado
  Então deve responder 200 com token JWT e dados do usuário
```

## 5. Plano de Verificação

- **Teste de Login**: Realizar login via requests.http.
