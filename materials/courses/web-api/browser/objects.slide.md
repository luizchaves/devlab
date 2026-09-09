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
title: "Web APIs: Objetos do Navegador"
description: "Slides completos do tópico Web APIs: Objetos do Navegador."
---

<!-- _class: lead -->

# Web APIs: Objetos do Navegador

O Browser Object Model (BOM) · Objeto Window · Objeto Location · Objeto History

---

## Objetivo

- Situar `window` como objeto global e explicar a relação dele com `document`.
- Ler e alterar a URL corrente pelas propriedades de `location`.
- Consultar o histórico da sessão com `history` sem provocar recarregamento.
- Obter informações do ambiente de execução por `navigator`, sabendo o que nele é confiável.
- Investigar código com os métodos de `console` além do `log()`, como `table()`, `time()` e `error()`.

---

## Mapa do Tópico

- **O Browser Object Model (BOM)**.
- **Objeto Window**.
- **Objeto Location**.
- **Objeto History**.
- **Objeto Navigator**.
- **Objeto Console**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O Browser Object Model (BOM)

O Browser Object Model representa o ambiente fornecido pelo navegador.

- Ao contrário do ECMAScript puro (que trata apenas da linguagem), o BOM conecta o código JavaScript com a aba.
- No topo dessa hierarquia está o objeto global `window`.
- Tudo o que existe no escopo global do navegador (variáveis globais, funções nativas e outras Web APIs) é propriedade de `window`.

---

## Objeto Window

O objeto `window` representa a janela ou aba aberta no navegador.

- **Dimensões da Janela**: As propriedades `innerWidth` e `innerHeight` retornam a largura.
- **Diálogos Nativos**: O navegador oferece três métodos síncronos para interagir diretamente.
- **Abertura e Fechamento de Janelas**: Você pode abrir novas abas ou janelas através do método `open()`.

---

## Objeto Window: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const largura = window.innerWidth;
const altura = window.innerHeight;

console.log(`Viewport atual: ${largura}px x ${altura}px`);
```

---

## Objeto Window: Casos

- **Dimensões da Janela**: As propriedades `innerWidth` e `innerHeight` retornam a largura.
- **Diálogos Nativos**: O navegador oferece três métodos síncronos para interagir diretamente.
- **Abertura e Fechamento de Janelas**: Você pode abrir novas abas ou janelas através do método `open()`.

---

## Objeto Location

O objeto `location`.

- **`href`**: URL completa.
- **`protocol`**: Protocolo da requisição.
- **`host`**: Domínio e porta.
- **`hostname`**: Nome do domínio sem a porta.
- **`pathname`**: Caminho do recurso na servidor.

---

## Objeto Location: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
// Redirecionamento direto modificando o href
location.href = "https://developer.mozilla.org";

// Redirecionamento gravando no histórico de navegação
location.assign("/nova-pagina");

// Redirecionamento substituindo a página atual (não permite voltar)
location.replace("/login");

// Recarrega a página atual
location.reload();
```

---

## Objeto History

O objeto `history` permite interagir com o histórico da aba atual, simulando os botões de avançar e voltar do navegador.

- <Aside type="tip" title="Single Page Applications (SPAs)"> A History API moderna também fornece os métodos.
- pushState()` e `history.
- replaceState().

---

## Objeto History: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
// Volta para a página anterior no histórico
history.back();

// Avança para a próxima página no histórico
history.forward();

// Desloca N páginas no histórico (negativo para voltar, positivo para avançar)
history.go(-2); // Volta duas páginas
```

---

## Objeto Navigator

O objeto `navigator` fornece informações sobre o navegador, a plataforma, o estado de conectividade e as permissões do dispositivo do usuário.

- ---.
- Trate estados de sucesso, erro e ausência de suporte.

---

## Objeto Navigator: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
// String de identificação do navegador (User-Agent)
console.log(navigator.userAgent);

// Idioma preferencial do usuário
console.log(navigator.language); // ex: "pt-BR"

// Estado da conexão de rede (true se online)
if (navigator.onLine) {
  console.log("Conectado à internet");
} else {
  console.log("Sem conexão de rede");
}
```

---

## Objeto Console

O objeto `console` fornece acesso ao console de depuração do navegador.

- Além do conhecido.
- ---.

---

## Cuidados com Server-Side Rendering (SSR)

Em frameworks modernos de renderização no servidor (*Server-Side Rendering*) como Next.

- js, Nuxt, SvelteKit e Astro, o código JavaScript da página executa primeiro no ambiente Node.
- js do servidor para gerar a estrutura HTML inicial.
- <Aside type="caution" title="ReferenceError: window is not defined"> Como o ambiente Node.

---

## Executando

1. Abra qualquer página web no navegador Google Chrome ou Firefox.
2. Pressione <kbd>F12</kbd> (ou clique com o botão direito e selecione Inspecionar).
3. Abra a aba Console.
4. Digite `console.table(location)` e pressione <kbd>Enter</kbd> para inspecionar as propriedades da URL atual em formato de tabela.

---

## Exercício Prático

1. Qual a diferença prática entre redirecionar um usuário via `location.href = url` e via `location.replace(url)`?
2. Como obter os parâmetros de busca (`search`) de uma URL e ler o valor do parâmetro `categoria`?
3. Escreva um trecho de código que exiba um alerta caso o usuário esteja sem conexão com a internet (`navigator.onLine`).
4. O `location.href`.
5. Utilizando o construtor `URLSearchParams`.

---

## Desafio

Crie uma função `medirTempoDeExecucao(fn)` que receba uma função qualquer como parâmetro, execute essa função e utilize os métodos.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Por que variáveis declaradas com `var` no escopo global viram propriedades de `window`, mas variáveis declaradas com `let` ou `const` não?
2. Qual é o risco de utilizar diálogos nativos como `window.alert()` em aplicações em produção?
3. Qual propriedade do objeto `location` retorna apenas o caminho da URL após o nome do domínio?
4. Como funciona o método `history.go(-1)`?

---

## Resumo do Tópico

- **O Browser Object Model (BOM)**: revise o papel desse eixo no uso da API.
- **Objeto Window**: revise o papel desse eixo no uso da API.
- **Objeto Location**: revise o papel desse eixo no uso da API.
- **Objeto History**: revise o papel desse eixo no uso da API.
- **Objeto Navigator**: revise o papel desse eixo no uso da API.
