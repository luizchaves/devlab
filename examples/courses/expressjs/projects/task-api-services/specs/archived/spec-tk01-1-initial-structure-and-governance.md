# Spec TK01.1: Estrutura Inicial, Governança e Automação de Specs

- **Status**: Concluída
- **Data**: 2026-09-12
- **Data de Homologação**: 2026-09-12
- **Task**: TK01.1
- **Branch**: feat/tk01-1-initial-structure
- **História de Usuário**: US01 (Criar e consultar tarefas por HTTP)
- **Requisitos Atendidos**: RNF01, RNF05, RNF06

## 1. Contexto e Objetivos

Estabelecer o manifesto package.json com tipo módulo ("type": "module"), scripts de qualidade e governança técnica (docs/PRD.md, AGENTS.md, README.md, biome.json, specs/).

## 2. Arquivos Afetados

| Arquivo | Ação | Responsabilidade |
| ------- | ---- | ---------------- |
| `package.json` | Criar / Modificar | Manifesto de dependências e scripts |
| `biome.json` | Criar | Configuração de lint e formatação |
| `docs/PRD.md` | Criar | Documento de requisitos de produto e engenharia |
| `AGENTS.md` | Criar | Diretrizes de governança para desenvolvimento |

## 3. Plano de Implementação por Fases

1. **Fase 1 · Automação e Qualidade**:
   - Configurar package.json com scripts dev, start, lint, format e lint:fix.
   - Configurar biome.json com regras de estilo e linting.

2. **Fase 2 · Governança**:
   - Criar documentos de governança, skills em .agents/skills/ e diretórios specs/.

## 4. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: CA01.7 - Governança e Qualidade
  Dado que a raiz do projeto é inicializada
  Quando os arquivos de configuração são lidos
  Então docs/PRD.md, AGENTS.md, README.md e biome.json devem existir
```

## 5. Plano de Verificação

- **Checagem Estática**: Executar pnpm check com 0 erros.
- **Build e Lint**: Executar pnpm lint com 0 violações.
