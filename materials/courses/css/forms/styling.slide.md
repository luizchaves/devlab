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
title: "CSS: Estilização de Formulários e Estados"
description: "Estilização de controles de formulário, reset de campos, pseudo-classes :valid, :invalid, :focus-visible e customização de botões."
---

<!-- _class: lead -->

# Estilização de Formulários e Estados

Design de formulários modernos: reset de marcação nativa, pseudo-classes de validação (`:invalid`, `:valid`, `:required`) e foco acessível com `:focus-visible`.

---

## Objetivos

Criar formulários bonitos, acessíveis e interativos:

- Normalizar e estilizar campos de entrada (`<input>`, `<select>`, `<textarea>`).
- Fornecer feedback visual em tempo real com **`:valid`** e **`:invalid`**.
- Garantir acessibilidade com **`:focus-visible`**.
- Customizar botões com estados `:hover`, `:active` e `:disabled`.

---

## Reset de Estilos de Campos

Navegadores possuem estilos padrão inconsistentes para controles de formulário. O reset garante consistência visual:

```css
input, select, textarea, button {
  font-family: inherit;
  font-size: 1rem;
  color: inherit;
}

input[type="text"],
input[type="email"],
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #ffffff;
}
```

---

## Foco Acessível (`:focus` vs `:focus-visible`)

- **`:focus`**: Ativado em qualquer clique ou navegação.
- **`:focus-visible`**: Ativado **apenas quando o usuário navega via teclado** (<kbd>Tab</kbd>), evitando anéis de foco indesejados ao clicar com o mouse.

```css
/* Remove outline feio do clique, mas preserva para teclado */
input:focus { outline: none; }

input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

---

## Feedback de Validação Nativa (`:valid` & `:invalid`)

```css
/* Destaca erro quando o campo preenchido for inválido */
input:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
}

input:valid:not(:placeholder-shown) {
  border-color: #10b981;
}

/* Botão desabilitado */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Exercício Prático & Desafio

- **Exercício**: Crie um estilo para campos de input com borda `#d1d5db` e altere a borda para `#2563eb` no `:focus-visible`.
- **Desafio Extra**: Use `:invalid:not(:placeholder-shown)` para exibir uma borda vermelha suave em um campo de e-mail mal formatado.

---

## Resumo & Revisão

- Sempre herde `font-family` em inputs e botões.
- **Nunca remova `:focus` sem fornecer uma alternativa clara com `:focus-visible`**.
- Estilize o estado **`:disabled`** para indicar que a ação não está disponível.

---

## Referências & Links Úteis

- **MDN Web Docs**: [Styling Web Forms](https://developer.mozilla.org/pt-BR/docs/Learn/Forms/Styling_web_forms)
- **MDN Web Docs**: `:focus-visible` [Pseudo-class](https://developer.mozilla.org/pt-BR/docs/Web/CSS/:focus-visible)
