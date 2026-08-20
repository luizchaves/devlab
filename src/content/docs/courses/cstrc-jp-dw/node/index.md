---
title: "Node.js: Fundamentos"
description: O runtime que executa JavaScript fora do navegador.
course: cstrc-jp-dw
sidebar:
  label: Fundamentos
  order: 1
---

Node.js é um runtime que executa JavaScript fora do navegador. Em vez de DOM e
`window`, ele oferece acesso ao sistema de arquivos, à rede e ao processo do sistema
operacional — é o que nos permite escrever um servidor HTTP.

## Verificando a instalação

```bash
node --version
```

Use a versão 22 ou superior. Para gerenciar várias versões, o
[fnm](https://github.com/Schniz/fnm) ou o [nvm](https://github.com/nvm-sh/nvm)
resolvem bem.

## Executando um arquivo

```js title="hello.js"
console.log('Olá do Node.js!');
```

```bash
node hello.js
```

## Modo watch

O Node reinicia o processo sozinho quando um arquivo muda — não é preciso instalar
`nodemon`:

```bash
node --watch src/server.js
```

É exatamente isso que o script `dev` dos projetos da disciplina faz.

## Módulos internos

Alguns módulos vêm com o runtime. O prefixo `node:` deixa explícito que a importação
não é de um pacote do npm:

```js title="internos.js" showLineNumbers {1-3}
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';

const conteudo = await readFile(path.join('dados', 'entrada.txt'), 'utf-8');
```

## Um servidor HTTP sem frameworks

Antes de usar Express, vale ver o que ele resolve. Este é o mínimo em Node puro:

```js title="servidor-puro.js" showLineNumbers {5-6}
import http from 'node:http';

const servidor = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello World' }));
    return;
  }

  res.writeHead(404).end();
});

servidor.listen(3000);
```

Repare que rotas, parsing de JSON e status precisam ser tratados na mão. O
[Express](../express/) existe para eliminar essa repetição.

## Variáveis de ambiente

Configurações que mudam entre máquinas (porta, URL do banco) vêm do ambiente:

```js title="env.js"
const port = process.env.PORT ?? 3000;
```

```bash
PORT=4000 node src/server.js
```

## Exercício

Escreva um script que leia um arquivo `usuarios.json`, filtre os maiores de 18 anos e
grave o resultado em `adultos.json`, usando `node:fs/promises`.

## Próxima aula

[npm](npm/) — instalando e gerenciando dependências.
