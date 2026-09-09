---
title: 'Segurança no Navegador e OWASP Client-Side'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Segurança no Navegador e OWASP Client-Side

## Ideia Central
- **Papel**: Entenda as principais vulnerabilidades front-end da OWASP e aprenda a construir aplicações Vanilla JS seguras contra XSS, CSRF e vazamento de dados
- **Contexto**: A segurança de uma aplicação web não depende apenas das validações no servidor. O navegador do usuário é um ambiente dinâmico e exposto, no qual scripts maliciosos podem tentar interceptar dados sensíveis, manipular o DOM e forjar requisições em nome da vítima
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O Modelo de Segurança do Navegador
- **Ideia**: O navegador executa código JavaScript em um ambiente de isolamento que utiliza a Política de Mesma Origem (*Same-Origin Policy* ou SOP) como fundação primordial de proteção
### Princípio da Mesma Origem (SOP)
- **Ideia**: Duas páginas pertencem à mesma origem quando compartilham exatamente o mesmo protocolo, domínio (host) e porta
### A Fronteira do Cliente
- **Ideia**: Apesar do isolamento garantido pela SOP, o código que roda no cliente está completamente sob controle do usuário e de extensões instaladas no navegador

## Principais Riscos OWASP no Front-End
- **Ideia**: A OWASP destaca vulnerabilidades recorrentes que afetam diretamente o código executado nos navegadores
- **Ponto**: Stored XSS (Persistente): O script malicioso é salvo no banco de dados pelo servidor (como em um comentário) e entregue para todas as vítimas que visualizam a página
- **Ponto**: Reflected XSS (Refletido): O script malicioso vem em um parâmetro da URL ou formulário e é refletido diretamente na resposta HTTP sem sanitização
- **Ponto**: DOM-based XSS (Baseado no DOM): O código JavaScript do front-end lê um dado não confiável (como `location.hash` ou `location.search`) e o insere no documento através de métodos perigosos
- **Ponto**: Configure os cookies de sessão com o atributo `SameSite=Lax` ou `SameSite=Strict`
### Cross-Site Scripting (XSS)
- **Ideia**: O XSS ocorre quando um invasor consegue injetar e executar scripts JavaScript arbitrários no contexto de execução de uma aplicação confiável
- **Ponto**: Stored XSS (Persistente): O script malicioso é salvo no banco de dados pelo servidor (como em um comentário) e entregue para todas as vítimas que visualizam a página
- **Ponto**: Reflected XSS (Refletido): O script malicioso vem em um parâmetro da URL ou formulário e é refletido diretamente na resposta HTTP sem sanitização
### Content Security Policy (CSP)
- **Ideia**: A Content Security Policy (CSP) é uma camada adicional de defesa configurada através do cabeçalho HTTP `Content-Security-Policy` ou de uma meta tag ``
### Armazenamento Inseguro: Storage vs Cookies
- **Ideia**: A escolha de onde armazenar identificadores de sessão e tokens de autenticação afeta diretamente a superfície de ataque da aplicação
### Cross-Site Request Forgery (CSRF)
- **Ideia**: O CSRF é um ataque no qual um site malicioso induz o navegador da vítima a executar ações não autorizadas em uma aplicação na qual ela já está autenticada via cookies
- **Ponto**: Configure os cookies de sessão com o atributo `SameSite=Lax` ou `SameSite=Strict`
- **Ponto**: Em requisições `fetch()`, envie cabeçalhos personalizados (como `X-Requested-With` ou tokens anti-CSRF gerados pelo servidor) que sites externos não conseguem forjar devido à SOP
### Injeção em Links e Prevenção de Tabnabbing
- **Ideia**: A inserção dinâmica de links fornecidos por usuários pode introduzir vetores de execução de código e sequestro de abas (*reverse tabnabbing*)

