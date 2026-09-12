# Spec TK10.5: Módulo Front de Sessão e Injeção de Token

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK10.5
- **Branch**: feat/tk10-5-front-auth
- **História de Usuário**: US10 (Entrar no sistema)
- **Requisitos Atendidos**: RF06

## 1. Contexto e Objetivos

Criar front/js/lib/auth.js e injetar token nas requisições da camada de API.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/js/lib/auth.js` | Criar | Gerenciamento de sessão |
| `front/js/signin.js` | Criar | Lógica da tela de login |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Sessão no Front**:
   - Salvar token no localStorage e anexar nas requisições.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA10.5 - Token no LocalStorage
  Dado que o login foi realizado com sucesso
  Quando o token é retornado
  Então deve ser armazenado no localStorage e enviado nas requisições subsequentes
```

## 5. Plano de Verificação

- **Teste de Sessão**: Fazer login no front e checar requisições.
