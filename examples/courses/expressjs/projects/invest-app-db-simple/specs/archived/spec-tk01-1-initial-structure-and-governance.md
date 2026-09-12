# Spec TK01.1: Estrutura Inicial, Governança e Automação de Specs

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.1
- **Branch**: feat/tk01-1-initial-structure
- **História de Usuário**: US01 (Conhecer o sistema antes de usá-lo)
- **Requisitos Atendidos**: RNF01, RNF05, RNF06

## 1. Contexto e Objetivos

Estabelecer a fundação inicial do InvestApp com tela de carteira index.html, documentos de governança (docs/PRD.md, AGENTS.md, README.md, biome.json, specs/) e scripts de automação.

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `index.html` | Criar | Dashboard da carteira de investimentos com formulário e métricas |
| `package.json` | Criar | Manifesto de dependências e scripts de qualidade |
| `docs/PRD.md` | Criar | Documento de requisitos de produto |
| `AGENTS.md` | Criar | Diretrizes de governança técnica |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Automação e Qualidade**:
   - Configurar package.json com scripts dev, build, preview, lint, format e lint:fix.
   - Criar biome.json com regras de lint e formatação.

2. **Fase 2 · Governança e Estrutura Estática**:
   - Criar documentos de governança e skills em .agents/skills/.
   - Implementar index.html estático com métricas de patrimônio.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.1 - Abertura Direta sem Servidor
  Dado que o arquivo index.html foi criado
  Quando o navegador abre o arquivo diretamente
  Então a interface de carteira deve ser renderizada sem requisições de rede
```

## 5. Plano de Verificação

- **Checagem Estática**: Executar pnpm check e pnpm lint.
