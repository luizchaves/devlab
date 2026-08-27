---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Python: venv e pip"
description: "Slides da aula de ambientes virtuais com venv e pip: estrutura do .venv, ativação por sistema, instalação de pacotes, requirements.txt e problemas comuns."

---


<!-- _class: lead -->

# Python: venv e pip

O que existe dentro de um ambiente virtual, como ativar, instalar pacotes e diagnosticar problemas.


---


## Objetivo

Entender o mecanismo que o uv automatiza:

- Explicar o que um ambiente virtual **é** — e o que ele não é.
- Criar ambientes com `python3 -m venv` e ativar em cada sistema.
- Instalar e remover pacotes com `pip`.
- Gerar e consumir `requirements.txt`.
- Diagnosticar os erros mais frequentes de ambiente.


---


## Por Que Esta Aula

- O `venv` está na **biblioteca padrão** desde o Python 3.3.
- Praticamente toda documentação de biblioteca mostra `pip install`.
- Projetos legados chegam com `requirements.txt`, não com `uv.lock`.
- Saber o que acontece por baixo é o que permite **depurar** o ambiente.

*Para projetos novos, o [uv](../uv/) continua sendo o caminho recomendado.*


---


## O Que É um Ambiente Virtual

```txt
.venv/
├── bin/                      (Scripts/ no Windows)
│   ├── activate
│   ├── pip
│   └── python -> /usr/local/bin/python3.14
├── lib/python3.14/site-packages/    pacotes instalados aqui
└── pyvenv.cfg                       aponta para o Python base
```

- Um **diretório**, não um registro global.
- `pyvenv.cfg` é o que diferencia de uma pasta comum.


---


## Não É Portável

```txt
home = /usr/local/bin
include-system-site-packages = false
version = 3.14.0
executable = /usr/local/bin/python3.14
```

- Os caminhos internos são **absolutos**.
- Copiar `.venv/` para outra máquina não funciona.
- O ambiente é sempre **recriado** a partir da lista de dependências.


---


## Criando

```bash
python3 -m venv .venv
python3 -m venv --prompt guia-python --upgrade-deps .venv
```

| Opção | Efeito |
| --- | --- |
| `--prompt nome` | Rótulo no prompt do shell |
| `--system-site-packages` | Enxerga os pacotes do sistema |
| `--upgrade-deps` | Já cria com pip atualizado |
| `--clear` | Apaga antes de recriar |

*`.venv` é a convenção que editores e ferramentas procuram.*


---


## Ativando

```bash
# macOS e Linux
source .venv/bin/activate

# Windows (PowerShell)
.venv\Scripts\Activate.ps1

# Windows (cmd)
.venv\Scripts\activate.bat

deactivate
```

*No Debian/Ubuntu, `ensurepip is not available` significa instalar `python3-venv`.*


---


## O Que a Ativação Faz

```txt
Sem ativação:   python  ──▶  PATH: /usr/local/bin  ──▶  Python do sistema

Com ativação:   python  ──▶  PATH: .venv/bin       ──▶  Python do projeto
```

- Coloca `.venv/bin` na frente do `PATH`.
- Define `VIRTUAL_ENV` e altera o prompt.
- Vale **só na sessão atual** do terminal.


---


## Dispensando a Ativação

```bash
.venv/bin/python main.py
.venv/bin/python -m pip install httpx
```

- Como o efeito é apenas o `PATH`, chamar pelo caminho tem o mesmo resultado.
- Forma preferida em scripts, `Makefile`, contêineres e CI.


---


## Instalando com pip

| Comando | Efeito |
| --- | --- |
| `pip install httpx` | Versão mais recente compatível |
| `pip install "httpx>=0.27,<1.0"` | Faixa de versões |
| `pip install httpx==0.28.1` | Versão exata |
| `pip install -U httpx` | Atualiza |
| `pip uninstall httpx` | Remove |
| `pip list` / `pip show httpx` | Lista / detalha |

```bash
python -m pip install --upgrade pip
```


---


## `python -m pip`, Sempre

