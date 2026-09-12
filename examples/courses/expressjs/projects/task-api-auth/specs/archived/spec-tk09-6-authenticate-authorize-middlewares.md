# Spec TK09.6: Middlewares de Autenticação e Autorização por Papel

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.6
- **Branch**: feat/tk09-6-auth-middlewares
- **História de Usuário**: US12 (Entrar e me identificar)
- **Requisitos Atendidos**: RF05, RF06

## 1. Contexto e Objetivos

Criar src/middlewares/authenticate.ts e authorize.ts protegendo as rotas de /tasks.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/middlewares/authenticate.ts` | Criar | Validação de Bearer token |
| `src/middlewares/authorize.ts` | Criar | Controle de acesso por role |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Proteção de Rotas**:
   - Extrair token, validar assinatura e injetar req.auth no contexto.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA12.3 - Bloqueio de Acesso Não Autenticado
  Dado uma rota protegida de /tasks
  Quando uma requisição sem cabeçalho Authorization é enviada
  Então deve responder 401 Unauthorized
```

## 5. Plano de Verificação

- **Teste de Bloqueio**: Enviar requisição sem token e checar 401.
