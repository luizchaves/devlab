---
title: 'Web APIs: Formulários e Validação'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Formulários e Validação

## Ideia Central
- **Papel**: Constraint Validation API, FormData e os seletores de estado: regras declaradas no HTML, mensagens traduzidas pelo navegador e leitura dos campos sem um querySelector por campo
- **Contexto**: Formulário é a principal porta de entrada de dados de uma aplicação web, e é também onde mais se escreve código desnecessário. O navegador já sabe validar campo obrigatório, formato de e-mail, tamanho mínimo e padrão de texto, e já traduz as mensagens para o idioma do usuário. Este tópico mostra como usar esse mecanismo em vez de reconstruí-lo
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Onde a validação acontece?
- **Ideia**: Existem três lugares possíveis para uma regra de formulário, e eles não são alternativas: são camadas que se somam
- **Detalhe**: Confundi-los produz os dois erros clássicos do assunto, o de validar só no cliente e o de reimplementar no cliente o que o HTML já faz

## Restrições declaradas no HTML
- **Ideia**: Antes de qualquer linha de JavaScript, os atributos do próprio campo já descrevem o que é aceito
- **Detalhe**: O navegador impede o envio, marca o campo e escreve a mensagem, tudo sem código

## Consultando o estado pela Constraint Validation API
- **Ideia**: Com as regras declaradas, o JavaScript precisa de três informações: se o formulário está válido, qual restrição falhou e qual mensagem exibir
- **Detalhe**: A Constraint Validation API entrega as três

## Regras que o HTML não expressa
- **Ideia**: Nem toda regra cabe em um atributo
- **Detalhe**: "As duas senhas precisam coincidir", "a data final é posterior à inicial" e "este nome já existe" dependem de outros campos ou de dados que só o JavaScript conhece

## Lendo os campos com `FormData`
- **Ideia**: Depois de validado, o formulário precisa virar dado
- **Detalhe**: `FormData` lê todos os campos pelo atributo `name`, sem um `querySelector` por campo e sem esquecer nenhum quando um campo novo é acrescentado ao HTML

## Estilizando o campo com erro
- **Ideia**: O CSS enxerga o estado de validação sem ajuda do JavaScript, e a escolha do seletor decide se a página parece hostil ou prestativa
- **Detalhe**: A tabela compara os três seletores disponíveis: A segunda linha é a recomendação atual

## Quando usar, e quando não usar?
- **Ideia**: A validação nativa cobre a maior parte dos formulários de uma aplicação
- **Detalhe**: A pergunta prática é em que ponto ela deixa de bastar e uma biblioteca passa a valer a dependência

## Executando
- **Ideia**: Os passos abaixo percorrem cada camada da validação na ordem em que o usuário a encontra: Entre na pasta do exemplo, em `examples/courses/web-api/forms/`, e sirva-a por HTTP: Clique em Cadastrar com o formulário vazio
- **Detalhe**: As mensagens vêm do navegador, no idioma dele
- **Ponto**: Entre na pasta do exemplo, em `examples/courses/web-api/forms/`, e sirva-a por HTTP:
- **Ponto**: Clique em Cadastrar com o formulário vazio. As mensagens vêm do navegador, no idioma dele
- **Ponto**: Digite `ab` no nome e saia do campo. A mensagem agora é a de `minlength`, não a de `required`
- **Ponto**: Digite um e-mail sem `@`. Compare a mensagem com a do campo de telefone, que foi personalizada

## Exercício
- **Ideia**: Os itens abaixo ampliam o formulário e exercitam as três camadas vistas até aqui: Acrescente um campo de data de nascimento que recuse datas futuras com `max`
- **Detalhe**: Exiba um contador de caracteres restantes usando `maxlength` e o evento `input`
- **Ponto**: Acrescente um campo de data de nascimento que recuse datas futuras com `max`
- **Ponto**: Exiba um contador de caracteres restantes usando `maxlength` e o evento `input`
- **Ponto**: Troque a mensagem de `type="email"` por uma redação própria, sem afetar as demais restrições
- **Ponto**: Impeça o envio enquanto um campo de aceite de termos não estiver marcado

## Desafio
- **Ideia**: Implemente a verificação de disponibilidade de e-mail contra uma API, sem sair do mecanismo nativo
- **Detalhe**: O campo deve consultar o servidor enquanto o usuário digita e recusar um endereço já cadastrado, com a mesma aparência dos demais erros

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre a Constraint Validation API, validação declarativa e submissão com `FormData`:
- **Ponto**: O que o atributo `novalidate` desliga, e o que ele mantém?
- **Ponto**: Qual a diferença entre `checkValidity()` e `reportValidity()`?
- **Ponto**: Para que serve o objeto `validity` se `validationMessage` já traz o texto?
- **Ponto**: Por que `minlength` pode não bloquear um valor definido por script?
### Restrições e estado
- **Ideia**: As questões a seguir avaliam o comportamento de validação nativa do navegador e estados de formulário: O que o atributo `novalidate` desliga, e o que ele mantém?
- **Ponto**: O que o atributo `novalidate` desliga, e o que ele mantém?
- **Ponto**: Qual a diferença entre `checkValidity()` e `reportValidity()`?
### Regras próprias e envio
- **Ideia**: As questões a seguir avaliam validações customizadas via JavaScript e extração de dados do formulário: O que acontece quando `setCustomValidity()` é chamado com uma mensagem e nunca com string vazia?
- **Ponto**: O que acontece quando `setCustomValidity()` é chamado com uma mensagem e nunca com string vazia?
- **Ponto**: Que vantagem `FormData` tem sobre ler cada campo com `querySelector`?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
