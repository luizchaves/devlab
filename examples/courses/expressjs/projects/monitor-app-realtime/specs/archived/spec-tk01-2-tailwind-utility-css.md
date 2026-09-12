# Spec TK01.2: Folha de Componentes e Tokens Visuais

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.2
- **Branch**: feat/tk01-2-tailwind-utility-css
- **História de Usuário**: US01 (Conhecer o sistema antes de usá-lo)
- **Requisitos Atendidos**: RNF05, RNF06

## 1. Contexto e Objetivos

Criar front/css/components.css com tokens de cores (:root), classes de componentes (.card, .btn, .field, .input, .metric), indicadores (.status-dot, .latency-bar) e estilos de sparkline.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/css/components.css` | Criar | Tokens visuais e componentes do produto |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Tokens e Componentes**:
   - Definir paleta de cores e estilos para status-dot, latency-bar e tabelas.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.1 - Aplicação de Componentes e Tokens
  Dado que front/css/components.css é importado nas páginas
  Quando elementos com classes .host-card e .status-dot são renderizados
  Então devem refletir as cores de status e estilos de latência definidos
```

## 5. Plano de Verificação

- **Inspeção Visual**: Verificar classes e tokens visuais no navegador.
