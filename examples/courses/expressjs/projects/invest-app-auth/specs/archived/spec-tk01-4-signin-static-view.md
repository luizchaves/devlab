# Spec TK01.4: Tela Estática de Login de Investidor (SignIn)

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.4
- **Branch**: feat/tk01-4-signin-view
- **História de Usuário**: US01 (Conhecer o sistema antes de usá-lo)
- **Requisitos Atendidos**: RF05, RNF05, RNF06

## 1. Contexto e Objetivos

Criar signin.html com formulário de login de usuário com campos email e password.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `signin.html` | Criar | Tela estática de login |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Tela de Login**:
   - Construir layout centralizado em cartão com link para signup.html.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.2 - Navegação entre Telas
  Dado que o usuário está em signin.html
  Quando clica no link "Criar conta"
  Então deve navegar diretamente para signup.html sem dependência de JavaScript
```

## 5. Plano de Verificação

- **Teste de Navegação**: Validar fluxo de links estáticos.
