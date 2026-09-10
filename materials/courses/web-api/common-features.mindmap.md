---
title: 'Web APIs: O que uma Aplicação Front-end Faz?'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: O que uma Aplicação Front-end Faz?

## Ideia Central
- **Papel**: Mapa das funcionalidades mais comuns de uma aplicação web vanilla (eventos, carregamento dinâmico, rolagem, validação de formulário, persistência e navegação) e a Web API que resolve cada uma
- **Contexto**: Aplicações web diferentes repetem as mesmas tarefas: reagir a um clique, buscar dados de um servidor, montar uma lista, validar um formulário, lembrar de uma preferência. Este tópico percorre essas tarefas na ordem em que aparecem em um projeto e diz, para cada uma, qual Web API resolve e onde ela é estudada em profundidade no guia
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O mapa por funcionalidade
- **Ideia**: Ao projetar ou construir uma aplicação front-end, o desenvolvedor pensa em termos de necessidades de negócio e funcionalidades para o usuário: *"preciso persistir o tema escolhido"*, *"preciso buscar dados sem recarregar a tela"*, *"preciso validar o e-mail antes do envio"*, *"preciso alertar o usuário mesmo com a aba em segundo plano"*
- **Detalhe**: O navegador, por outro lado, expõe essas capacidades por meio de Web APIs nativas (`localStorage`, `fetch()`, Constraint Validation, `Notification`)
- **Ponto**: W3C (World Wide Web Consortium): Define padrões essenciais de acessibilidade (ARIA), arquitetura web, segurança e integração com dispositivos
- **Ponto**: WHATWG (Web Hypertext Application Technology Working Group): Mantém os padrões vivos (*Living Standards*) do HTML, da manipulação da árvore DOM e da Fetch API
- **Ponto**: TC39 / Ecma International: Padroniza as regras da linguagem JavaScript (ECMAScript) e seus tipos nativos
- **Ponto**: IETF (Internet Engineering Task Force): Normatiza protocolos de rede subjacentes como HTTP, HTTPS e WebSockets
### Estrutura, interação e formulários
- **Ideia**: É o grupo que sustenta todos os outros
### Dados e comunicação
- **Ideia**: Assim que a página deixa de ter os dados dentro do HTML, este grupo entra
### Estado, navegação e renderização
- **Ideia**: Este grupo responde por tudo que precisa sobreviver a um clique, a um recarregamento ou a uma troca de tela: A última linha é a que costuma pegar de surpresa quem sai do JavaScript puro para um framework: todo acesso a `window`, `document` ou `localStorage` escrito nas linhas acima quebra quando o mesmo componente executa no Node
### Interface, avisos e transferência
- **Ideia**: São as APIs que o usuário percebe diretamente
### Mídia, voz e dispositivo
- **Ideia**: O grupo menos usado, e o que mais depende de permissão e de suporte do aparelho
### Observação e desempenho
- **Ideia**: O último grupo entra quando a aplicação cresce e a interface começa a engasgar: As duas últimas linhas estão em ordem de tentativa, e não de preferência: o worker resolve o problema de a tela travar, e o WebAssembly resolve o de a conta ser lenta
### Como ler o mapa?
- **Ideia**: Somando os seis grupos, o guia cobre 33 páginas de conteúdo

