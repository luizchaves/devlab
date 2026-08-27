---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Python: Ambiente e Pacotes com uv"
description: "Slides da aula de ambiente e dependências em Python com uv: isolamento, pyproject.toml, uv.lock, execução de scripts e equivalências com venv e pip."


---



<!-- _class: lead -->

# Python: Ambiente e Pacotes com uv

Ambientes isolados, dependências reproduzíveis, `pyproject.toml`, `uv.lock` e execução de scripts.



---



## Objetivo

Preparar o projeto para crescer com dependências externas:

- Explicar por que cada projeto precisa de **ambiente isolado**.
- Instalar o **uv** e um interpretador.
- Inicializar um projeto com **`pyproject.toml`**.
- Adicionar, remover e travar dependências com **`uv.lock`**.
- Mapear cada comando para o equivalente em `venv` e `pip`.



---



## Por Que Isolar

```txt
Sem isolamento:                Com isolamento:

Projeto A ─┐                   Projeto A ──▶ .venv (httpx 0.27)
           ├─▶ Python global
Projeto B ─┘                   Projeto B ──▶ .venv (httpx 0.24)
     │
     ▼
  conflito de versão
```

*Em Linux e macOS, instalar no Python do sistema pode quebrar ferramentas do próprio sistema.*



---



## Instalando o uv

```bash
# macOS e Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

uv python install 3.14
uv python pin 3.14
```

- Não exige Python previamente instalado.
- Gerencia versões do interpretador sem instalador separado.



---

## Criando o Projeto (Parte 1)

```bash
uv init guia-python
cd guia-python
```

---

## Criando o Projeto (Parte 2)

```txt
guia-python/
├── .python-version
├── README.md
├── main.py
└── pyproject.toml
```

*O `.venv/` é criado sozinho no primeiro `uv run` ou `uv add` — e não vai para o Git.*

---

## `pyproject.toml` (Parte 1)

```toml
[project]
name = "guia-python"
version = "0.1.0"
requires-python = ">=3.14"
dependencies = [
    "httpx>=0.28.1",
]

```

---

## `pyproject.toml` (Parte 2)

```toml
[dependency-groups]
dev = ["pytest>=8.4.2", "ruff>=0.14.0"]
```

*Arquivo padrão de configuração de projetos Python (PEP 621); substitui o `setup.py`.*

---



## Comandos de Dependência

| Comando | Efeito |
| --- | --- |
| `uv add httpx` | Adiciona e instala |
| `uv add "httpx>=0.27,<1.0"` | Com restrição de versão |
| `uv add --dev pytest ruff` | Grupo de desenvolvimento |
| `uv remove httpx` | Remove |
| `uv sync` | Instala o que está no lock |
| `uv lock --upgrade` | Recalcula versões |
| `uv tree` | Árvore de dependências |



---



## O Arquivo de Trava

| Arquivo | Papel | Vai para o Git? |
| --- | --- | --- |
| `pyproject.toml` | O que o projeto **pede** | Sim |
| `uv.lock` | O que foi **resolvido** | Sim |
| `.python-version` | Versão do interpretador | Sim |
| `.venv/` | Onde os pacotes ficam | **Não** |

```bash
uv sync --frozen     # instala exatamente o lock (CI e deploy)
```



---



## Executando

```bash
uv run main.py
uv run python -c "import httpx; print(httpx.__version__)"
uv run pytest -q
uv run ruff check .

uvx ruff format .    # ferramenta em ambiente temporário
```

*Não é preciso "ativar" nada: `uv run` sincroniza o ambiente antes de executar.*



---



## Script com Dependências (PEP 723)

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx"]
# ///
import httpx

print(httpx.get("https://api.github.com").status_code)
```

```bash
uv run fetch.py     # cria ambiente temporário com httpx
```



---



## Equivalências

| Tarefa | uv | venv + pip |
| --- | --- | --- |
| Criar ambiente | automático | `python3 -m venv .venv` |
| Ativar | desnecessário | `source .venv/bin/activate` |
| Instalar | `uv add httpx` | `pip install httpx` |
| Congelar | `uv.lock` | `pip freeze > requirements.txt` |
| Reinstalar | `uv sync` | `pip install -r requirements.txt` |
| Executar | `uv run main.py` | `python main.py` |



---



## Migrando um Projeto

```bash
uv init --bare
uv add -r requirements.txt
uv lock
```

*`pip freeze` não é lock de verdade: não separa dependências diretas das indiretas nem guarda hashes.*



---



## Exercício

Prepare o projeto `cotacao/`:

1. `uv init` e `uv python pin 3.14`;
2. `uv add httpx` e `uv add --dev ruff`;
3. `main.py` consultando uma API pública de câmbio;
4. Trate erros de rede e status HTTP;
5. Rode `uv run ruff check .` e corrija o que for apontado.



---

## Solução do Exercício (Parte 1)

```python
import httpx

def fetch_quote():
    try:
        response = httpx.get(URL, timeout=10)
```

---

## Solução do Exercício (Parte 2)

```python
        response.raise_for_status()
    except httpx.HTTPStatusError as error:
        raise SystemExit(f"API respondeu {error.response.status_code}") from error
    except httpx.RequestError as error:
        raise SystemExit(f"falha de rede: {error}") from error
    return response.json()["USDBRL"]
```

---


## Solução do Exercício (Parte 2)

```bash
uv run main.py
```


---


## Resumo da Aula (Parte 1)

- Cada projeto precisa do **próprio ambiente**: nunca instale no Python do sistema.
- `uv` instala interpretador, cria ambiente, resolve dependências e executa scripts.
- `pyproject.toml` declara o que o projeto pede; `uv.lock` grava o que foi resolvido.


---


## Resumo da Aula (Parte 2)

- Versione `pyproject.toml`, `uv.lock` e `.python-version`; ignore `.venv/`.
- `uv run` dispensa ativação; `uvx` executa ferramentas em ambiente temporário.
- `uv sync --frozen` é o comando de CI e de produção.