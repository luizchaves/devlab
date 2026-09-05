---
title: 'Python: Ambiente e Pacotes com uv'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Ambiente e Pacotes com uv

## Ideia Central

- Cada projeto precisa do **próprio ambiente isolado**
- `uv` instala interpretador, cria ambiente, resolve dependências e executa scripts

## Por Que Isolar?

- Projetos diferentes pedem versões diferentes das mesmas bibliotecas
- O Python do sistema é usado por ferramentas do sistema operacional
- Distribuições recentes bloqueiam a instalação global (`externally-managed-environment`)
- O ambiente `.venv/` nunca é versionado

## Instalação

- macOS e Linux: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Windows: `irm https://astral.sh/uv/install.ps1 | iex`
- `uv python install 3.14` instala o interpretador
- `uv python pin 3.14` fixa a versão do projeto

## Criando o Projeto

- `uv init nome` gera `pyproject.toml`, `README.md` e `.python-version`
- `uv init --package` cria o layout `src/`
- `uv init --bare` para migrar projeto existente
- O `.venv/` aparece no primeiro `uv run` ou `uv add`

## Dependências

### Comandos
- `uv add httpx` adiciona e instala
- `uv add --dev pytest ruff` para o grupo de desenvolvimento
- `uv remove httpx` remove
- `uv sync` instala o que está no lock
- `uv lock --upgrade` recalcula versões
- `uv tree` mostra a árvore

### Arquivos
- `pyproject.toml`: o que o projeto **pede** (PEP 621)
- `uv.lock`: o que foi **resolvido**, com hashes
- `.python-version`: versão do interpretador
- `.venv/`: ambiente, fora do Git

## Executando

- `uv run main.py` sincroniza e executa
- `uv run pytest`, `uv run ruff check .`
- `uvx ferramenta` executa em ambiente temporário
- Não é preciso ativar o ambiente

## Scripts Autocontidos

- PEP 723 permite declarar dependências no topo do arquivo
- `uv run script.py` cria um ambiente temporário para ele
- Ideal para distribuir um utilitário em arquivo único

## Equivalências com venv e pip

- Criar: `uv venv` x `python3 -m venv .venv`
- Instalar: `uv add` x `pip install`
- Travar: `uv.lock` x `pip freeze > requirements.txt`
- Restaurar: `uv sync` x `pip install -r requirements.txt`
- `pip freeze` não separa dependências diretas das indiretas

## Boas Práticas

- **Versione** `pyproject.toml`, `uv.lock` e `.python-version`
- **Ignore** `.venv/` no Git
- **Use `uv sync --frozen`** em CI e produção
- **Separe dependências de desenvolvimento** com `--dev`
