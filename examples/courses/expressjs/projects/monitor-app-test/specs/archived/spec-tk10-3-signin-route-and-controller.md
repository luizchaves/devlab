# Spec TK10.3: Rota de Login POST /api/signin e Emissão de Token

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.3
- **Branch**: feat/tk10-3-signin-route
- **História de Usuário**: US10 (Entrar no sistema)
- **Requisitos Atendidos**: RF06

## 1. Contexto e Objetivos

Criar back/src/routes/auth.routes.ts e controller de autenticação.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/src/routes/auth.routes.ts` | Criar | Rotas de autenticação |
| `back/src/controllers/auth.controller.ts` | Criar | Controller de login |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rota de Login**:
   - Validar credenciais e responder 200 com token JWT.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.2 - Resposta 401 Única no Login
  Dado uma tentativa de login com credenciais incorretas
  Quando o endpoint POST /api/signin processa a tentativa
  Então deve responder 401 Unauthorized com mensagem genérica
```

## 5. Plano de Verificação

- **Teste de Login**: Realizar login via requests.http.
