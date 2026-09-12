## 📌 Resumo da Mudança

| Item | Detalhe |
| ---- | ------- |
| **Task ID** | <!-- Ex: TK01.1 --> |
| **Branch** | <!-- Ex: feat/tk01-1-initial-structure --> |
| **História de Usuário** | <!-- Ex: US01 — Conhecer o sistema antes de usá-lo --> |
| **Épico / Feature** | <!-- Ex: EP01 / FT01 --> |
| **Spec Técnica** | <!-- Link para specs/archived/spec-*.md --> |

---

### 🎯 Objetivo e Contexto
<!-- Explicação concisa do objetivo desta task, o problema que resolve e o impacto na aplicação. -->

---

## 📋 Requisitos Atendidos (RF / RNF)

- **Requisitos Funcionais**:
  - `RFXX`: <!-- Descrição sucinta do RF atendido -->
- **Requisitos Não-Funcionais**:
  - `RNFXX`: <!-- Descrição sucinta do RNF atendido (validação, segurança, tipagem, modularidade) -->

---

## 🔄 Alterações Realizadas (Changes)

### Resumo das Mudanças
- <!-- O que foi adicionado, alterado ou refatorado -->
- <!-- Principais decisões arquiteturais (front e/ou back) e arquivos criados -->

### Arquivos Modificados
| Arquivo | Ação | Responsabilidade / Mudança Principal |
| ------- | ---- | ------------------------------------- |
| `front/...` / `back/...` | Criado / Modificado | <!-- Descrição do papel do arquivo --> |
| `specs/archived/...` | Movido | Especificação técnica homologada e arquivada |

---

## ✅ Critérios de Aceitação Homologados (BDD)

- [ ] **CAXX.Y · <!-- Título do Cenário -->**
  ```gherkin
  Dado <!-- condição inicial -->
  Quando <!-- ação executada -->
  Então <!-- resultado verificado -->
  ```

---

## 🧪 Como Testar (How to Test)

### 1. Comandos de Validação e Qualidade
```bash
# 1. Checagem estática e de tipos
pnpm check

# 2. Compilação e build da aplicação (sem erros de build)
pnpm build

# 3. Testes automatizados (quando aplicável)
pnpm test
```

### 2. Roteiro de Teste Manual / Funcional
1. Iniciar o ambiente: `pnpm dev`
2. <!-- Passo a passo: tela a navegar no front ou rota a disparar na API -->
3. <!-- Comportamento esperado a verificar -->

---

## 📸 Screenshots & Evidências de Execução

### Front-end / UI (Screenshots)
<!-- Insira aqui capturas de tela ou GIFs demonstrando a interface / componentes renderizados -->
<!-- ![Screenshot da tela](url_ou_caminho_da_imagem) -->

### Back-end / API (Logs & Chamadas HTTP)
```text
<!-- Cole aqui o log da execução, saída dos testes ou resposta HTTP das requisições -->
```

---

## 📋 Checklist de Engenharia e Governança

- [ ] A branch segue o padrão `feat/<task-id>-*` (ou `fix/`, `chore/`).
- [ ] A especificação técnica foi movida de `specs/active/` para `specs/archived/`.
- [ ] O commit segue a convenção Conventional Commits em inglês com tag de task (`feat: [TKXX.Y] ...`).
- [ ] O build e a compilação passaram sem nenhum erro (`0 errors`).
- [ ] Nenhuma dependência externa não autorizada foi adicionada ao `package.json`.
- [ ] Todas as regras invioláveis de arquitetura descritas em `AGENTS.md` foram respeitadas.
