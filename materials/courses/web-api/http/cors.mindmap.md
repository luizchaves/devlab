---
title: 'Web APIs: CORS e Segurança'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: CORS e Segurança

## Ideia Central
- **Papel**: Same-Origin Policy, CORS, preflight, credenciais, cabeçalhos HTTP e erros comuns em requisições entre origens
- **Contexto**: Ao consumir uma API com `fetch()`, é comum encontrar mensagens como "blocked by CORS policy". Esse erro não significa que o JavaScript está errado. Significa que o navegador aplicou uma regra de segurança para impedir que uma página leia respostas de uma origem que não autorizou esse acesso
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Origem: Protocolo + Domínio + Porta
- **Ideia**: Para o navegador, uma origem é formada por três partes: `localhost:5173` e `localhost:3000` são origens diferentes porque a porta mudou
- **Detalhe**: Esse é o cenário clássico de desenvolvimento: Vite no front-end e API em outra porta

## Same-Origin Policy
- **Ideia**: A Same-Origin Policy é uma regra de segurança do navegador
- **Detalhe**: Ela restringe como scripts de uma origem podem ler dados de outra origem

## O que é CORS?
- **Ideia**: CORS significa *Cross-Origin Resource Sharing*
- **Detalhe**: É o mecanismo pelo qual um servidor informa ao navegador quais origens externas podem acessar suas respostas

## Requisições Simples e Preflight
- **Ideia**: Algumas requisições são consideradas simples
- **Detalhe**: Outras exigem uma requisição preliminar chamada preflight, feita com o método `OPTIONS`
### Requisição simples
- **Ideia**: Geralmente ocorre com `GET`, `HEAD` ou `POST` usando cabeçalhos e tipos de conteúdo simples
### Requisição com preflight
- **Ideia**: Ao enviar JSON com `Content-Type: application/json`, usar métodos como `PUT`/`DELETE` ou adicionar cabeçalhos personalizados, o navegador pergunta antes se a API permite aquela operação

## Credenciais: Cookies e Autenticação
- **Ideia**: Por padrão, `fetch()` não envia cookies em requisições para outra origem
- **Detalhe**: Para incluir cookies, é preciso configurar `credentials`

## Cabeçalhos Mais Importantes
- **Ideia**: Todo diagnóstico de CORS passa por saber quem envia cada cabeçalho
- **Detalhe**: A tabela separa os que partem do navegador dos que partem do servidor, e é essa coluna do meio que diz de que lado está a correção: --- Diante de "estou tomando erro de CORS", assistentes sugerem com frequência `fetch(url, { mode: 'no-cors' })`

## Erros Comuns e Diagnóstico
- **Ideia**: As mensagens de CORS no console são específicas o bastante para apontar a causa, desde que se saiba lê-las
- **Detalhe**: A tabela liga cada mensagem ao que falta e ao arquivo onde a correção deve ser escrita: O `catch` acima captura falhas de rede e bloqueios que impedem a entrega da resposta ao JavaScript

## Desenvolvimento Local
- **Ideia**: Durante o desenvolvimento, há três soluções comuns: Configurar CORS corretamente no back-end para aceitar `http://localhost:5173`
- **Detalhe**: Usar um proxy do servidor de desenvolvimento, como o proxy do Vite
- **Ponto**: Configurar CORS corretamente no back-end para aceitar `http://localhost:5173`
- **Ponto**: Usar um proxy do servidor de desenvolvimento, como o proxy do Vite
- **Ponto**: Servir front-end e API pela mesma origem em ambiente integrado

## Quando usar, e quando não usar?
- **Ideia**: CORS não é uma escolha do front-end
- **Detalhe**: O navegador aplica a *Same-Origin Policy* sempre, e o que existe é a decisão de como contornar o bloqueio durante o desenvolvimento e o que liberar em produção

## Executando
- **Ideia**: Os passos reproduzem o bloqueio de propósito e depois o corrigem no servidor, que é onde a correção sempre mora: Abra a aba Network das ferramentas do desenvolvedor
- **Detalhe**: Faça uma requisição `fetch()` para uma API em outra origem
- **Ponto**: Abra a aba Network das ferramentas do desenvolvedor
- **Ponto**: Faça uma requisição `fetch()` para uma API em outra origem
- **Ponto**: Clique na requisição e procure o cabeçalho `Origin` em Request Headers
- **Ponto**: Verifique se a resposta contém `Access-Control-Allow-Origin`

## Exercício
- **Ideia**: Os itens abaixo pedem que você identifique a origem do bloqueio antes de propor a correção: Por que `http://localhost:5173` e `http://localhost:3000` são origens diferentes?
- **Detalhe**: O que é uma requisição preflight?
- **Ponto**: Por que `http://localhost:5173` e `http://localhost:3000` são origens diferentes?
- **Ponto**: O que é uma requisição preflight?
- **Ponto**: Por que não basta adicionar um cabeçalho CORS no `fetch()`?
- **Ponto**: Porque a origem inclui protocolo, domínio e porta. Mesmo domínio com porta diferente forma

## Desafio
- **Ideia**: Imagine uma aplicação em `http://localhost:5173` chamando uma API em `http://localhost:3000` com: Liste quais cabeçalhos a resposta de preflight precisa permitir para essa chamada funcionar

## Perguntas de revisão
- **Ideia**: CORS é uma regra do JavaScript ou do navegador?
- **Detalhe**: Possível resposta Do navegador
- **Ponto**: CORS é uma regra do JavaScript ou do navegador?
- **Ponto**: Por que `Access-Control-Allow-Origin: *` não serve para requisições com cookies?
- **Ponto**: Qual método HTTP é usado no preflight?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
