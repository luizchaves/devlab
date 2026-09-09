---
title: 'Web APIs: Cookies e Sessão'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Cookies e Sessão

## Ideia Central
- **Papel**: Cookies no navegador, atributos Secure, HttpOnly, SameSite, expiração, sessão, autenticação e comparação com Web Storage
- **Contexto**: Cookies são pequenos pares chave-valor associados a uma origem ou domínio. Diferente do `localStorage`, eles podem ser enviados automaticamente pelo navegador em requisições HTTP, o que os torna importantes para autenticação, sessão, preferências simples e rastreamento consentido
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Cookies vs Web Storage
- **Ideia**: A diferença que decide entre os dois não é a capacidade, e sim o envio automático
- **Detalhe**: A tabela compara os três mecanismos, e a linha do envio em cada requisição é a que explica por que sessão vai em cookie e preferência de tema não: Evite guardar tokens sensíveis em `localStorage` quando a aplicação pode usar cookies `HttpOnly` configurados pelo servidor

## Como um Cookie Circula?
- **Ideia**: O servidor pode criar um cookie com o cabeçalho `Set-Cookie`
- **Detalhe**: Depois disso, o navegador decide em quais requisições futuras deve enviar esse valor

## Atributos Importantes
- **Ideia**: Os atributos anexados ao cabeçalho `Set-Cookie` definem o ciclo de vida, o escopo de domínio e as restrições de segurança aplicadas pelo navegador a cada requisição
### `Path`
- **Ideia**: Define em quais caminhos o cookie será enviado
### `Domain`
- **Ideia**: Define o domínio ao qual o cookie pertence
### `Max-Age` e `Expires`
- **Ideia**: Controlam expiração
### `Secure`
- **Ideia**: Faz o cookie ser enviado apenas em conexões HTTPS
### `HttpOnly`
- **Ideia**: Impede leitura e alteração pelo JavaScript
### `SameSite`
- **Ideia**: Controla quando o cookie é enviado em navegações ou requisições iniciadas por outros sites

## Criando Cookies com JavaScript
- **Ideia**: Cookies simples podem ser criados com `document
- **Detalhe**: cookie`, mas a API é antiga e baseada em string

## Cookies em Requisições `fetch`
- **Ideia**: Em chamadas para a mesma origem, o navegador pode enviar cookies automaticamente
- **Detalhe**: Em chamadas para outra origem, normalmente será necessário configurar `credentials`

## Quando usar, e quando não usar?
- **Ideia**: A propriedade que distingue o cookie de todo o resto é o envio automático em cada requisição para o domínio
- **Detalhe**: Isso é exatamente o que se quer em uma sessão e exatamente o que não se quer em uma preferência de interface, que passaria a viajar de graça em cada imagem e cada chamada de API

## Boas Práticas
- **Ideia**: As recomendações abaixo derivam dos atributos vistos até aqui

## Executando
- **Ideia**: Os passos abaixo usam a aba *Application* das ferramentas do desenvolvedor para ver cada atributo do cookie sendo aplicado: Abra uma página local ou qualquer site de teste no navegador
- **Detalhe**: No console, execute `document
- **Ponto**: Abra uma página local ou qualquer site de teste no navegador
- **Ponto**: No console, execute `document.cookie = 'aula=webapi; Path=/; Max-Age=300; SameSite=Lax';`
- **Ponto**: Abra a aba Application ou Storage das ferramentas do desenvolvedor
- **Ponto**: Localize a seção Cookies e confirme que o cookie foi criado

## Exercício
- **Ideia**: Os itens exercitam a escolha entre cookie e Web Storage e o efeito de cada atributo de segurança: Por que cookies são usados em autenticação com mais frequência que `localStorage`?
- **Detalhe**: Qual atributo impede JavaScript de ler um cookie?
- **Ponto**: Por que cookies são usados em autenticação com mais frequência que `localStorage`?
- **Ponto**: Qual atributo impede JavaScript de ler um cookie?
- **Ponto**: O que muda quando uma requisição `fetch()` usa `credentials: 'include'`?
- **Ponto**: Porque cookies podem ser enviados automaticamente pelo navegador ao servidor e podem ser

## Desafio
- **Ideia**: Explique qual configuração de cookie é mais adequada para uma sessão de login em produção e por quê: Possível resposta A configuração é adequada para muitos cenários porque `HttpOnly` impede leitura pelo JavaScript, `Secure` limita envio a HTTPS, `Path=/` vale para toda a aplicação e `SameSite=Lax` reduz riscos de CSRF sem quebrar navegações normais
- **Detalhe**: Em arquiteturas que exigem envio cross-site, pode ser necessário `SameSite=None; Secure`, junto com CORS e proteção adicional contra CSRF

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre armazenamento de sessão, atributos de segurança e o funcionamento dos cookies HTTP: Qual mecanismo é melhor para guardar um array grande de itens: cookie ou Web Storage?
- **Detalhe**: Possível resposta Web Storage ou IndexedDB
- **Ponto**: Qual mecanismo é melhor para guardar um array grande de itens: cookie ou Web Storage?
- **Ponto**: Por que `SameSite=None` exige `Secure`?
- **Ponto**: Um cookie `HttpOnly` aparece em `document.cookie`?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
