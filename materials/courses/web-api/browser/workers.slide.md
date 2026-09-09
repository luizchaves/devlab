---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Web APIs: Web Workers"
description: "Slides completos do tópico Web APIs: Web Workers."
---

<!-- _class: lead -->

# Web APIs: Web Workers

Thread Principal vs Worker · Criando um Worker · Worker com Módulos · O Worker Não Acessa o DOM

---

## Objetivo

- Explicar por que a thread principal do navegador desenha e executa JavaScript ao mesmo tempo.
- Criar um worker, trocar mensagens com `postMessage()` e receber resultados em `onmessage`.
- Carregar um worker como módulo ECMAScript com `{ type: 'module' }`.
- Justificar por que o worker não acessa o DOM e como devolver o resultado para quem acessa.
- Tratar erros do worker, encerrá-lo com `terminate()` e transferir dados grandes sem copiá-los.

---

## Mapa do Tópico

- **Thread Principal vs Worker**.
- **Criando um Worker**.
- **Worker com Módulos**.
- **O Worker Não Acessa o DOM**.
- **Tratamento de Erros**.
- **Encerrando um Worker**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Thread Principal vs Worker

O navegador desenha a interface e executa o JavaScript da página na mesma linha de execução.

- `async/await` organiza tarefas assíncronas, como rede e timers.
- `Worker` move processamento pesado para outra thread.

---

## Criando um Worker

Crie um arquivo separado para o código executado em segundo plano.

- Na thread principal, instancie o worker e envie uma mensagem.
- O valor enviado por `postMessage()` é copiado para o worker usando o algoritmo de structured clone.
- Objetos, arrays, números, strings, `Map`, `Set` e vários tipos estruturados podem ser enviados sem precisar serializar manualmente com JSON.

---

## Criando um Worker: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
self.addEventListener('message', (event) => {
  const limite = event.data;
  let soma = 0;

  for (let i = 0; i <= limite; i += 1) {
    soma += i;
  }

  self.postMessage({ limite, soma });
});
```

---

## Worker com Módulos

Em projetos modernos, é comum criar workers como módulos, usando `import` dentro do worker.

- Esse formato funciona bem com empacotadores como Vite, porque o build consegue descobrir e processar o arquivo do worker.
- ---.

---

## Worker com Módulos: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module'
});

worker.postMessage({ inicio: 1, fim: 10_000_000 });
```

---

## O Worker Não Acessa o DOM

Um worker não possui acesso a `document`, `window`, `querySelector()` ou elementos HTML.

- Isso é intencional.
- A UI continua sob responsabilidade da thread principal.
- O worker calcula, transforma ou processa dados; a thread principal recebe o resultado e atualiza a tela.

---

## O Worker Não Acessa o DOM: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
console.log(typeof document); // "undefined"
```

---

## Tratamento de Erros

Erros dentro do worker devem ser monitorados pela thread principal.

- Dentro do worker, também é possível capturar exceções e responder com um objeto de erro controlado.
- ---.

---

## Tratamento de Erros: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const worker = new Worker('./worker.js');

worker.addEventListener('error', (event) => {
  console.error('Erro no worker:', event.message);
});

worker.addEventListener('messageerror', () => {
  console.error('A mensagem nao pode ser clonada para o worker.');
});
```

---

## Encerrando um Worker

Workers continuam vivos enquanto a página existir ou até serem encerrados.

- Quando não forem mais necessários, finalize-os com `terminate()`.
- O próprio worker também pode chamar.
- close().

---

## Encerrando um Worker: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const worker = new Worker('./worker.js');

document.querySelector('#cancelar').addEventListener('click', () => {
  worker.terminate();
  console.log('Worker encerrado');
});
```

---

## Transferindo Dados Grandes

Por padrão, mensagens são copiadas.

- Para buffers grandes, é possível transferir a posse do dado para evitar cópia.
- Depois da transferência, a thread principal deixa de possuir aquele `ArrayBuffer`.
- Essa técnica é útil em processamento de imagens, áudio, arquivos e dados binários grandes.

---

## Transferindo Dados Grandes: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const buffer = new ArrayBuffer(1024 * 1024);

worker.postMessage(buffer, [buffer]);

console.log(buffer.byteLength); // 0 apos a transferencia
```

---

## Quando usar, e quando não usar?

Um worker custa uma thread, um arquivo separado e a serialização de tudo que atravessa o `postMessage()`.

- **Cálculo pesado que segura a interface por mais d**: O worker não alcança o DOM; devolva o dado pronto por `postMessage()`.
- **Processar arquivos grandes lidos**: Executar direto na thread principal, que gasta microssegundos.
- **Converter imagem, áudio ou CSV**: `fetch()` já é assíncrono e não bloqueia a thread.
- **Ordenar ou buscar em listas com muitos milhares**: Virtualizar a lista ou usar `DocumentFragment`.
- **Simulações e algoritmos limitados por CPU**: Reduzir as alterações de layout antes de pensar em thread.

---

## Executando

1. Crie `index.html`, `main.js` e `worker.js` na mesma pasta.
2. Em `index.html`, carregue `main.js` com `<script>`.
3. No `worker.js`, escute `message`, execute um cálculo e responda com `self.postMessage()`.
4. No `main.js`, crie `new Worker('./worker.js')` e registre o evento `message`.

---

## Exercício Prático

1. Por que um cálculo pesado pode travar a interface?
2. O worker pode acessar `document.querySelector()`?
3. Qual método é usado para enviar mensagens entre a thread principal e o worker?
4. Porque a thread principal do navegador executa JavaScript e também processa eventos, layout.
5. Não. Workers não acessam o DOM diretamente.

---

## Desafio

Crie um worker que receba um array de números e retorne.

1. menor valor.
2. maior valor.
3. média aritmética.
4. quantidade de itens.

---

## Perguntas de revisão

1. Qual é a principal vantagem de usar Web Worker?
2. Por que dados grandes podem ser transferidos em vez de copiados?
3. Quando `terminate()` deve ser chamado?

---

## Resumo do Tópico

- **Thread Principal vs Worker**: revise o papel desse eixo no uso da API.
- **Criando um Worker**: revise o papel desse eixo no uso da API.
- **Worker com Módulos**: revise o papel desse eixo no uso da API.
- **O Worker Não Acessa o DOM**: revise o papel desse eixo no uso da API.
- **Tratamento de Erros**: revise o papel desse eixo no uso da API.
