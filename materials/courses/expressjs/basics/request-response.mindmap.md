---
title: 'Express.js: Requisição e Resposta'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Express.js: Requisição e Resposta

## Objeto `req` (Entrada)

- **Identificação da Chamada**: `req.method`, `req.path`, `req.originalUrl`, `req.protocol`, `req.ip`.
- **Cabeçalhos HTTP**:
  - `req.get(header)`: leitura case-insensitive segura.
  - `req.headers`: objeto com cabeçalhos em letras minúsculas.
- **Validação de Formato**: `req.is('application/json')` para proteção de handlers.
- **Extração de Dados**: `req.params` (rota), `req.query` (busca na URL) e `req.body` (payload JSON).

## Objeto `res` (Saída)

- **Configuração (Encadeáveis)**:
  - `res.status(code)`: definição do código HTTP.
  - `res.set(name, value)`: inclusão de cabeçalhos de resposta.
  - `res.type(mime)`: definição do Content-Type.
- **Término (Finalizam Conexão)**:
  - `res.json(data)`: serialização JSON e encerramento.
  - `res.send(body)`: envio inferido de dados, texto ou buffer.
  - `res.redirect(status, url)`: desvio HTTP (301, 302, 303, 307).
  - `res.sendFile()`: transmissão inline de arquivos.
  - `res.download()`: download forçado com nome de arquivo sugerido.

## Negociação e Eventos do Ciclo

- **Negociação de Conteúdo**: `res.format()` mapeando formatos com base no cabeçalho `Accept` (406 se incompatível).
- **Métricas e Logs**: `res.on('finish')` para leitura do status e cálculo de duração de resposta.
- **Segurança de Fluxo**: uso obrigatório de `return res...` para impedir `ERR_HTTP_HEADERS_SENT`.

## Arquivos Estáticos e Cache

- **Servidor de Assets**: `express.static('public')` com prioridade na cadeia de middlewares.
- **Otimização de Tráfego**: geração automática de `ETag`, cabeçalhos `Cache-Control` e respostas `304 Not Modified`.
