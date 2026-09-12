---
name: task-pr-finalizer
description: >-
  Finaliza uma task técnica, valida qualidade (check/build/test), arquiva a spec
  de specs/active/ para specs/archived/, realiza commit atômico e cria um Pull Request
  completo e detalhado para a branch main via GitHub CLI (gh pr create) com base no PRD e na spec.
---

# Finalizador de Tasks e Gerador de Pull Request (Task PR Finalizer)

Esta skill orienta assistentes e agentes de IA a concluírem uma tarefa técnica no fluxo Spec-Driven Development, realizando a validação de qualidade, verificação de build, arquivamento da especificação técnica, commit atômico, push da branch e criação de um **Pull Request rico e exaustivo** para integração na branch `main`.

---

## Fluxo de Execução

1. **Identificar a Task e a Branch**:
   - Confirmar a branch Git atual (`git branch --show-current`). A branch deve seguir o padrão `feat/<task-id-kebab>-<nome-kebab>` (ou `fix/`, `refactor/`, etc.).
   - Localizar o arquivo de especificação ativo correspondente em `specs/active/spec-<task-id>-*.md`.

2. **Executar a Suíte de Qualidade e Homologação**:
   - Executar os comandos de validação estática, checagem de tipos, integridade de build e testes do projeto:
     ```bash
     pnpm check       # checagem estática e de tipos sem inconformidades
     pnpm build       # compilação da aplicação (não deve apresentar nenhum erro de build)
     pnpm format      # formatação de código com o Biome
     pnpm test        # suíte de testes automatizados (quando aplicável)
     ```
   - Garantir **0 erros de build**, **0 erros de checagem** e **0 warnings impeditivos** antes de avançar.

3. **Arquivar a Especificação Técnica**:
   - Atualizar os metadados da spec em `specs/active/spec-<task-id>-*.md`:
     - Alterar `- **Status**: Ativa` para `- **Status**: Concluída`.
     - Adicionar `- **Data de Homologação**: AAAA-MM-DD`.
   - Mover o arquivo para `specs/archived/`:
     ```bash
     git mv specs/active/spec-<task-id>-<nome-kebab>.md specs/archived/
     ```

4. **Realizar o Commit Atômico**:
   - Adicionar os arquivos modificados e criar o commit no padrão **Conventional Commits** em inglês com a tag da task:
     ```bash
     git add .
     git commit -m "<tipo>: [<TASK-ID>] <descrição imperativa e concisa em inglês>"
     # Exemplo: git commit -m "feat: [TK01.1] setup project governance, biome quality scripts and spec skill"
     ```

5. **Enviar a Branch para o Repositório Remoto**:
   - Realizar o push da branch:
     ```bash
     git push -u origin <branch-name>
     ```

6. **Gerar e Criar o Pull Request Rico**:
   - Extrair as informações do `docs/PRD.md` e da spec arquivada (`specs/archived/spec-<task-id>-*.md`).
   - Montar a descrição do PR seguindo o **Template Padrão de Pull Request** abaixo, preenchendo todos os campos, checklists e evidências.
   - Criar o Pull Request utilizando a GitHub CLI (`gh`):
     ```bash
     gh pr create --base main --head <branch-name> --title "<tipo>: [<TASK-ID>] <título em inglês>" --body "<corpo-formatado-do-pr>"
     ```
   - Caso a CLI `gh` não esteja autenticada no ambiente, exibir a mensagem e salvar o corpo formatado em um arquivo de rascunho de PR ou apresentar o markdown diretamente para o usuário abrir via interface web.

---

## Template Padrão de Pull Request

```markdown
## 📌 Resumo da Mudança

| Item | Detalhe |
| ---- | ------- |
| **Task ID** | `<TASK-ID>` (ex: `TK01.1`) |
| **Branch** | `<branch-name>` |
| **História de Usuário** | `<USXX>` — <Título da US> |
| **Épico / Feature** | `<EPXX>` · <Nome do Épico> / `<FTXX>` · <Nome da Feature> |
| **Spec Técnica** | [`specs/archived/spec-<task-id>-<nome>.md`](file:///specs/archived/spec-<task-id>-<nome>.md) |

---

### 🎯 Objetivo e Contexto
<Descrição detalhada do problema resolvido, da motivação técnica e do impacto da alteração na aplicação.>

---

## 📋 Requisitos Atendidos (RF / RNF)

- **Requisitos Funcionais**:
  - `RFXX`: <Descrição sucinta do RF atendido>
- **Requisitos Não-Funcionais**:
  - `RNFXX`: <Descrição sucinta do RNF atendido (ex: tipagem estrita, isolamento, performance)>

---

## 🔄 Alterações Realizadas (Changes)

### Resumo das Mudanças
- <Resumo em tópicos do que foi adicionado ou refatorado>
- <Principais decisões arquiteturais e arquivos criados>

### Arquivos Modificados
| Arquivo | Ação | Responsabilidade / Mudança Principal |
| ------- | ---- | ------------------------------------- |
| `src/...` | Criado / Modificado | <Descrição sucinta da responsabilidade> |
| `specs/archived/...` | Movido | Especificação técnica homologada e arquivada |

---

## ✅ Critérios de Aceitação Homologados (BDD)

- [x] **CAXX.Y · <Título do Cenário>**
  \`\`\`gherkin
  Dado <condição inicial>
  Quando <ação executada>
  Então <resultado verificado>
  \`\`\`

---

## 🧪 Como Testar (How to Test)

### 1. Comandos de Validação e Qualidade
\`\`\`bash
# 1. Checagem estática e de tipos
pnpm check

# 2. Compilação e build da aplicação (sem erros de build)
pnpm build

# 3. Testes automatizados (quando aplicável)
pnpm test
\`\`\`

### 2. Roteiro de Teste Manual / Funcional
1. Iniciar o ambiente: `pnpm dev`
2. <Passo a passo: chamada via requests.http / curl, formulário a testar ou tela a navegar>
3. <Comportamento esperado a verificar>

---

## 📸 Screenshots & Evidências de Execução

### Front-end / UI (Screenshots)
<!-- Insira aqui capturas de tela ou GIFs demonstrando a interface / componentes renderizados -->
<!-- ![Screenshot da tela](url_ou_caminho_da_imagem) -->
> *N/A se a alteração for puramente backend.*

### Back-end / API (Logs & Chamadas HTTP)
\`\`\`text
<Cole aqui o log da execução, saída dos testes ou resposta HTTP das requisições>
\`\`\`

---

## 📋 Checklist de Engenharia e Governança

- [x] A branch segue o padrão `feat/<task-id>-*` (ou `fix/`, `chore/`).
- [x] A especificação técnica foi movida de `specs/active/` para `specs/archived/`.
- [x] O commit segue a convenção Conventional Commits em inglês com tag de task (`feat: [TKXX.Y] ...`).
- [x] O build e a compilação passaram sem nenhum erro (`0 errors`).
- [x] Nenhuma dependência externa não autorizada foi adicionada ao `package.json`.
- [x] Todas as regras invioláveis de arquitetura descritas em `AGENTS.md` foram respeitadas.
```
