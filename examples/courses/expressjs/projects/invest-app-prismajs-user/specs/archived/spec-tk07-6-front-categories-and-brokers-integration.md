# Spec TK07.6: Integração de Categorias e Corretoras no Front-end

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK07.6
- **Branch**: feat/tk07-6-front-integration
- **História de Usuário**: US07 (Enxergar distribuição do patrimônio)
- **Requisitos Atendidos**: RF01

## 1. Contexto e Objetivos

Exibir categorias e corretoras nos cartões de investimento e preencher selects no formulário.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/js/index.js` | Modificar | Renderização de categorias e corretoras |

## 3. Plano de Implementação por Fases

1. **Fase 1 · UI Dinâmica**:
   - Popular dropdowns de categorias e corretoras e exibir badges nos cartões.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA07.2 - Exibição de Categoria no Cartão
  Dado que um investimento possui categoria Renda Fixa
  Quando o cartão é renderizado no front
  Então deve exibir a badge correspondente com nome da categoria e corretora
```

## 5. Plano de Verificação

- **Teste de Interface**: Inspecionar cartões no navegador.
