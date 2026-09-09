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
title: "Web APIs: Server-Sent Events (SSE)"
description: "Slides completos do tópico Web APIs: Server-Sent Events (SSE)."
---

<!-- _class: lead -->

# Web APIs: Server-Sent Events (SSE)

O que são Server-Sent Events? · A Classe Nativa `EventSource` · O Protocolo `text/event-stream` · Estados da Conexão e Encerramento

---

## Objetivo

- Contrastar Server-Sent Events com requisições HTTP tradicionais, *short/long polling* e WebSockets.
- Conectar a um endpoint de streaming usando a classe nativa `EventSource`.
- Tratar eventos padrão (`open`, `message`, `error`) e registrar escutadores para eventos customizados com `addEventListener`.
- Compreender o formato de dados do protocolo `text/event-stream` (`data`, `event`, `id` e `retry`).
- Explicar como a reconexão automática nativa preserva o estado através do cabeçalho `Last-Event-ID`.
- Identificar as vantagens e limitações do SSE (unidirecionalidade, limite de conexões no HTTP/1.1 vs HTTP/2).

---

## Mapa do Tópico

- **O que são Server-Sent Events?**.
- **A Classe Nativa `EventSource`**.
- **O Protocolo `text/event-stream`**.
- **Estados da Conexão e Encerramento**.
- **Exemplo Prático: Servidor e Cliente**.
- **Boas Práticas e Limitações**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O que são Server-Sent Events?

O Server-Sent Events é um padrão web que permite a um servidor web enviar dados de forma contínua e assíncrona.

- **Protocolo**: WS / WSS (TCP independente após handshake).
- **Direção**: Bidirecional (*Full-Duplex*, ambos enviam).
- **Formato de Dados**: Texto ou Binário (ArrayBuffer / Blob).
- **Reconexão Automática**: Manual no JavaScript.
- **Sobretaxa de Rede**: Muito baixa após o handshake.

---

## A Classe Nativa `EventSource`

A interface `EventSource` é nativa dos navegadores modernos e dispensa a instalação de bibliotecas externas.

- Ela herda de `EventTarget`, permitindo o uso de `addEventListener` para escutar diferentes tipos de mensagens enviadas pelo servidor.
- Para iniciar uma conexão, basta instanciar o construtor informando a URL do endpoint de eventos.
- O ciclo de vida da conexão pode ser acompanhado por meio de três tratadores de evento fundamentais.

---

## A Classe Nativa `EventSource`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const fonteEventos = new EventSource('/api/stream-eventos');
```

---

## O Protocolo `text/event-stream`

O protocolo Server-Sent Events padroniza tanto a formatação dos dados transmitidos pelo servidor quanto a forma como o navegador interpreta.

- `data:` O conteúdo da mensagem a ser entregue. Múltiplas linhas consecutivas de `data:` são unidas pelo navegador com quebra de linha.
- `event:` O nome do tipo de evento customizado. Permite disparar ouvintes específicos registrados com `addEventListener(tipo, callback)`.
- `id:` Um identificador único sequencial para o evento.
- `retry:` O tempo em milissegundos que o navegador deve aguardar antes de tentar reconectar caso a conexão caia.

---

## O Protocolo `text/event-stream`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const fonteEventos = new EventSource('/api/mercado-financeiro');

// Escuta apenas mensagens com "event: cotacao"
fonteEventos.addEventListener('cotacao', (event) => {
  const cotacao = JSON.parse(event.data);
  console.log(`Ativo: ${cotacao.ativo} - Preço: R$ ${cotacao.preco}`);
});

// Escuta apenas mensagens com "event: alerta"
fonteEventos.addEventListener('alerta', (event) => {
  console.warn('Alerta do sistema:', event.data);
});
```

---

## Estados da Conexão e Encerramento

A instância de `EventSource` disponibiliza a propriedade somente leitura `readyState`.

- Quando o cliente não precisar mais receber notificações (por exemplo, ao mudar de página ou deslogar).
- ---.

---

## Estados da Conexão e Encerramento: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
console.log(fonteEventos.readyState);
// 0 (EventSource.CONNECTING) -> Conectando ou tentando reconectar
// 1 (EventSource.OPEN)       -> Conexão ativa e recebendo dados
// 2 (EventSource.CLOSED)     -> Conexão fechada permanentemente
```

---

## Exemplo Prático: Servidor e Cliente

Para visualizar o funcionamento de ponta a ponta, considere um backend em Node.

- **Implementação do Endpoint no Servidor**: O servidor deve definir os cabeçalhos de resposta corretos e manter o socket de resposta aberto sem chamar.
- **Consumo no Front-End**: O código JavaScript no navegador conecta ao endpoint e atualiza uma lista visual na página.

---

## Boas Práticas e Limitações

Antes de adotar Server-Sent Events em produção, é importante considerar algumas regras de arquitetura.

- Comunicação estritamente unidirecional: O cliente não pode enviar dados pelo objeto `EventSource`.
- Limite de conexões simultâneas no HTTP/1.
- Suporte a Cookies e Credenciais: Por padrão, o `EventSource` envia cookies apenas para requisições na mesma origem.

---

## Boas Práticas e Limitações: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const sse = new EventSource('https://api.outro-dominio.com/stream', {
  withCredentials: true
});
```

---

## Exercício Prático

1. Registre um ouvinte para o evento customizado `gol`.
2. Quando um evento `gol` for disparado, exiba uma mensagem formatada no console contendo o time que marcou e o minuto do lance.
3. Garanta o tratamento adequado caso ocorra algum erro na conexão.

---

## Desafio

Crie uma função `conectarStreamingComTimeout(url, timeoutMs)` que receba uma URL de SSE e um tempo limite em milissegundos.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Por que o Server-Sent Events é frequentemente preferido em relação aos WebSockets para streaming de respostas de IA (LLMs) e feeds de notícias?
2. Como a limitação de conexões HTTP/1.1 afeta o uso de SSE em múltiplas abas do mesmo navegador?
3. Qual é o papel do cabeçalho `Last-Event-ID` no protocolo Server-Sent Events?
4. Qual a diferença no JavaScript ao receber uma mensagem sem o campo `event` e outra com `event: notificacao`?

---

## Resumo do Tópico

- **O que são Server-Sent Events?**: revise o papel desse eixo no uso da API.
- **A Classe Nativa `EventSource`**: revise o papel desse eixo no uso da API.
- **O Protocolo `text/event-stream`**: revise o papel desse eixo no uso da API.
- **Estados da Conexão e Encerramento**: revise o papel desse eixo no uso da API.
- **Exemplo Prático: Servidor e Cliente**: revise o papel desse eixo no uso da API.
