---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Chamada de Sistema"
description: "Execução de comandos do sistema operacional a partir de uma rota Express: exec, execFile e spawn, injeção de comando, tempo limite, extração da saída com expressões regulares e quando usar uma biblioteca."
---

<!-- _class: lead -->

# Express.js: Chamada de Sistema

Execução de comandos do sistema operacional a partir de uma rota Express: exec, execFile e spawn, injeção de comando, tempo limite, extração da saída com expressões regulares e quando usar uma biblioteca.

---

## Objetivo

- Ao final você saberá executar comandos externos com segurança a partir de uma rota Express, escolher entre `exec`, `execFile` e `spawn`, impor tempo...

---

## Mapa da Aula

- **Objetivo**
- **O módulo `node:child_process`**
- **Injeção de comando**
- **Tempo limite e limite de saída**
- **Extraindo dados da saída**
- **Saída longa: `spawn`**
- **Quando usar uma biblioteca**
- **Exercício**

---

## Contexto da Aula

- Algumas funcionalidades não têm equivalente em JavaScript: verificar se um host responde, converter um vídeo, consultar o estado do sistema.
- Nesses casos a rota executa um programa do sistema operacional e transforma a saída em JSON.

---

## O módulo `node:child_process`

- O Node oferece três formas de criar um processo filho, com garantias diferentes:
- Um parâmetro do usuário no meio dessa string é execução remota de código no seu servidor.

---

## Injeção de comando

- O exemplo é curto e vale mais que qualquer explicação:
- O shell vê dois comandos separados por `;` e executa os dois.
- Sem shell no caminho, `;` é apenas um caractere estranho dentro do argumento.
- Validar a entrada continua sendo necessário: `execFile` protege o shell, não o programa chamado:

---

## Injeção de comando: Exemplo 1

```ts
    import { exec } from 'node:child_process';
    // req.query.host === "8.8.8.8; cat /etc/passwd"
    exec(`ping -c 3 ${req.query.host}`, (erro, saida) => {
      res.json({ saida });
    });
```

---

## Injeção de comando: Exemplo 2

```ts
    import { execFile } from 'node:child_process';
    // O valor vira UM argumento, nunca comando.
    execFile('ping', ['-c', '3', String(req.query.host)], (erro, saida) => {
      res.json({ saida });
    });
```

---

## Tempo limite e limite de saída

- Um comando externo pode travar, e a requisição trava com ele. Duas opções resolvem os dois cenários:
- E, pior, segura um descritor de arquivo e um processo filho.
- Algumas dezenas desses e o servidor para de aceitar conexões: sem nenhum erro visível no log.

---

## Tempo limite e limite de saída: Exemplo

```ts
const run = promisify(execFile);
export async function ping(host: string) {
  const { stdout } = await run('ping', ['-c', '3', host], {
    timeout: 10_000, //         mata o processo depois de 10 s
    maxBuffer: 1024 * 64, //    recusa saídas absurdamente grandes
  });
  return parsePing(stdout);
}
```

---

## Extraindo dados da saída

