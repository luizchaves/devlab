# Spec TK08.4: Integração do Formulário de Cadastro no Front-end

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK08.4
- **Branch**: feat/tk08-4-signup-front
- **História de Usuário**: US08 (Ter uma carteira própria)
- **Requisitos Atendidos**: RF02

## 1. Contexto e Objetivos

Criar front/js/signup.js conectando o formulário à API e redirecionando para signin.html em caso de sucesso.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/js/signup.js` | Criar | Lógica do formulário de cadastro |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Integração SignUp**:
   - Capturar submit, enviar dados via fetch e redirecionar para signin.html.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA08.6 - Redirecionamento após Cadastro
  Dado o preenchimento válido do formulário de cadastro
  Quando a submissão é concluída com 201
  Então o usuário deve ser redirecionado para signin.html
```

## 5. Plano de Verificação

- **Teste de Fluxo**: Preencher cadastro na interface e conferir redirecionamento.
