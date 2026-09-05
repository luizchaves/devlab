---
title: 'Python: venv e pip'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: venv e pip

## Ideia Central

- Ambiente virtual é um **diretório** com interpretador e `site-packages/` próprios
- É o mecanismo da biblioteca padrão que o **uv** automatiza

## O Que Existe no .venv?

- **`bin/`** (`Scripts/` no Windows): `python`, `pip` e scripts de ativação
- **`lib/pythonX.Y/site-packages/`**: onde os pacotes são instalados
- **`pyvenv.cfg`**: aponta para o interpretador base e define a versão
- Caminhos **absolutos**: copiar a pasta para outra máquina não funciona

## Criando

- `python3 -m venv .venv` é a forma padrão
- `--prompt nome` muda o rótulo no shell
- `--upgrade-deps` já cria com pip atualizado
- `--system-site-packages` enxerga os pacotes do sistema
- Debian/Ubuntu: `ensurepip is not available` pede `sudo apt install python3-venv`

## Ativação

### Por sistema
- macOS e Linux: `source .venv/bin/activate`
- PowerShell: `.venv\Scripts\Activate.ps1`
- cmd: `.venv\Scripts\activate.bat`
- `deactivate` encerra

### O que ela faz?
- Coloca `.venv/bin` na frente do `PATH`
- Define `VIRTUAL_ENV` e altera o prompt
- Vale apenas na sessão atual do terminal
- Dispensável: `.venv/bin/python main.py` tem o mesmo efeito

## pip

- `pip install pacote`, com `==`, `>=` e faixas de versão
- `pip uninstall`, `pip list`, `pip show`, `pip list --outdated`
- `python -m pip` garante o interpretador correto
- `pip install -e .` instala o próprio projeto em modo editável

## requirements.txt

- Declara as dependências **diretas**, normalmente com faixas
- `-r requirements.txt` encadeia arquivos (ex.: `requirements-dev.txt`)
- `pip install -r requirements.txt` restaura o ambiente
- `pip freeze` **não** é lock: sem separação de diretas/indiretas e sem hashes

## Problemas Frequentes

- `externally-managed-environment`: faltou criar e ativar o ambiente
- `ModuleNotFoundError` após instalar: pip e python de ambientes diferentes
- `command not found`: ambiente não ativado
- Editor não reconhece o pacote: interpretador errado selecionado
- Diagnóstico: `sys.prefix`, `sys.executable` e `python -m pip --version`

## Comparação com uv

- Criar e ativar: manual no venv, automático no uv
- Travar versões: `pip freeze` parcial x `uv.lock` completo
- Restaurar: `pip install -r` x `uv sync`
- Instalar o Python: fora do escopo do venv, nativo no uv

## Boas Práticas

- **Nunca use `sudo pip install`**: sinal de que falta o ambiente virtual
- **Sempre `python -m pip`** em vez de `pip` solto
- **Ignore `.venv/`** no Git e versione a lista de dependências
- **Prefira uv em projetos novos**; venv e pip para legado e ambientes restritos