- O comando devolve texto pensado para humanos; a API precisa devolver JSON. Expressões regulares com grupos nomeados fazem a ponte:
- O `ping` do macOS escreve `stddev`; o do Linux, `mdev`; o do Windows, em português, escreve outra coisa.
- Uma expressão regular calibrada na sua máquina quebra no servidor: motivo suficiente para preferir uma biblioteca quando ela existir.
- { "host": "8.8.8.8", "transmitidos": 3, "recebidos": 3, "pacotes": [ { "seq": 1, "ttl": 54, "time": 82.8 }, { "seq": 2, "ttl": 54, "time": 82.2 }, {...

---

## Extraindo dados da saída: Exemplo 1

```txt
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=54 time=82.8 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=54 time=82.2 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=54 time=84.1 ms
--- 8.8.8.8 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 1998ms
rtt min/avg/max/mdev = 82.194/83.019/84.095/0.796 ms
```

---

## Extraindo dados da saída: Exemplo 2

```ts
const PACOTE = /icmp_seq=(?<seq>\d+) ttl=(?<ttl>\d+) time=(?<time>[\d.]+)/g;
const ESTATISTICA =
  /(?<transmitted>\d+) packets transmitted, (?<received>\d+) (?:packets )?received/;
export function parsePing(saida: string) {
  const pacotes = [...saida.matchAll(PACOTE)].map(({ groups }) => ({
    seq: Number(groups?.seq),
    ttl: Number(groups?.ttl),
    time: Number(groups?.time),
  }));
  const { groups } = saida.match(ESTATISTICA) ?? {};
```

---

## Saída longa: `spawn`

- Para um processo que escreve continuamente: um `ping` sem `-c`, uma conversão de vídeo: `spawn` entrega em fluxo:

---

## Saída longa: `spawn`: Exemplo

```ts
const processo = spawn('ping', [host]);
processo.stdout.on('data', (pedaco) => {
  publicar('ping.linha', pedaco.toString());   // SSE, da aula anterior
});
processo.on('close', (codigo) => {
  publicar('ping.fim', { codigo });
});
```

---

## Quando usar uma biblioteca

- Chamar um binário externo traz três dependências invisíveis: o programa precisa existir, a versão precisa ser compatível e a saída precisa ter o...
- A maioria desses pacotes faz exatamente o que esta aula descreve: e mantém as expressões regulares de cada sistema operacional.
- O ganho é não ter de manter isso você mesmo.

---

## Quando usar uma biblioteca: Tabela

- Comando + regex: funciona com qualquer ferramenta | frágil entre sistemas; exige o binário
- Biblioteca (ex.: `ping`): saída já estruturada | uma dependência; menos controle
- Implementação em Node: sem processo externo | nem sempre possível (ICMP exige privilégio)

---

## Quando usar uma biblioteca: Exemplo

```ts
const { alive, time } = await ping.promise.probe(host, { timeout: 10 });
```

---

## Exercício

- Crie uma rota `GET /api/ping?host=`:
- Valide o host com a expressão regular da aula, respondendo `422` quando inválido.
- Execute com `execFile`, com `timeout: 10_000`.
- Extraia pacotes e estatísticas da saída e responda em JSON.
- Responda `504` quando o comando estourar o tempo limite.

---

## Exercício: Exemplo

```ts
  export async function show(req: Request, res: Response) {
    const host = assertHost(req.query.host);
    try {
      res.json({ host, ...(await ping(host)) });
    } catch (error) {
      // `killed` indica que o processo foi encerrado pelo timeout.
      if ((error as { killed?: boolean }).killed) {
        throw new HttpError(504, 'O comando demorou demais');
      }
      throw new HttpError(502, 'Falha ao executar o comando');
    }
  }
```

---

## Desafio

- Reescreva a rota com `spawn` e transmita a saída ao cliente por Server-Sent Events, linha a linha, enquanto o comando ainda está rodando.
- Trate o encerramento e garante que o processo filho seja morto quando o cliente desconectar.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Execução de comandos do sistema operacional a partir de uma rota Express: exec, execFile e spawn, injeção de comando, tempo limite, extração da saída...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Execução

- Qual a diferença entre `exec` e `execFile`?
- Quando `spawn` é preferível?
- Quando a saída é longa ou contínua: `exec` e `execFile` acumulam tudo em memória antes de entregar, enquanto `spawn` emite os dados em fluxo.

---

## Segurança e robustez

- Ele protege contra a interpretação pelo shell, mas o argumento ainda chega ao programa: que pode ter o próprio comportamento inesperado.
- A validação continua sendo a primeira barreira.
- Por que `timeout` é obrigatório?
- Porque um comando travado segura a requisição, um processo filho e um descritor de arquivo indefinidamente.
- Alguns desses e o servidor para de aceitar conexões.

---

## Próxima aula

- Testes: garantir que tudo isso continue funcionando amanhã.

---

## Resumo da Aula

- **Express.js: Chamada de Sistema** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
