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
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "HTML: Estrutura de Formulários e Controles"
description: "Criação de formulários interativos com form, rótulos label, campos input, textarea, select e validação nativa."
---

<!-- _class: lead -->

# Formulários e Controles

Coleta interativa de dados em HTML: `<form>`, `<label>`, `<input>`, `<textarea>`, `<select>`, `<button>` e atributos de validação nativa.

---

## Objetivos

Dominar a construção de formulários interativos em HTML:

- Compreender a anatomia do elemento **`<form>`**.
- Associar rótulos **`<label>`** a campos através de `id` e `for`.
- Utilizar os diferentes tipos de **`<input>`** (`text`, `email`, `password`, `number`, `checkbox`, `radio`).
- Aplicar atributos de validação nativa (`required`, `placeholder`, `pattern`).

---

## Por Que Isso Importa?

- **Interatividade & Coleta**: Formulários são o único meio nativo do usuário enviar dados ao sistema (login, cadastro, busca).
- **Acessibilidade (a11y)**: Leitores de tela anunciam o campo correto ao focar apenas quando ele possui `<label>` associado.
- **Validação Nativa**: O navegador valida campos obrigatórios e formatos antes de enviar ao servidor sem necessitar de JS extra.

---

## Anatomia de um Formulário

```html
<form action="/api/login" method="POST">
  <div>
    <label for="email">E-mail:</label>
    <input type="email" id="email" name="email" required placeholder="seu@email.com">
  </div>

  <div>
    <label for="senha">Senha:</label>
    <input type="password" id="senha" name="senha" required>
  </div>

  <button type="submit">Entrar</button>
</form>
```

- **`action`**: URL de destino no servidor.
- **`method`**: Método HTTP (`GET` ou `POST`).

---

## Rótulos (`<label for="...">`)

- O atributo **`for`** do `<label>` DEVE corresponder exatamente ao **`id`** do `<input>`.
- **Benefícios**:
  1. Aumenta a área de clique (clicar no texto foca o campo).
  2. Permite que leitores de tela leiam o nome do campo ao focar.

```html
<label for="nome">Nome Completo:</label>
<input type="text" id="nome" name="nome">
```

---

## Tipos Principais de `<input>`

| Atributo `type` | Finalidade | Comportamento no Navegador |
| --- | --- | --- |
| `text` | Texto simples | Campo de linha única padrão |
| `email` | Endereço de e-mail | Valida formato `@` e abre teclado com `@` em celulares |
| `password` | Senha | Oculta caracteres com asterisco/ponto |
| `number` | Valores numéricos | Limita entrada e exibe botões `min` / `max` |
| `checkbox` | Múltipla escolha | Caixa de seleção ligada/desligada |
| `radio` | Escolha única | Seleção exclusiva em um grupo com o mesmo `name` |

---

## Textarea, Select e Button

- **`<textarea>`**: Campo de texto com múltiplas linhas para mensagens ou comentários.
- **`<select>` & `<option>`**: Menu suspenso de seleção.
- **`<button type="submit">`**: Botão de disparo do formulário.

```html
<label for="estado">Estado:</label>
<select id="estado" name="estado">
  <option value="PB">Paraíba</option>
  <option value="SP">São Paulo</option>
</select>
```

---

## Exercício Prático & Desafio

- **Exercício**: Crie um formulário de contato contendo campos de Nome (`text`), E-mail (`email`) e Mensagem (`textarea`) com rótulos `<label>` e validação `required`.
- **Desafio Extra**: Adicione duas opções de rádio (`<input type="radio">`) com o mesmo atributo `name` para que o usuário selecione a forma preferida de contato (E-mail ou WhatsApp).

---

## Resumo & Revisão

- Todo campo de formulário **DEVE** ter um `<label>` associado (`for="id"`).
- Atributos **`name`** são indispensáveis para envio dos dados ao backend.
- Use os tipos corretos de `type="..."` para obter validação gratuita e teclados móveis adequados.
- Use **`<button type="submit">`** para submeter formulários.

---

## Referências & Links Úteis

- **MDN Web Docs**: [Form Content](https://developer.mozilla.org/pt-BR/docs/Learn/Forms)
- **MDN Web Docs**: [The HTML `<input>` Element](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input)
