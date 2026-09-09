---
title: 'Web APIs: Server-Sent Events (SSE)'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Server-Sent Events (SSE)

## Ideia Central
- **Papel**: Transmissão unidirecional de dados em tempo real do servidor para o cliente usando a API EventSource e o protocolo text/event-stream
- **Contexto**: Quando uma aplicação precisa receber atualizações contínuas do servidor em tempo real (como feeds de notícias, cotações financeiras, notificações ou geração de texto por modelos de inteligência artificial), nem sempre é necessário abrir um canal bidirecional complexo como o WebSocket. A especificação de Server-Sent Events (SSE) oferece uma solução nativa, simples e baseada em HTTP padrão para envio unidirecional de eventos do servidor para o navegador
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O que são Server-Sent Events?
- **Ideia**: O Server-Sent Events é um padrão web que permite a um servidor web enviar dados de forma contínua e assíncrona para o cliente após o estabelecimento de uma única conexão HTTP persistente
- **Detalhe**: Diferente do ciclo de requisição e resposta convencional, onde o servidor responde e fecha a conexão imediatamente, no SSE o servidor mantém a resposta aberta com o cabeçalho `Content-Type: text/event-stream`

## A Classe Nativa `EventSource`
- **Ideia**: A interface `EventSource` é nativa dos navegadores modernos e dispensa a instalação de bibliotecas externas
- **Detalhe**: Ela herda de `EventTarget`, permitindo o uso de `addEventListener` para escutar diferentes tipos de mensagens enviadas pelo servidor

## O Protocolo `text/event-stream`
- **Ideia**: O protocolo Server-Sent Events padroniza tanto a formatação dos dados transmitidos pelo servidor quanto a forma como o navegador interpreta diferentes tipos de mensagens
- **Ponto**: `data:` O conteúdo da mensagem a ser entregue. Múltiplas linhas consecutivas de `data:` são unidas pelo navegador com quebra de linha
- **Ponto**: `event:` O nome do tipo de evento customizado. Permite disparar ouvintes específicos registrados com `addEventListener(tipo, callback)`
- **Ponto**: `id:` Um identificador único sequencial para o evento. O navegador armazena esse valor e o envia no cabeçalho HTTP `Last-Event-ID` ao se reconectar
- **Ponto**: `retry:` O tempo em milissegundos que o navegador deve aguardar antes de tentar reconectar caso a conexão caia
### Estrutura e Campos da Mensagem
- **Ideia**: O servidor se comunica com o cliente enviando blocos de texto puro formatados em linhas com campos específicos, separados por quebras de linha duplas (`\n\n`)
- **Ponto**: `data:` O conteúdo da mensagem a ser entregue. Múltiplas linhas consecutivas de `data:` são unidas pelo navegador com quebra de linha
- **Ponto**: `event:` O nome do tipo de evento customizado. Permite disparar ouvintes específicos registrados com `addEventListener(tipo, callback)`
### Escutando Eventos Customizados
- **Ideia**: Quando o servidor define o campo `event: nome-do-evento`, o ouvinte genérico `onmessage` não é acionado para essa mensagem

## Estados da Conexão e Encerramento
- **Ideia**: A instância de `EventSource` disponibiliza a propriedade somente leitura `readyState`, que reflete o estado atual do canal através de constantes numéricas: Quando o cliente não precisar mais receber notificações (por exemplo, ao mudar de página ou deslogar), é essencial fechar o canal para liberar os recursos do servidor e do navegador: ---

