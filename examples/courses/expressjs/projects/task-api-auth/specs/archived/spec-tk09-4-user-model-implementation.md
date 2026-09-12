# Spec TK09.4: Model de Usuários com Omissão Segura de Senha

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK09.4
- **Branch**: feat/tk09-4-user-model
- **História de Usuário**: US11 (Ter uma conta)
- **Requisitos Atendidos**: RF04, RNF02

## 1. Contexto e Objetivos

Criar src/models/user-model.ts com create e findByEmail utilizando select estrito que nunca retorna password.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/models/user-model.ts` | Criar | Operações de banco para usuários |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Model User**:
   - Implementar consultas com omissão da senha nas projeções.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA11.2 - Rejeição de E-mail Duplicado
  Dado que um e-mail já existe na base
  Quando um novo cadastro tenta utilizar o mesmo e-mail
  Então a API deve responder status 409 Conflict
```

## 5. Plano de Verificação

- **Teste de Duplicidade**: Tentar cadastrar mesmo e-mail e checar 409.
