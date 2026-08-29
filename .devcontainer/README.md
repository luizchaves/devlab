# `.devcontainer/`

Cada subpasta descreve **um projeto** de `examples/` para o GitHub Codespaces.
O botão "Abrir no Codespaces" das páginas de projeto aponta para o
`devcontainer.json` correspondente:

```
https://codespaces.new/<owner>/<repo>?devcontainer_path=.devcontainer/<pasta>/devcontainer.json
```

Ao criar um projeto novo em `examples/`, copie a pasta mais próxima e ajuste:

| Campo               | O que muda                                                 |
| ------------------- | ---------------------------------------------------------- |
| `name`              | nome exibido na criação do Codespace                        |
| `workspaceFolder`   | `/workspaces/devlab/<caminho do projeto>`                   |
| `postCreateCommand` | instalação de dependências e preparo (`.env`, banco, seed)   |
| `postAttachCommand` | o comando que sobe o servidor                                |
| `customizations`    | arquivo aberto ao entrar e extensões úteis ao projeto        |

Depois, use `<ProjectLinks devcontainer="<pasta>" />` na página da aula.