## Exemplo Prático: Servidor e Cliente
- **Ideia**: Para visualizar o funcionamento de ponta a ponta, considere um backend em Node
- **Detalhe**: js com Express que envia notificações periódicas, e um cliente JavaScript que as exibe em tela
### Implementação do Endpoint no Servidor
- **Ideia**: O servidor deve definir os cabeçalhos de resposta corretos e manter o socket de resposta aberto sem chamar `res
### Consumo no Front-End
- **Ideia**: O código JavaScript no navegador conecta ao endpoint e atualiza uma lista visual na página: ---

## Boas Práticas e Limitações
- **Ideia**: Antes de adotar Server-Sent Events em produção, é importante considerar algumas regras de arquitetura: Comunicação estritamente unidirecional: O cliente não pode enviar dados pelo objeto `EventSource`
- **Detalhe**: Se o usuário precisar enviar uma ação para o servidor, use chamadas convencionais via `fetch()` (POST, PUT, DELETE)
- **Ponto**: Comunicação estritamente unidirecional: O cliente não pode enviar dados pelo objeto `EventSource`. Se o usuário precisar enviar uma ação para o servidor, use chamadas convencionais via `fetch()` (POST, PUT, DELETE)
- **Ponto**: Limite de conexões simultâneas no HTTP/1.1: Navegadores limitam a 6 o número de conexões HTTP simultâneas abertas por domínio no HTTP/1.1. Ao abrir múltiplas abas de um mesmo site, o limite pode ser atingido rapidamente. Uso de HTTP/2 é altamente recomendado, pois multiplexa todas as requisições e streams sobre uma única conexão TCP
- **Ponto**: Suporte a Cookies e Credenciais: Por padrão, o `EventSource` envia cookies apenas para requisições na mesma origem. Para enviar credenciais entre origens (*cross-origin*), passe a opção `withCredentials: true`:

## Exercício
- **Ideia**: Crie um script cliente que se conecte a um endpoint de streaming `/api/placar-jogos` e realize as seguintes ações: Registre um ouvinte para o evento customizado `gol`
- **Detalhe**: Quando um evento `gol` for disparado, exiba uma mensagem formatada no console contendo o time que marcou e o minuto do lance
- **Ponto**: Registre um ouvinte para o evento customizado `gol`
- **Ponto**: Quando um evento `gol` for disparado, exiba uma mensagem formatada no console contendo o time que marcou e o minuto do lance
- **Ponto**: Garanta o tratamento adequado caso ocorra algum erro na conexão

## Desafio
- **Ideia**: Crie uma função `conectarStreamingComTimeout(url, timeoutMs)` que receba uma URL de SSE e um tempo limite em milissegundos
- **Detalhe**: Se nenhuma mensagem ou evento for recebido do servidor dentro do tempo limite estipulado, a conexão deve ser automaticamente fechada e uma notificação de aviso emitida

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre o ciclo de vida, o protocolo `text/event-stream` e as decisões de arquitetura com Server-Sent Events:
- **Ponto**: Por que o Server-Sent Events é frequentemente preferido em relação aos WebSockets para streaming de respostas de IA (LLMs) e feeds de notícias?
- **Ponto**: Como a limitação de conexões HTTP/1.1 afeta o uso de SSE em múltiplas abas do mesmo navegador?
- **Ponto**: Qual é o papel do cabeçalho `Last-Event-ID` no protocolo Server-Sent Events?
- **Ponto**: Qual a diferença no JavaScript ao receber uma mensagem sem o campo `event` e outra com `event: notificacao`?
### Casos de Uso e Arquitetura
- **Ideia**: As questões a seguir avaliam o critério de escolha entre SSE e outros protocolos em tempo real: Por que o Server-Sent Events é frequentemente preferido em relação aos WebSockets para streaming de respostas de IA (LLMs) e feeds de notícias?
- **Ponto**: Por que o Server-Sent Events é frequentemente preferido em relação aos WebSockets para streaming de respostas de IA (LLMs) e feeds de notícias?
- **Ponto**: Como a limitação de conexões HTTP/1.1 afeta o uso de SSE em múltiplas abas do mesmo navegador?
### Protocolo e Reconexão
- **Ideia**: As questões a seguir avaliam o formato das mensagens e a resiliência da conexão: Qual é o papel do cabeçalho `Last-Event-ID` no protocolo Server-Sent Events?
- **Ponto**: Qual é o papel do cabeçalho `Last-Event-ID` no protocolo Server-Sent Events?
- **Ponto**: Qual a diferença no JavaScript ao receber uma mensagem sem o campo `event` e outra com `event: notificacao`?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
