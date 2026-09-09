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
title: "Web APIs: Local Storage e Web Storage"
description: "Slides completos do tópico Web APIs: Local Storage e Web Storage."
---

<!-- _class: lead -->

# Web APIs: Local Storage e Web Storage

Comparativo de Armazenamento no Navegador · A Web Storage API · Comportamento de Conversão e Valores Ausentes · Serialização de Objetos com JSON

---

## Objetivo

- Comparar `localStorage`, `sessionStorage`, cookies e IndexedDB por tempo de vida, capacidade e finalidade.
- Usar `setItem()`, `getItem()`, `removeItem()` e `clear()`, lembrando que tudo é armazenado como string.
- Serializar e recuperar objetos com `JSON.stringify()` e `JSON.parse()`, tratando chaves inexistentes e dados corrompidos.
- Encapsular o acesso em um módulo reutilizável com tratamento tolerante a falhas.
- Sincronizar abas abertas na mesma origem com o evento `storage`.

---

## Mapa do Tópico

- **Comparativo de Armazenamento no Navegador**.
- **A Web Storage API**.
- **Comportamento de Conversão e Valores Ausentes**.
- **Serialização de Objetos com JSON**.
- **Exemplo Prático com Interface**.
- **Módulo de Armazenamento Reutilizável**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Comparativo de Armazenamento no Navegador

O navegador oferece diferentes opções para salvar dados no cliente, cada uma adequada a um caso de uso específico.

- **`localStorage`**: Apenas Strings.
- **`sessionStorage`**: Apenas Strings.
- **Cookies**: Strings.
- **IndexedDB**: Objetos / Chave-Valor.

---

## A Web Storage API

Os objetos `localStorage` e `sessionStorage` compartilham exatamente a mesma interface de métodos e propriedades.

- A única diferença é a persistência: enquanto o `sessionStorage` é limpo quando a aba é fechada.
- A interface tem cinco métodos principais, e todos operam sobre strings.
- ---.

---

## A Web Storage API: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
// 1. Armazenar uma string
localStorage.setItem('temaPref', 'dark');

// 2. Ler um valor armazenado (retorna string ou null se não existir)
const tema = localStorage.getItem('temaPref');
console.log(tema); //=> "dark"

// 3. Remover uma chave específica
localStorage.removeItem('temaPref');

// 4. Limpar TODOS os dados da origem atual
localStorage.clear();
```

---

## Comportamento de Conversão e Valores Ausentes

O Web Storage armazena estritamente pares de texto (strings).

- **`setItem('total', 42)`**: Converter com `Number()` antes de calcular.
- **`setItem('user', { id: 1 })`**: Serializar com `JSON.stringify()` antes de gravar.
- **Nada, chave inexistente**: Definir um valor padrão na leitura (`?? fallback`).
- **JSON corrompido por edição**: `JSON.parse()` lança `SyntaxError` (usar `try/catch`).

---

## Comportamento de Conversão e Valores Ausentes: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
function read(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
```

---

## Serialização de Objetos com JSON

Para armazenar estruturas de dados complexas (arrays e objetos), devemos serializá-las para JSON na gravação e desserializá-las na leitura.

- <Aside type="caution" title="Limites de Cota e Exceções"> Tentar gravar dados além do limite de cota (~5MB) disparará a exceção.
- Envolva sempre operações de `setItem` em blocos `try/catch` quando lidar com dados volumosos.
- <Aside type="caution" title="Storage não é cofre de segurança"> Não grave senhas, tokens JWT sensíveis ou credenciais em `localStorage`.

---

## Exemplo Prático com Interface

O preview interativo do tópico demonstra leitura, gravação e remoção de dados no `localStorage`.

- <HtmlPreview path="examples/courses/web-api/browser-web-apis/storage.
- html" height="22rem" label="storage.
- <SourceCode path="examples/courses/web-api/browser-web-apis/storage.

---

## Módulo de Armazenamento Reutilizável

Em aplicações reais, abstraímos as chamadas do `localStorage` em um serviço centralizado para evitar duplicação.

- stringify` e `JSON.
- ---.

---

## O Evento `storage`

Quando um valor no `localStorage` é alterado, o navegador dispara o evento `storage` em todas as outras abas ativas do mesmo domínio.

- MonitorApp (DOM e Storage).
- InvestApp (Fetch e API).

---

## O Evento `storage`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
window.addEventListener('storage', (event) => {
  console.log(`A chave ${event.key} foi alterada!`);
  console.log(`Valor antigo: ${event.oldValue}`);
  console.log(`Novo valor: ${event.newValue}`);
});
```

---

## Quando usar, e quando não usar?

O Web Storage é síncrono, guarda apenas strings e tem cota de poucos megabytes por origem.

- **Preferência simples que deve sobreviver ao fecha**: Persiste por origem, sem data de validade.
- **Rascunho válido apenas enquanto a aba estiver ab**: Some sozinho, sem código de limpeza.
- **Credencial de sessão**: O JavaScript não deve conseguir ler o valor.
- **Coleção grande, busca por índice ou dados binári**: Assíncrono e sem o teto de poucos megabytes.
- **Cache de respostas HTTP**: Guarda a resposta inteira, com cabeçalhos e status.

---

## Executando

1. Abra o navegador com <kbd>F12</kbd> e clique na aba Aplicação (ou Storage no Firefox).
2. Expanda o menu Local Storage e clique na URL do domínio atual.
3. No console, execute: `localStorage.setItem('usuario', JSON.stringify({ nome: 'DevLab' }));`.
4. Observe a nova chave `usuario` aparecer instantaneamente no painel visual da aba Aplicação.

---

## Exercício Prático

1. Qual a diferença fundamental de persistência entre `localStorage` e `sessionStorage`?
2. Por que a chamada `localStorage.setItem('usuario', { nome: 'Ana' })` resulta em um erro de gravação sem utilidade? Como corrigir?
3. O evento `storage` é disparado na mesma aba onde a alteração foi realizada?
4. O `localStorage` mantém os dados gravados no disco do usuário indefinidamente, mesmo após fechar o navegador.
5. Porque a Web Storage API converte tudo para string por padrão.

---

## Desafio

Crie uma função `salvarHistoricoBusca(termo)` que mantenha um array dos últimos 5 termos pesquisados no `localStorage` sob a chave.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Qual exceção é lançada pelo navegador quando o limite de cota do `localStorage` é ultrapassado?
2. Como verificar quantas chaves estão atualmente gravadas no `localStorage`?
3. Por que é obrigatório serializar objetos JavaScript com `JSON.stringify()` antes de gravá-los no `localStorage`?
4. Em quais janelas o evento `'storage'` é disparado quando um dado é gravado no `localStorage`?

---

## Resumo do Tópico

- **Comparativo de Armazenamento no Navegador**: revise o papel desse eixo no uso da API.
- **A Web Storage API**: revise o papel desse eixo no uso da API.
- **Comportamento de Conversão e Valores Ausentes**: revise o papel desse eixo no uso da API.
- **Serialização de Objetos com JSON**: revise o papel desse eixo no uso da API.
- **Exemplo Prático com Interface**: revise o papel desse eixo no uso da API.
