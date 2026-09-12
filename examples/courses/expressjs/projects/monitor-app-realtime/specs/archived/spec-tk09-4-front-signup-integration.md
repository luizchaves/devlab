# Spec TK09.4: Integração do Formulário de Cadastro no Front-end

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.4
- **Branch**: feat/tk09-4-signup-front
- **História de Usuário**: US09 (Ter um inventário próprio)
- **Requisitos Atendidos**: RF05

## 1. Contexto e Objetivos

Criar front/js/signup.js conectando formulário à API e redirecionando para signin.html em caso de sucesso.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/js/signup.js` | Criar | Lógica de cadastro no front |

## 3. Plano de Implementação por Fases

1. **Fase 1 · SignUp Front**:
   - Enviar dados via fetch e redirecionar para login.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA09.6 - Redirecionamento após Cadastro
  Dado o preenchimento válido do formulário de cadastro
  Quando a submissão é concluída com 201
  Então o usuário deve ser redirecionado para signin.html
```

## 5. Plano de Verificação

- **Teste de Fluxo**: Testar cadastro na interface.
