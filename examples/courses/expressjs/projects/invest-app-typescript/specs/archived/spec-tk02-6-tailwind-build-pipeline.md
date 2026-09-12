# Spec TK02.6: Pipeline de Compilação do Tailwind CSS via Vite

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK02.6
- **Branch**: feat/tk02-6-tailwind-build
- **História de Usuário**: US02 (Manter a carteira pela aplicação)
- **Requisitos Atendidos**: RNF05

## 1. Contexto e Objetivos

Configurar compilação do Tailwind CSS via Vite no front-end substituindo Play CDN por build local.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/vite.config.js` | Criar | Configuração do Vite e compilação CSS |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Build CSS**:
   - Configurar Vite com pipeline de build para CSS otimizado.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA02.6 - Build de Estilos
  Dado o projeto front configurado
  Quando npm run build é executado
  Então os estilos CSS compilados devem ser gerados em dist/
```

## 5. Plano de Verificação

- **Build Front**: Executar npm run build no front.
