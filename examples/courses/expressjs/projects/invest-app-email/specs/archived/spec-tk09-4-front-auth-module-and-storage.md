# Spec TK09.4: Módulo Front de Autenticação e Injeção de Token

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.4
- **Branch**: feat/tk09-4-front-auth
- **História de Usuário**: US09 (Entrar no sistema)
- **Requisitos Atendidos**: RF03

## 1. Contexto e Objetivos

Criar front/js/lib/auth.js persistindo token no localStorage e injetando Authorization: Bearer nas requisições.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/js/lib/auth.js` | Criar | Gerenciamento de sessão no cliente |
| `front/js/signin.js` | Criar | Lógica da tela de login |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Sessão no Front**:
   - Salvar token no localStorage e anexar no cabeçalho das chamadas à API.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.5 - Persistência no LocalStorage
  Dado que o login foi realizado com sucesso
  Quando o token é retornado
  Então deve ser armazenado no localStorage e injetado nas requisições subsequentes
```

## 5. Plano de Verificação

- **Teste de Sessão**: Fazer login no front e checar cabeçalhos enviados.
