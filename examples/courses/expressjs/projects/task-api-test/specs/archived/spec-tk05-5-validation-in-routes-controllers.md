# Spec TK05.5: Integração de Validação nas Rotas e Controllers

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK05.5
- **Branch**: feat/tk05-5-routes-validation
- **História de Usuário**: US06 (Saber exatamente o que corrigir)
- **Requisitos Atendidos**: RNF01

## 1. Contexto e Objetivos

Aplicar validate(schema) em todas as rotas e simplificar controllers consumindo diretamente req.valid sem ifs manuais.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `src/routes/task-router.ts` | Modificar | Injeção de validate nas rotas |
| `src/controllers/task-controller.ts` | Modificar | Consumo de req.valid sem validações manuais |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Limpeza de Controllers**:
   - Remover ifs de validação e ler dados de req.valid.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA06.5 - Controllers sem Condicionais de Formato
  Dado que os dados chegam validados pelo middleware
  Quando o controller executa a operação
  Então deve consumir req.valid diretamente sem checagens manuais de tipo
```

## 5. Plano de Verificação

- **Refatoração Limpa**: Garantir controllers concisos e sem ifs.
