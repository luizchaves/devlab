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
title: "Web APIs: Manipulação do DOM"
description: "Slides completos do tópico Web APIs: Manipulação do DOM."
---

<!-- _class: lead -->

# Web APIs: Manipulação do DOM

A Árvore DOM · Seleção de Elementos · Conteúdo de Elementos · Alteração de Estilos e Classes

---

## Objetivo

- Situar nós de elemento, de texto e de atributo dentro da árvore do documento.
- Selecionar elementos com `querySelector()` e `querySelectorAll()`, diferenciando `NodeList` de `HTMLCollection`.
- Escolher entre `textContent`, `innerText` e `innerHTML` conforme o risco de injeção e o custo de renderização.
- Manipular classes e estilos com `classList` e `style`, preferindo a classe ao estilo inline.
- Ler e escrever atributos com `getAttribute()`, `setAttribute()` e `dataset`, e ler o valor de campos de formulário.

---

## Mapa do Tópico

- **A Árvore DOM**.
- **Seleção de Elementos**.
- **Conteúdo de Elementos**.
- **Alteração de Estilos e Classes**.
- **Manipulação de Atributos**.
- **Propriedades de Formulários**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## A Árvore DOM

Quando o navegador carrega HTML, ele transforma a marcação em objetos navegáveis por JavaScript.

- `Document`: O nó raiz de todo o documento HTML.
- `Element`: Representa qualquer tag HTML (`<div>`, `<p>`, `<a>`).
- `Text`: O conteúdo de texto dentro ou entre as tags.
- `Attr`: Os atributos associados aos elementos (ex: `href`, `class`).

---

## A Árvore DOM: HTML de Entrada

Este HTML pequeno já contém documento, elementos, texto e atributos.

```html
<!doctype html>
<html>
  <head>
    <title>DevLab</title>
  </head>
  <body>
    <h1>Manipulação do DOM</h1>
    <p class="descricao">
      Leia a documentação no <a href="https://developer.mozilla.org">MDN</a>.
    </p>
  </body>
</html>
```

---

## A Árvore DOM: Representação

O JavaScript altera os objetos da árvore, não o texto do arquivo original.

```txt
Document
└── Element: html
    ├── Element: head
    │   └── Element: title
    │       └── Text: "DevLab"
    └── Element: body
        ├── Element: h1
        │   └── Text: "Manipulação do DOM"
        └── Element: p
            ├── Attr: class="descricao"
            ├── Text: "Leia a documentação no "
            ├── Element: a
            │   ├── Attr: href="https://developer.mozilla.org"
            │   └── Text: "MDN"
            └── Text: "."
```

---

## Seleção de Elementos

Antes de alterar qualquer elemento da página, é necessário obtê-lo através dos métodos de consulta do objeto `document`.

- **Métodos Modernos de Seleção (`querySelector`)**: Os métodos `querySelector` e `querySelectorAll` utilizam a mesma sintaxe de seletores CSS.
- **Métodos Tradicionais de Seleção**: Antes dos seletores CSS, cada critério de busca tinha um método próprio.

---

## Seleção de Elementos: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js title="seletores.js"
// Retorna o PRIMEIRO elemento que corresponde ao seletor CSS
const titulo = document.querySelector('h1');
const botaoSalvar = document.querySelector('#btn-salvar');
const primeiroItem = document.querySelector('.lista-itens .item');

// Retorna uma NodeList com TODOS os elementos correspondentes
const todosOsCards = document.querySelectorAll('.card');

// Iterando sobre uma NodeList com forEach
todosOsCards.forEach(card => {
  console.log(card);
});
```

---

## Conteúdo de Elementos

Existem três propriedades principais para ler ou alterar o conteúdo de um elemento HTML.

- <Aside type="danger" title="Atenção com Segurança (XSS)"> Nunca atribua entradas não confiáveis do usuário diretamente ao `innerHTML`.
- Isso expõe sua aplicação a ataques de Cross-Site Scripting (XSS).
- Para inserir texto vindo de formulários ou APIs externas, utilize sempre `textContent`.

---

## Conteúdo de Elementos: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js title="conteudo.js"
const elemento = document.querySelector('#mensagem');

// 1. textContent: Obtém ou define o texto puro (preserva espaços, ignora HTML)
elemento.textContent = "Novo texto de mensagem";

// 2. innerText: Obtém o texto visível (leva em conta estilos CSS como display: none)
console.log(elemento.innerText);

// 3. innerHTML: Interpreta e renderiza tags HTML contidas na string
elemento.innerHTML = "<strong>Texto em negrito</strong> com <em>ênfase</em>";
```

