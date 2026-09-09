---
title: 'Web APIs: Geolocation API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Geolocation API

## Ideia Central
- **Papel**: Localização aproximada no navegador com navigator.geolocation, getCurrentPosition, watchPosition, permissões e tratamento de erro
- **Contexto**: A Geolocation API permite consultar a localização aproximada do dispositivo. Ela pode combinar GPS, Wi-Fi, rede móvel e endereço IP, dependendo do navegador e do aparelho
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Uma resposta aproximada e opcional
- **Ideia**: Duas características separam a Geolocation API de quase tudo que o navegador oferece
- **Detalhe**: A primeira é que a resposta é opcional: o usuário pode recusar, e a recusa é definitiva até que ele mesmo mude a configuração do site

## Modelo da API
- **Ideia**: A API fica em `navigator
- **Detalhe**: geolocation` e trabalha com callbacks, não com Promise nativa

## Exemplo com preview e código
- **Ideia**: O exemplo importado mostra solicitação de localização e tratamento de erro quando a permissão é negada ou a posição não pode ser obtida
- **Detalhe**: Prévia HTML interativa disponível na página do tópico

## Cuidados práticos
- **Ideia**: Localização pode falhar por decisão do usuário, bloqueio do navegador, ausência de sinal ou política de contexto seguro

## Quando usar, e quando não usar?
- **Ideia**: Pedir localização tem um custo que não aparece no código: um usuário que recusa hoje continua recusando amanhã, porque o navegador guarda a decisão
- **Detalhe**: Por isso a pergunta certa antes de chamar a API é se o pedido faz sentido naquele momento da interação

## Executando
- **Ideia**: Os passos abaixo pedem que você aceite e recuse a permissão, porque os dois fluxos precisam ter retorno na tela: Abra o exemplo `geolocation
- **Detalhe**: html` em uma aba própria
- **Ponto**: Abra o exemplo `geolocation.html` em uma aba própria
- **Ponto**: Clique no botão de localização
- **Ponto**: Aceite ou negue a permissão para comparar os dois fluxos
- **Ponto**: Observe se o código mostra mensagem útil para sucesso e erro

## Exercício
- **Ideia**: Os itens abaixo tornam a resposta honesta para o usuário, mostrando a margem de erro e oferecendo alternativa manual: Mostre a precisão (`coords
- **Detalhe**: accuracy`) junto das coordenadas
- **Ponto**: Mostre a precisão (`coords.accuracy`) junto das coordenadas
- **Ponto**: Adicione uma opção de fallback para o usuário digitar a cidade
- **Ponto**: Configure um timeout de 10 segundos

## Perguntas de revisão
- **Ideia**: Responda às questões a seguir para avaliar a compreensão sobre leitura de coordenadas, tratamento de erros e permissões na Geolocation API
- **Ponto**: Por que `coords.accuracy` deve aparecer na interface junto das coordenadas?
- **Ponto**: Por que a API usa callbacks em vez de devolver uma Promise?
- **Ponto**: Quais são os três desfechos possíveis do callback de erro?
- **Ponto**: O que a opção `timeout` controla?
### Resposta e erro
- **Ideia**: Questões sobre o modelo assíncrono e tratamento de falhas: Por que `coords
- **Ponto**: Por que `coords.accuracy` deve aparecer na interface junto das coordenadas?
- **Ponto**: Por que a API usa callbacks em vez de devolver uma Promise?
### Permissão e uso responsável
- **Ideia**: Questões sobre boas práticas de solicitação e contexto de uso: O que acontece com um pedido recusado uma vez?
- **Ponto**: O que acontece com um pedido recusado uma vez?
- **Ponto**: Por que pedir localização no carregamento da página é uma má prática?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
