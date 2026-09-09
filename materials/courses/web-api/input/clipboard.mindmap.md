---
title: 'Web APIs: Clipboard API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Clipboard API

## Ideia Central
- **Papel**: Leitura e escrita na área de transferência com navigator.clipboard, permissões, contexto seguro e gesto do usuário
- **Contexto**: A Clipboard API permite copiar e ler texto da área de transferência pelo navegador. Como a área de transferência pertence ao sistema operacional e pode conter dados sensíveis, o acesso é deliberadamente restrito
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Por que copiar exige permissão?
- **Ideia**: A área de transferência é um espaço compartilhado por todos os programas do sistema
- **Detalhe**: Nela passam senhas coladas de um gerenciador, trechos de documentos e números de cartão

## Modelo da API
- **Ideia**: A interface principal fica em `navigator
- **Detalhe**: clipboard`

## Exemplo com preview e código
- **Ideia**: O exemplo importado mostra a escrita e a leitura do clipboard acionadas por botões
- **Detalhe**: Prévia HTML interativa disponível na página do tópico

## Cuidados práticos
- **Ideia**: Em ambientes de aula, o preview em iframe pode bloquear operações que funcionam quando o arquivo é aberto em uma aba própria

## Quando usar, e quando não usar?
- **Ideia**: A Clipboard API resolve um caso estreito, o de copiar um valor que o usuário não conseguiria selecionar com facilidade
- **Detalhe**: Fora dele, a seleção manual do texto costuma ser mais confiável, porque não depende de permissão nenhuma

## Executando
- **Ideia**: Os passos abaixo exercitam os dois desfechos da API, o de permissão concedida e o de permissão negada: Abra o exemplo `clipboard
- **Detalhe**: html` pelo link do preview
- **Ponto**: Abra o exemplo `clipboard.html` pelo link do preview
- **Ponto**: Clique no botão de copiar
- **Ponto**: Cole em outro campo para confirmar o texto copiado
- **Ponto**: Teste a leitura e observe se o navegador pede permissão ou bloqueia a chamada

## Exercício
- **Ideia**: Os itens ampliam o exemplo e exigem que a falha continue tendo retorno visível na tela: Adicione um campo para o usuário escolher o texto copiado
- **Detalhe**: Mostre uma mensagem de sucesso apenas depois que `writeText()` resolver
- **Ponto**: Adicione um campo para o usuário escolher o texto copiado
- **Ponto**: Mostre uma mensagem de sucesso apenas depois que `writeText()` resolver
- **Ponto**: Crie uma mensagem específica para erro de permissão

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre permissões, contexto seguro e operações na área de transferência com a Clipboard API:
- **Ponto**: Por que a leitura do clipboard é mais restrita que a escrita?
- **Ponto**: O que significa "contexto seguro" no contexto desta API?
- **Ponto**: Por que a cópia falha quando disparada por um `setTimeout()` longo após o clique?
- **Ponto**: O que acontece se a página não estiver em foco no momento da chamada?
### Permissão e contexto
- **Ideia**: As questões a seguir avaliam requisitos de segurança, foco de janela e ativação do usuário: Por que a leitura do clipboard é mais restrita que a escrita?
- **Ponto**: Por que a leitura do clipboard é mais restrita que a escrita?
- **Ponto**: O que significa "contexto seguro" no contexto desta API?
### Tratamento e alternativas
- **Ideia**: As questões a seguir avaliam o tratamento assíncrono e a cópia de formatos ricos: Por que `writeText()` devolve uma Promise em vez de um valor imediato?
- **Ponto**: Por que `writeText()` devolve uma Promise em vez de um valor imediato?
- **Ponto**: O que o usuário percebe quando a rejeição não é tratada?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