## Fluxo Comparativo: Ataque vs Defesa
- **Ideia**: O diagrama abaixo ilustra a diferença entre um fluxo vulnerável a XSS com armazenamento inseguro e um fluxo protegido com defesas coordenadas
- **Detalhe**: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão

## Checklist de Segurança no Vanilla JS
- **Ideia**: Antes de publicar uma aplicação web em produção, confira os itens da lista de verificação de segurança client-side: ---

## Executando
- **Ideia**: Experimente o comportamento defensivo do navegador abrindo o console do desenvolvedor (F12) em qualquer página e executando os testes abaixo: Crie um contêiner de teste no DOM executando `const div = document
- **Detalhe**: createElement('div');`
- **Ponto**: Crie um contêiner de teste no DOM executando `const div = document.createElement('div');`
- **Ponto**: Insira uma string potencialmente perigosa usando `textContent`:
- **Ponto**: Inspecione o resultado em `div.innerHTML`. Observe como os caracteres especiais `` foram automaticamente convertidos para entidades seguras `<` e `>`, sem disparar nenhum alerta
- **Ponto**: Tente instanciar uma URL com pseudoprotocolo para testar o parser de validação:

## Exercício
- **Ideia**: Responda aos itens abaixo para exercitar a identificação de vulnerabilidades front-end e suas mitigações: Por que um token JWT armazenado em `localStorage` fica vulnerável em caso de Cross-Site Scripting (XSS)?
- **Detalhe**: Qual a função do atributo `rel="noopener noreferrer"` ao abrir links externos com `target="_blank"`?
- **Ponto**: Por que um token JWT armazenado em `localStorage` fica vulnerável em caso de Cross-Site Scripting (XSS)?
- **Ponto**: Qual a função do atributo `rel="noopener noreferrer"` ao abrir links externos com `target="_blank"`?
- **Ponto**: O que acontece quando uma aplicação com CSP configurado como `script-src 'self'` tenta executar um bloco `alert(1)` embutido no HTML?
- **Ponto**: Porque o `localStorage` é compartilhado por todo script que roda na mesma origem. Se um invasor conseguir injetar código via XSS, o script malicioso pode simplesmente executar `localStorage.getItem('token')` e enviar o token para um servidor externo

## Desafio
- **Ideia**: Crie uma função Vanilla JS chamada `renderizarMensagensSeguras(container, listaMensagens)` que receba um elemento do DOM e um array de objetos `{ autor: string, texto: string, link: string }`
- **Detalhe**: A função deve criar os elementos de forma 100% segura contra XSS, sanitizando o autor e texto com nós puros de texto e validando o link para aceitar apenas protocolos `https:`

## Perguntas de revisão
- **Ideia**: Responda às questões a seguir para consolidar os conceitos de segurança client-side e conformidade com os princípios da OWASP
- **Ponto**: Qual a diferença entre Stored XSS e DOM-based XSS?
- **Ponto**: Por que `textContent` é seguro contra XSS enquanto `innerHTML` é vulnerável?
- **Ponto**: Por que a flag `HttpOnly` é fundamental para cookies de sessão?
- **Ponto**: Como a Content Security Policy (CSP) ajuda a mitigar falhas de injeção de script?
### Vulnerabilidades e Mitigações
- **Ideia**: Questões sobre identificação de falhas e mecanismos de proteção no DOM: Qual a diferença entre Stored XSS e DOM-based XSS?
- **Ponto**: Qual a diferença entre Stored XSS e DOM-based XSS?
- **Ponto**: Por que `textContent` é seguro contra XSS enquanto `innerHTML` é vulnerável?
### Políticas e Armazenamento
- **Ideia**: Questões sobre isolamento de dados, cabeçalhos de segurança e credenciais: Por que a flag `HttpOnly` é fundamental para cookies de sessão?
- **Ponto**: Por que a flag `HttpOnly` é fundamental para cookies de sessão?
- **Ponto**: Como a Content Security Policy (CSP) ajuda a mitigar falhas de injeção de script?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
