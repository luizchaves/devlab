# Spec TK01.1: Estrutura Inicial, Governança e Automação de Specs

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.1
- **Branch**: feat/tk01-1-initial-structure
- **História de Usuário**: US01 (Conhecer o sistema antes de usá-lo)
- **Requisitos Atendidos**: RNF01, RNF05, RNF06

## 1. Contexto e Objetivos

Estabelecer a fundação do MonitorApp com arquitetura de duas origens (front/ e back/), governança (docs/PRD.md, AGENTS.md, README.md, biome.json, specs/) e tela inicial front/index.html.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `front/index.html` | Criar | Painel de monitoramento com métricas e formulário |
| `front/package.json` | Criar | Manifesto do front com Vite e scripts |
| `docs/PRD.md` | Criar | Documento de requisitos de produto |
| `AGENTS.md` | Criar | Diretrizes de governança técnica |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Automação e Qualidade**:
   - Configurar package.json no front com Vite e Biome.
   - Criar biome.json com regras de estilo.

2. **Fase 2 · Governança e HTML Inicial**:
   - Criar documentos de governança e skills.
   - Construir index.html com cartões estáticos de host.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.1 - Execução do Front em Dev
  Dado que o front foi configurado com Vite
  Quando o comando npm run dev é executado
  Então as telas estáticas devem ser servidas no navegador sem necessidade da API
```

## 5. Plano de Verificação

- **Checagem Estática**: Executar pnpm check e pnpm lint.
