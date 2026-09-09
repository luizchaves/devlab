---
title: 'Web APIs: Web Speech API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Web Speech API

## Ideia Central
- **Papel**: Síntese e reconhecimento de fala no navegador com speechSynthesis, SpeechSynthesisUtterance e interfaces relacionadas
- **Contexto**: A Web Speech API expõe recursos de fala para JavaScript. Ela possui duas áreas: síntese de fala, em que o navegador lê texto em voz alta, e reconhecimento de fala, em que áudio do usuário pode ser transformado em texto quando suportado
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Duas metades independentes
- **Ideia**: O nome "Web Speech API" cobre duas especificações que só têm em comum o assunto
- **Detalhe**: Uma transforma texto em som e roda inteiramente no aparelho; a outra transforma som em texto e, na maior parte dos navegadores, envia o áudio para um serviço remoto

## Modelo da API
- **Ideia**: O exemplo deste tópico usa síntese de fala, que é a parte mais direta para demonstrar em sala
- **Detalhe**: As vozes disponíveis dependem do sistema operacional, do navegador e do idioma instalado

## Exemplo com preview e código
- **Ideia**: O exemplo importado permite digitar um texto, escolher parâmetros de voz e acionar a síntese
- **Detalhe**: Prévia HTML interativa disponível na página do tópico

## Cuidados práticos
- **Ideia**: Fala pode ser recurso de acessibilidade, feedback ou experiência multimodal, mas não deve substituir texto visível

## Quando usar, e quando não usar?
- **Ideia**: Som é um canal invasivo: ele não pode ser ignorado com o canto do olho e atrapalha quem está em ambiente compartilhado
- **Detalhe**: A síntese de fala se justifica quando o usuário pediu por ela ou quando os olhos estão ocupados com outra coisa

## Executando
- **Ideia**: Os passos abaixo variam as propriedades do enunciado para tornar audível o efeito de cada uma: Abra o exemplo `speech
- **Detalhe**: html`
- **Ponto**: Abra o exemplo `speech.html`
- **Ponto**: Digite uma frase curta
- **Ponto**: Altere velocidade e tom
- **Ponto**: Teste cancelar a fala enquanto ela está em execução

## Exercício
- **Ideia**: Os itens variam as propriedades do enunciado e tratam a lista de vozes carregada de forma assíncrona: Adicione um botão para preencher uma frase de exemplo
- **Detalhe**: Mostre quantas vozes foram carregadas
- **Ponto**: Adicione um botão para preencher uma frase de exemplo
- **Ponto**: Mostre quantas vozes foram carregadas
- **Ponto**: Impeça `speak()` quando o texto estiver vazio

## Perguntas de revisão
- **Ideia**: Responda às questões a seguir para avaliar a compreensão sobre síntese de fala, carregamento de vozes e reconhecimento de áudio
- **Ponto**: Qual o papel do objeto `SpeechSynthesisUtterance`?
- **Ponto**: Por que alterar `rate` depois de `speak()` não muda a fala em andamento?
- **Ponto**: Por que `speechSynthesis.getVoices()` pode devolver um array vazio na primeira chamada?
- **Ponto**: Como interromper uma fala em andamento?
### Síntese
- **Ideia**: Questões sobre controle de reprodução, parâmetros e eventos de voz: Qual o papel do objeto `SpeechSynthesisUtterance`?
- **Ponto**: Qual o papel do objeto `SpeechSynthesisUtterance`?
- **Ponto**: Por que alterar `rate` depois de `speak()` não muda a fala em andamento?
### Reconhecimento e escolha
- **Ideia**: Questões sobre limitações de plataforma, acessibilidade e privacidade: Por que o suporte ao reconhecimento é muito menor que o da síntese?
- **Ponto**: Por que o suporte ao reconhecimento é muito menor que o da síntese?
- **Ponto**: Que implicação de privacidade o reconhecimento traz?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
