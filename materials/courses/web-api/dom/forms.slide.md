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
title: "Web APIs: Formulários e Validação"
description: "Slides completos do tópico Web APIs: Formulários e Validação."
---

<!-- _class: lead -->

# Web APIs: Formulários e Validação

Onde a validação acontece? · Restrições declaradas no HTML · Consultando o estado pela Constraint Validation API · Regras que o HTML não expressa

---

## Objetivo

- Declarar restrições no HTML com `required`, `minlength`, `type`, `pattern` e `min`.
- Consultar o estado do formulário com `checkValidity()`, `reportValidity()` e o objeto `validity`.
- Exibir a mensagem já traduzida em `validationMessage` no lugar certo da interface.
- Acrescentar regras próprias com `setCustomValidity()` sem abandonar o mecanismo nativo.
- Ler todos os campos de uma vez com `FormData` e enviá-los como JSON.
- Diferenciar `:invalid` de `:user-invalid` ao estilizar campos com erro.

---

## Mapa do Tópico

- **Onde a validação acontece?**.
- **Restrições declaradas no HTML**.
- **Consultando o estado pela Constraint Validation API**.
- **Regras que o HTML não expressa**.
- **Lendo os campos com `FormData`**.
- **Estilizando o campo com erro**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Onde a validação acontece?

Existem três lugares possíveis para uma regra de formulário, e eles não são alternativas: são camadas que se somam.

- Confundi-los produz os dois erros clássicos do assunto, o de validar só no cliente e o de reimplementar no cliente o que o HTML já faz.
- A seta final é a que importa mais.
- Tudo que acontece no navegador é conveniência para o usuário: qualquer pessoa pode enviar uma requisição direta à API.

---

## Restrições declaradas no HTML

Antes de qualquer linha de JavaScript, os atributos do próprio campo já descrevem o que é aceito.

- **`required`**: Vale também para `checkbox` e `select`.
- **`type="email"`**: Verifica o formato, não a existência do endereço.
- **`type="number"` com `min` e `max`**: Combine com `step` para casas decimais.
- **`minlength` e `maxlength`**: Só valida depois que o usuário digita.
- **`pattern`**: Acompanhe de `title` para explicar o formato.

---

## Consultando o estado pela Constraint Validation API

Com as regras declaradas, o JavaScript precisa de três informações: se o formulário está válido, qual restrição falhou e qual mensagem exibir.

- **`form.checkValidity()`**: Decidir se o envio prossegue.
- **`form.reportValidity()`**: Quando a mensagem padrão do navegador basta.
- **`campo.validity`**: Descobrir qual regra falhou.
- **`campo.validationMessage`**: Exibir ao lado do campo.
- **`campo.setCustomValidity(texto)`**: Acrescentar uma regra própria.

---

## Regras que o HTML não expressa

Nem toda regra cabe em um atributo.

- "As duas senhas precisam coincidir", "a data final é posterior à inicial".
- `setCustomValidity()` resolve esses casos sem abandonar o mecanismo nativo: uma mensagem não vazia torna o campo inválido.
- Código real recortado do projeto de exemplo.

---

## Lendo os campos com `FormData`

Depois de validado, o formulário precisa virar dado.

- `FormData` lê todos os campos pelo atributo `name`, sem um `querySelector` por campo e sem esquecer nenhum.
- Código real recortado do projeto de exemplo.
- fromEntries()`, na linha 15, converte o `FormData` em um objeto comum, pronto para `JSON.

---

## Lendo os campos com `FormData`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
await fetch('/api/usuarios', {
  method: 'POST',
  body: new FormData(form), // o navegador define o Content-Type e o boundary
});
```

---

## Estilizando o campo com erro

O CSS enxerga o estado de validação sem ajuda do JavaScript, e a escolha do seletor decide se a página parece hostil ou prestativa.

- **`:invalid`**: Marca de vermelho todo campo obrigatório ainda vazio.
- **`:user-invalid`**: Não marca nada até a pessoa mexer no campo.
- **`:placeholder-shown`**: Usado para adiar a marcação antes do `:user-invalid`.

---

## Estilizando o campo com erro: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```css
input:user-invalid {
  border-color: crimson;
}
```

---

## Quando usar, e quando não usar?

A validação nativa cobre a maior parte dos formulários de uma aplicação.

- **Cadastro, login, contato, busca**: Cadeia de `if`, que perde tradução e acessibilidade.
- **Regra que depende de outro campo**: Validação paralela, que ignora `:user-invalid`.
- **Regra que depende do servidor, como e-mail já ca**: Bloquear o envio sem explicar o motivo.
- **Formulário com dezenas de campos e regras condic**: Reimplementar dependência entre campos à mão.
- **Qualquer dado que chega ao banco**: Confiar no navegador, que pode ser contornado.

---

## Executando

1. Entre na pasta do exemplo, em `examples/courses/web-api/forms/`, e sirva-a por HTTP.
2. Clique em Cadastrar com o formulário vazio. As mensagens vêm do navegador, no idioma dele.
3. Digite `ab` no nome e saia do campo. A mensagem agora é a de `minlength`, não a de `required`.
4. Digite um e-mail sem `@`. Compare a mensagem com a do campo de telefone, que foi personalizada.

---

## Executando: Comando

```bash
npx serve .
```

---

## Exercício Prático

1. Acrescente um campo de data de nascimento que recuse datas futuras com `max`.
2. Exiba um contador de caracteres restantes usando `maxlength` e o evento `input`.
3. Troque a mensagem de `type="email"` por uma redação própria, sem afetar as demais restrições.
4. Impeça o envio enquanto um campo de aceite de termos não estiver marcado.
5. Faça o botão de envio ficar desabilitado enquanto o formulário estiver inválido.

---

## Desafio

Implemente a verificação de disponibilidade de e-mail contra uma API, sem sair do mecanismo nativo.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. O que o atributo `novalidate` desliga, e o que ele mantém?
2. Qual a diferença entre `checkValidity()` e `reportValidity()`?
3. Para que serve o objeto `validity` se `validationMessage` já traz o texto?
4. Por que `minlength` pode não bloquear um valor definido por script?
5. O que acontece quando `setCustomValidity()` é chamado com uma mensagem e nunca com string vazia?

---

## Resumo do Tópico

- **Onde a validação acontece?**: revise o papel desse eixo no uso da API.
- **Restrições declaradas no HTML**: revise o papel desse eixo no uso da API.
- **Consultando o estado pela Constraint Validation API**: revise o papel desse eixo no uso da API.
- **Regras que o HTML não expressa**: revise o papel desse eixo no uso da API.
- **Lendo os campos com `FormData`**: revise o papel desse eixo no uso da API.