---

## Alteração de Estilos e Classes

A melhor prática é mudar estado visual por classe e reservar estilo inline para valores calculados.

- `classList`: liga ou desliga estados previstos no CSS.
- `style`: aplica valores calculados em tempo de execução.

---

## DOM, CSSOM e Renderização

O DOM guarda a estrutura; o CSSOM guarda as regras de estilo aplicáveis.

```txt
DOM: elementos e atributos
        │
        ├── classList.add('ativo')
        │
CSSOM: regras .ativo, .card, #menu
        │
        ▼
Renderização: cor, tamanho, posição e visibilidade
```

*Prefira classes para estados visuais e `style` para valores calculados.*

---

## Alteração de Estilos e Classes: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js title="estilos.js"
const caixa = document.querySelector('.caixa');

// Propriedades CSS em camelCase (background-color vira backgroundColor)
caixa.style.backgroundColor = '#2563eb';
caixa.style.fontSize = '1.2rem';
caixa.style.marginTop = '20px';

// Aplicação de múltiplos estilos em bloco com cssText
caixa.style.cssText = 'color: white; padding: 16px; border-radius: 8px;';
```

---

## Manipulação de Atributos

É possível ler, definir ou remover atributos HTML de qualquer elemento através da interface de atributos.

- `getAttribute()` lê atributos declarados na marcação.
- `setAttribute()` altera ou cria atributos.
- `removeAttribute()` remove o atributo do elemento.
- `dataset` expõe atributos `data-*` em camelCase.

---

## Propriedades de Formulários

Elementos de entrada de formulários possuem propriedades dedicadas para dados do usuário.

- `input.value` lê ou escreve o texto atual.
- `checkbox.checked` indica seleção booleana.
- `select.value` informa a opção escolhida.
- Use essas propriedades antes de montar validações e mensagens.

---

## Propriedades de Formulários: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js title="formularios.js"
const campoEmail = document.querySelector('#email');
const campoAceito = document.querySelector('#termos');

// Lê o valor atual digitado no input
console.log(campoEmail.value);

// Define um novo valor para o input
campoEmail.value = 'usuario@exemplo.com';

// Verifica se um checkbox ou radio button está marcado
if (campoAceito.checked) {
  console.log('Termos aceitos pelo usuário');
}
```

---

## Quando usar, e quando não usar?

As APIs de manipulação se sobrepõem bastante, e quase toda alteração pode ser escrita de três formas diferentes.

- **Texto externo**: use `textContent`, não `innerHTML`.
- **Texto visível**: use `innerText` quando CSS importa.
- **Estado visual**: use `classList.toggle()`, não estilo inline fixo.
- **Identificador no elemento**: use `dataset`, não atributo inventado.
- **Lista estática**: use `querySelectorAll()` antes de alterar classes.

---

## Executando

1. Pressione <kbd>F12</kbd> em qualquer página web para abrir as ferramentas do desenvolvedor.
2. Selecione a aba Console.
3. Altere o título principal da página atual executando: `document.querySelector('h1').textContent = 'DevLab - DOM Alterado!';`.
4. Mude a cor de fundo da página digitando: `document.body.style.backgroundColor = 'f0fdf4';`.

---

## Exercício Prático

1. Qual a diferença conceitual e de segurança entre utilizar `element.textContent` e `element.innerHTML`?
2. Como alternar a classe `ativo` em um elemento com ID `menu` ao clicar nele?
3. Dado o HTML `Perfil`, como ler o ID do usuário via JavaScript?
4. `textContent` trata todo o valor atribuído como texto puro, neutralizando qualquer tag HTML e evitando falhas de segurança XSS.
5. Código para alternar a classe.

---

## Desafio

Crie uma função `destacarLinksExternos()` que selecione todos os links `<a>` da página e adicione a classe CSS `link-externo`.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Por que a chamada `document.querySelector('.invalido')` retorna `null` caso o seletor não encontre nenhum elemento?
2. Como converter uma `NodeList` estática em um Array nativo do JavaScript?
3. Por que é preferível usar `classList.add()` em vez de modificar `element.className` diretamente?

---

## Resumo do Tópico

- **A Árvore DOM**: revise o papel desse eixo no uso da API.
- **Seleção de Elementos**: revise o papel desse eixo no uso da API.
- **Conteúdo de Elementos**: revise o papel desse eixo no uso da API.
- **Alteração de Estilos e Classes**: revise o papel desse eixo no uso da API.
- **Manipulação de Atributos**: revise o papel desse eixo no uso da API.
