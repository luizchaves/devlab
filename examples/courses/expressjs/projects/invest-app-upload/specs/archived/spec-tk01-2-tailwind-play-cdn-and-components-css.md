# Spec TK01.2: Integração do Tailwind Play CDN e Folha de Componentes

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.2
- **Branch**: feat/tk01-2-tailwind-play-cdn
- **História de Usuário**: US01 (Conhecer o sistema antes de usá-lo)
- **Requisitos Atendidos**: RNF05, RNF06

## 1. Contexto e Objetivos

Carregar Tailwind CSS via Play CDN e criar css/components.css com vocabulário visual do InvestApp (:root, .card, .btn, .field, .input, .badge).

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `css/components.css` | Criar | Tokens de cores e classes de componentes |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Design Tokens**:
   - Declarar variáveis de cores Slate, Emerald, Amber, Rose, Indigo e estilos de cartões e botões.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.2 - Aplicação de Classes de Componente
  Dado que css/components.css é importado
  Quando elementos com classes .card, .btn-primary e .badge são renderizados
  Então devem exibir os tokens de cores e sombras definidos
```

## 5. Plano de Verificação

- **Inspeção Visual**: Verificar estilização consistente em todas as telas.
