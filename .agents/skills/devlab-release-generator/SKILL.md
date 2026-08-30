---
name: devlab-release-generator
description: >-
  Gera uma nova versão do software DevLab (SemVer X.Y.Z), atualiza package.json,
  docs/PRD.md, constrói/atualiza o CHANGELOG.md categorizado via Conventional Commits,
  valida a aplicação e cria a tag git e commit vX.Y.Z.
---

# DevLab — Gerador de Releases e Versionamento (SemVer)

Esta skill orienta o processo de lançamento de novas versões do **DevLab**, garantindo integridade de build, notas de lançamento categorizadas no `CHANGELOG.md`, atualização de versão nos arquivos do projeto e criação de tags Git anotadas.

---

## 📋 Pré-requisitos e Fluxo de Execução

Ao receber um pedido de release (ex: "gere a versão 0.0.1" ou "crie a release 1.0.0"):

### 1. Validação da Versão (SemVer)
- Verifique se a versão fornecida segue o formato SemVer `X.Y.Z` (ex: `0.0.1`, `0.1.0`, `1.0.0`).
- Se nenhuma versão for especificada, inspecione a versão atual em `package.json` e sugira a próxima (`patch`, `minor` ou `major`).

### 2. Validação da Aplicação (Pre-release Build Check)
Antes de modificar qualquer versão ou criar tags, valide se o repositório está em estado saudável executando:

```bash
pnpm validate
```

*Se houver falha no build, lint ou links quebrados, interrompa a release e resolva os erros antes de prosseguir.*

---

## 🛠️ Passo a Passo do Release

### Passo 1: Atualizar Arquivos de Versão
Atualize o número da versão nos seguintes arquivos do repositório:

1. **`package.json`**:
   ```json
   "version": "X.Y.Z"
   ```
2. **`docs/PRD.md`**:
   ```markdown
   | Versão        | X.Y.Z                                   |
   ```

---

### Passo 2: Gerar/Atualizar o `CHANGELOG.md`

Inspecione os commits anteriores (utilizando `git log`) desde a última tag Git. Se não houver tags anteriores (primeira release), utilize o histórico de commits.

Analise os commits segundo a convenção de **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`, `test:`) e organize a seção da versão no arquivo `CHANGELOG.md` no topo (abaixo do título `# Changelog`):

```markdown
# Changelog

All notable changes to the DevLab project will be documented in this file.

## [X.Y.Z] - YYYY-MM-DD

### 🚀 Features
- Descrição da nova funcionalidade

### 🐛 Bug Fixes
- Descrição do ajuste ou correção

### 📚 Documentation
- Atualizações de documentação, guias e especificações

### 🛠️ Refactoring & Maintenance
- Melhorias internas, lint, scripts e testes
```

---

### Passo 3: Commit e Tag Git

1. Adicione os arquivos alterados ao Git:
   ```bash
   rtk git add package.json docs/PRD.md CHANGELOG.md
   ```

2. Crie o commit atômico de release em inglês:
   ```bash
   rtk git commit -m "chore(release): vX.Y.Z"
   ```

3. Crie a tag Git anotada:
   ```bash
   rtk git tag -a vX.Y.Z -m "Release vX.Y.Z"
   ```

---

## 🔍 Pós-Release e Verificação

Após criar a tag:
1. Verifique se a tag foi criada com sucesso:
   ```bash
   rtk git tag -l
   ```
2. Confirme o estado limpo do repositório:
   ```bash
   rtk git status
   ```
