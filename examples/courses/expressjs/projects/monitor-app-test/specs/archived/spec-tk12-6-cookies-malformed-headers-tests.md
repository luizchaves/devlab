# Spec TK12.6: Testes de Validação de Cookies e Cabeçalhos Malformados

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK12.6
- **Branch**: feat/tk12-6-cookies-headers-tests
- **História de Usuário**: US13 (Alterar sem quebrar o existente)
- **Requisitos Atendidos**: RNF08

## 1. Contexto e Objetivos

Criar utils/cookies.test.ts e casos de rejeição de cabeçalhos malformados.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `back/tests/unit/cookies.test.ts` | Criar | Testes de cookies |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Testes de Cookies**:
   - Validar parser de cookies nativo e cabeçalhos inválidos.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA13.7 - Cabeçalhos e Cookies Testados
  Dado requisições com cookies formatados e cabeçalhos malformados
  Quando a suíte de testes avalia os cenários
  Então deve comprovar parsing correto e rejeição apropriada
```

## 5. Plano de Verificação

- **Testes de Cookies**: Executar npm test.
