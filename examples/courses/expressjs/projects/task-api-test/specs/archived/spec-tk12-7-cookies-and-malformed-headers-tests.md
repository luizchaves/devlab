# Spec TK12.7: Testes de Validação de Cookies e Cabeçalhos Malformados

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK12.7
- **Branch**: feat/tk12-7-cookies-tests
- **História de Usuário**: US20 (Alterar sem quebrar o existente)
- **Requisitos Atendidos**: RNF08

## 1. Contexto e Objetivos

Criar src/utils/cookies.test.ts e testes de rejeição para cabeçalhos malformados em rotas protegidas.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/utils/cookies.test.ts` | Criar | Testes unitários de parsing de cookies |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Testes de Cookies**:
   - Validar parser de cookies com múltiplos pares e caracteres especiais.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA20.7 - Testes de Cookies e Cabeçalhos
  Dado a suíte de testes de validação
  Quando os testes são executados
  Então devem comprovar integridade do parser de cookies e rejeição de cabeçalhos malformados
```

## 5. Plano de Verificação

- **Validação de Cookies**: Executar pnpm test.