```bash
python -m pip install httpx     # usa o interpretador atual
pip install httpx               # depende do PATH
```

- Elimina a dúvida sobre **qual** pip está sendo executado.
- Resolve a maior parte dos casos de "instalei mas o import não encontra".
- É a forma recomendada pela documentação do pip.


---

## requirements.txt (Parte 1)

```txt
httpx>=0.28,<1.0
rich>=14.0
python-dotenv
```

---

## requirements.txt (Parte 2)

```txt
# requirements-dev.txt
-r requirements.txt
pytest>=8.0
ruff>=0.14
```

```bash
python -m pip install -r requirements.txt
```

---


## `pip freeze` Não É um Lock

```bash
python -m pip freeze > requirements.lock.txt
```

- Despeja **tudo** o que está instalado.
- Não separa dependências diretas das indiretas.
- Não guarda hashes de verificação.
- Por isso existem `uv.lock`, `pip-tools` e `poetry.lock`.


---


## Instalação Editável

```bash
python -m pip install -e .
python -m pip install -e ".[dev]"
```

- Instala o **próprio projeto** apontando para o código-fonte.
- Cada alteração vale imediatamente, sem reinstalar.
- É o que permite `from meu_pacote import x` dentro de `tests/`.


---


## Problemas Frequentes

| Sintoma | Solução |
| --- | --- |
| `externally-managed-environment` | Crie e ative o `.venv` |
| `ModuleNotFoundError` após instalar | Use `python -m pip install` |
| `command not found` após instalar CLI | Ative, ou chame `.venv/bin/ferramenta` |
| `ensurepip is not available` | `sudo apt install python3-venv` |
| Editor não reconhece o pacote | Aponte para `.venv/bin/python` |


---


## O Diagnóstico Universal

```bash
python -c "import sys; print(sys.prefix); print(sys.executable)"
python -m pip --version
```

- A primeira linha mostra **qual ambiente** está em uso.
- A segunda confirma a **qual interpretador** aquele pip pertence.
- Caminhos que não batem = a causa do problema.

*Se um `pip install` pede `sudo`, o ambiente virtual está faltando.*


---


## Equivalências com uv

| Tarefa | venv + pip | uv |
| --- | --- | --- |
| Criar ambiente | `python3 -m venv .venv` | automático |
| Ativar | `source .venv/bin/activate` | desnecessário |
| Instalar | `pip install httpx` | `uv add httpx` |
| Travar | `pip freeze` (parcial) | `uv.lock` (completo) |
| Restaurar | `pip install -r requirements.txt` | `uv sync` |
| Executar | ativar e `python main.py` | `uv run main.py` |


---


## Exercício

Prepare `notas-venv/` sem usar uv em nenhuma etapa:

1. Crie o ambiente com `--prompt notas` e ative;
2. Instale `rich` e escreva o `requirements.txt` à mão, com faixa de versão;
3. Escreva um `main.py` que imprima uma tabela colorida;
4. Ignore `.venv/` e `__pycache__/` no `.gitignore`;
5. Apague o `.venv/` e recrie apenas a partir do `requirements.txt`.


---

## Solução do Exercício (Parte 1)

```bash
python3 -m venv .venv --prompt notas
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install rich

```

---

## Solução do Exercício (Parte 2)

```bash
# depois de escrever requirements.txt à mão
deactivate
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -c "import sys; print(sys.prefix)"
```

---

## Resumo da Aula (Parte 1)

- Um ambiente virtual é um **diretório** com interpretador, `site-packages/` e `pyvenv.cfg`.
- Ele **não é portável**: recrie a partir da lista de dependências.
- Ativar apenas altera `PATH`, `VIRTUAL_ENV` e o prompt — e vale só naquele terminal.

---

## Resumo da Aula (Parte 2)

- `.venv/bin/python` funciona sem ativação, e é o indicado em scripts e CI.
- Use `python -m pip` para garantir o interpretador certo.
- `pip freeze` congela um estado; não descreve o projeto nem substitui um lock.