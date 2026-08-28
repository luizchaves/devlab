---
title: 'HTML: Estrutura de Formulários e Controles'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Formulários e Controles

## 1. Estrutura Base (`<form>`)
- **`action`**: URL do backend.
- **`method`**: Método HTTP (`GET` / `POST`).
- **`name`**: Nome da chave de dado no envio.

## 2. Rótulos (`<label>`)
- **Atributo `for`**: Ligado ao `id` do `<input>`.
- **Acessibilidade**: Leitura por leitores de tela + clique expandido.

## 3. Tipos de Controles (`<input>`)
- **Linha Única**: `text`, `email`, `password`, `number`.
- **Seleções**:
  - `checkbox`: Múltiplas marcas.
  - `radio`: Marca única no grupo (mesmo `name`).
- **Multilinha**: `<textarea>`.
- **Lista Dropdown**: `<select>` + `<option>`.
- **Ação**: `<button type="submit">`.

## 4. Validação Nativa
- **`required`**: Campo obrigatório.
- **`placeholder`**: Dica de preenchimento.
- **`min` / `max` / `pattern`**: Restrições de valores e expressões.
