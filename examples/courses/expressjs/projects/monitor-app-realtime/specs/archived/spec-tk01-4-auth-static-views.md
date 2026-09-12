# Spec TK01.4: Telas Estáticas de Autenticação (signin.html e signup.html)

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.4
- **Branch**: feat/tk01-4-auth-static-views
- **História de Usuário**: US01 (Conhecer o sistema antes de usá-lo)
- **Requisitos Atendidos**: RF05, RF06, RNF05, RNF06

## 1. Contexto e Objetivos

Criar front/signin.html e front/signup.html com formulários semânticos e links de navegação.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/signin.html` | Criar | Tela estática de login |
| `front/signup.html` | Criar | Tela estática de cadastro |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Telas de Auth**:
   - Construir formulários com atributos name, types apropriados e links de retorno.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.3 - Estrutura dos Campos de Formulário
  Dado os formulários de autenticação
  Quando os inputs são inspecionados
  Então devem conter os atributos name e type="password" para campos de senha
```

## 5. Plano de Verificação

- **Teste de Formulário**: Validar atributos name e navegação entre telas.
