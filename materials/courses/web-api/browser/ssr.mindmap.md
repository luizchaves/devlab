---
title: 'Web APIs: Server-Side Rendering (SSR)'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Server-Side Rendering (SSR)

## Ideia Central
- **Papel**: Entenda os desafios de utilizar Web APIs em ambientes com Server-Side Rendering (SSR), prevenindo erros de window is not defined e aplicando hidratação segura em React, Vue e Astro
- **Contexto**: No desenvolvimento web moderno com frameworks como Next.js, Astro, Nuxt e SvelteKit, a renderização das páginas ocorre em dois momentos distintos: no servidor (gerando o HTML inicial) e no cliente (executando interatividade no navegador)
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O Ciclo de Vida do SSR e Hidratação (*Hydration*)
- **Ideia**: Em uma aplicação SSR, a requisição do usuário passa por dois estágios de execução: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão
- **Detalhe**: O mesmo arquivo executa em dois lugares com bibliotecas globais diferentes

## O Problema: `ReferenceError: window is not defined`
- **Ideia**: Quando um componente tenta acessar um objeto do navegador diretamente no corpo da função de renderização, o Node

## Estratégias para Acesso Seguro a Web APIs
- **Ideia**: Para evitar falhas de execução no servidor durante a renderização SSR, o código da aplicação deve isolar as chamadas a objetos globais do navegador
### Estratégia 1: Guard de Escopo Global (`typeof window`)
- **Ideia**: A técnica mais simples para código isomórfico (que pode rodar tanto no cliente quanto no servidor) é verificar a existência de `window`:
### Estratégia 2: Hooks e Eventos de Hidratação (*Client Lifecycle*)
- **Ideia**: Em frameworks reativos, o código inserido em manipuladores de montagem roda estritamente no cliente, após a hidratação da página
### Estratégia 3: Arquitetura de Ilhas (*Astro Islands*)
- **Ideia**: O Astro utiliza o conceito de Zero JavaScript por padrão

## Comparativo de Armazenamento: SSR vs Cliente
- **Ideia**: Em aplicações SSR, se você precisa identificar o usuário autenticado durante a renderização no servidor, o `localStorage` não funcionará

## Executando um Exemplo Seguro
- **Ideia**: Os passos abaixo reproduzem o erro no servidor e depois aplicam a guarda que o elimina: Abra o console do navegador com F12
- **Detalhe**: Execute o código de checagem condicional: Observe que no navegador o resultado é `true`, enquanto em um script rodado via `node` o resultado seria `false`
- **Ponto**: Abra o console do navegador com F12
- **Ponto**: Execute o código de checagem condicional:
- **Ponto**: Observe que no navegador o resultado é `true`, enquanto em um script rodado via `node` o resultado seria `false`

## Exercício
- **Ideia**: Os itens abaixo pedem que você explique o erro antes de corrigi-lo, porque entender a causa é o que evita repeti-lo: Por que o código `const width = window
- **Detalhe**: innerWidth` dentro do corpo de um componente Next
- **Ponto**: Por que o código `const width = window.innerWidth` dentro do corpo de um componente Next.js/Astro lança erro durante o build ou renderização?
- **Ponto**: Como podemos passar a informação de autenticação do usuário para o renderizador SSR do servidor se o `localStorage` não está disponível no Node.js?
- **Ponto**: Porque durante a renderização no servidor (SSR), o JavaScript é executado pelo Node.js, onde o objeto global `window` não existe
- **Ponto**: Utilizando Cookies HTTP. Como os cookies são enviados automaticamente no cabeçalho `Cookie` da requisição HTTP, o servidor Node.js consegue lê-los antes de gerar o HTML da página

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre renderização no servidor, ciclo de hidratação e guards de ambiente: Qual a função do hook `useEffect` (React) ou `onMounted` (Vue) no contexto de SSR?
- **Detalhe**: Possível resposta Eles garantem que a função interna seja ignorada durante a execução no servidor Node
- **Ponto**: Qual a função do hook `useEffect` (React) ou `onMounted` (Vue) no contexto de SSR?
- **Ponto**: O que acontece se alterarmos o DOM diretamente antes do processo de hidratação terminar em um framework SSR?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