## Funcionalidades Recorrentes em Código
- **Ideia**: A seguir, analisamos a implementação prática das tarefas mais recorrentes em aplicações front-end vanilla, com trechos mínimos de código, alternativas nativas e um exemplo integrador que reúne esses padrões
- **Ponto**: Manipulação de classes via `classList` (Abordagem recomendada): O JavaScript não deve conter valores de cores, sombras ou espaçamentos embutidos em strings. Em vez disso, o design mora no CSS em classes semânticas (`.ativo`, `.oculto`, `.erro`, `.tema-escuro`), e o script apenas alterna essas classes no elemento:
- **Ponto**: Estilos inline e Variáveis CSS via `element.style`: Usado quando o valor visual é estritamente dinâmico e calculado em tempo de execução pela lógica do script (como porcentagem de uma barra de progresso, coordenadas em drag-and-drop ou temas customizados via CSS Custom Properties):
### Reagir ao que o usuário faz
- **Ideia**: Toda interatividade começa no mesmo ponto: um ouvinte registrado em um elemento, que executa uma função quando algo acontece
### Configurar ações via atalho de teclado
- **Ideia**: Interceptação de atalhos globais com `keydown` e teclas modificadoras (`ctrlKey`, `metaKey`, `event.key`)
### Carregar conteúdo dinâmico
- **Ideia**: Poucas aplicações nascem com os dados dentro do HTML
- **Estático**: documentação, página institucional ou artigo com HTML pronto
- **Dinâmico**: feed, painel, busca ou carrinho com dados após a carga inicial
### Montar e atualizar a tela
- **Ideia**: Com os dados em mãos, a próxima tarefa é transformá-los em elementos
### Alterar estilos e classes (CSS via JavaScript)
- **Ideia**: Atualizar o aspecto visual de elementos em resposta a ações do usuário é indispensável em qualquer interface
- **Ponto**: Manipulação de classes via `classList` (Abordagem recomendada): O JavaScript não deve conter valores de cores, sombras ou espaçamentos embutidos em strings. Em vez disso, o design mora no CSS em classes semânticas (`.ativo`, `.oculto`, `.erro`, `.tema-escuro`), e o script apenas alterna essas classes no elemento:
- **Ponto**: Estilos inline e Variáveis CSS via `element.style`: Usado quando o valor visual é estritamente dinâmico e calculado em tempo de execução pela lógica do script (como porcentagem de uma barra de progresso, coordenadas em drag-and-drop ou temas customizados via CSS Custom Properties):
### Validar um formulário
- **Ideia**: Validação é a funcionalidade em que mais se escreve código desnecessário
### Reagir à rolagem e ao tamanho
- **Ideia**: Rolagem é a área em que a solução antiga e a moderna mais divergem
### Lembrar do usuário entre visitas
- **Ideia**: Uma aplicação que esquece tudo a cada recarregamento parece quebrada
### Trocar de tela sem recarregar
- **Ideia**: Assim que a aplicação tem mais de uma tela, surge a pergunta de como trocar entre elas mantendo a URL compartilhável

## Executando
- **Ideia**: Os passos abaixo percorrem as cinco funcionalidades na ordem em que o usuário as encontra: Entre na pasta do exemplo, em `examples/courses/web-api/common-features/`
- **Detalhe**: Sirva a pasta por HTTP, porque o `fetch()` do JSON não funciona a partir de `file://`: Abra o endereço informado
- **Ponto**: Entre na pasta do exemplo, em `examples/courses/web-api/common-features/`
- **Ponto**: Sirva a pasta por HTTP, porque o `fetch()` do JSON não funciona a partir de `file://`:
- **Ponto**: Abra o endereço informado. A primeira carga vem do arquivo JSON, e o parágrafo de status diz isso
- **Ponto**: Envie o formulário vazio e observe a mensagem: ela foi escrita pelo navegador, não pela página

## Exercício
- **Ideia**: Os itens abaixo acrescentam ao exemplo funcionalidades que aparecem na tabela do início do tópico: Mostre o total investido, somando os valores e formatando com `toLocaleString`
- **Detalhe**: Acrescente um campo de busca que filtre a lista enquanto o usuário digita
- **Ponto**: Mostre o total investido, somando os valores e formatando com `toLocaleString`
- **Ponto**: Acrescente um campo de busca que filtre a lista enquanto o usuário digita
- **Ponto**: Impeça o cadastro de um nome já existente usando `setCustomValidity()`
- **Ponto**: Adicione um botão que copie o resumo da carteira com a Clipboard API

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre o panorama geral de APIs do navegador e decisões de arquitetura front-end:
- **Ponto**: Qual API sustenta praticamente todas as outras funcionalidades desta página?
- **Ponto**: Por que `IntersectionObserver` substituiu o ouvinte de `scroll` em rolagem infinita?
- **Ponto**: Onde deve ficar um token de sessão, e por quê?
- **Ponto**: O que a History API exige do servidor para funcionar?
### Escolha da API
- **Ideia**: As questões a seguir avaliam a identificação da Web API nativa adequada para cada funcionalidade: Qual API sustenta praticamente todas as outras funcionalidades desta página?
- **Ponto**: Qual API sustenta praticamente todas as outras funcionalidades desta página?
- **Ponto**: Por que `IntersectionObserver` substituiu o ouvinte de `scroll` em rolagem infinita?
### Plataforma antes do código
- **Ideia**: As questões a seguir avaliam o aproveitamento de recursos nativos da plataforma web antes de criar código JavaScript: O que a Constraint Validation API entrega que uma cadeia de `if` não entrega?
- **Ponto**: O que a Constraint Validation API entrega que uma cadeia de `if` não entrega?
- **Ponto**: Para que serve o `FormData` no envio de um formulário?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
