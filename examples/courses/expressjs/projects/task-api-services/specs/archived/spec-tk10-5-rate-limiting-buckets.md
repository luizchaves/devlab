# Spec TK10.5: Limitação de Taxa com Baldes de Token Dedicados

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.5
- **Branch**: feat/tk10-5-rate-limiting
- **História de Usuário**: US15 (Proteger a borda da API)
- **Requisitos Atendidos**: RNF07

## 1. Contexto e Objetivos

Criar src/middlewares/rate-limit.ts com baldes dedicados para tráfego global e proteção estrita em POST /auth/signin.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/middlewares/rate-limit.ts` | Criar | Middleware de rate limit em memória |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Rate Limiting**:
   - Implementar contador por IP com resposta 429 e header Retry-After.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA15.4 - Bloqueio por Excesso de Tentativas de Login
  Dado que um cliente atinge o limite de 5 tentativas de login por minuto
  Quando a 6ª tentativa é enviada
  Então deve responder status 429 Too Many Requests com Retry-After
```

## 5. Plano de Verificação

- **Teste de Limite**: Disparar requisições em série e checar 429.
