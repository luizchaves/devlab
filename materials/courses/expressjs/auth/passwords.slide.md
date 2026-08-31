---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Senhas e Hash"
description: "Como guardar senhas com segurança: função de hash, sal, funções de derivação de chave, bcrypt e Argon2, implementação nativa com node:crypto e comparação em tempo constante."
---

<!-- _class: lead -->

# Express.js: Senhas e Hash

Como guardar senhas com segurança: função de hash, sal, funções de derivação de chave, bcrypt e Argon2, implementação nativa com node:crypto e comparação em tempo constante.

---

## Objetivo

- Ao final você entenderá por que uma senha nunca é armazenada, o que sal e custo de computação resolvem, qual a diferença entre uma função de hash e uma...

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/auth`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Objetivo**
- **O que nunca fazer**
- **Hash de mão única**
- **Por que `SHA-256` não basta**
- **O sal**
- **O custo de computação**
- **As três KDFs usadas na prática**
- **Implementando com `node:crypto`**: O formato PHC, Gerando o hash, Verificando

---

## Contexto da Aula

- Antes de escrever a rota de cadastro, é preciso responder a uma pergunta: onde a senha é guardada?
- A resposta certa é em lugar nenhum: o que se guarda é uma prova de que a pessoa a conhece.

---

## O que nunca fazer

- Três abordagens erradas aparecem em ordem crescente de sofisticação, e todas falham:
- Criptografia existe para ser desfeita com a chave certa; hash é de mão única.
- Guardar senha criptografada significa que existe uma chave em algum lugar capaz de revelar todas elas: e essa chave costuma estar no mesmo servidor.

---

## O que nunca fazer: Tabela

- Guardar a senha em texto: um vazamento do banco entrega todas as contas de imediato
- Criptografar a senha: criptografia é reversível: quem tem a chave lê tudo

---

## Hash de mão única

- Uma função de hash transforma qualquer entrada em uma saída de tamanho fixo, sem caminho de volta.
- O servidor guarda o hash e, no login, repete o cálculo e compara:
- O servidor nunca precisa saber a senha: só precisa saber se quem está do outro lado a conhece.
- Por isso um sistema bem construído não consegue enviar sua senha por e-mail; ele só consegue oferecer um link para trocá-la.

---

## Por que `SHA-256` não basta

- O hash resolve a irreversibilidade, mas cria dois problemas novos.
- Primeiro: senhas iguais geram hashes iguais.
- Duas pessoas com a senha `123456` têm o mesmo valor no banco, e uma tabela pré-calculada: *rainbow table*: traduz o hash de volta instantaneamente.
- Segundo: velocidade é uma vantagem do atacante. `SHA-256` foi projetada para ser rápida.
- Uma GPU calcula bilhões por segundo; testar todas as senhas de oito caracteres vira questão de horas.

---

## O sal

- O sal é um valor aleatório gerado por senha, misturado antes do hash e guardado junto dele. Ele resolve o primeiro problema:
- Ele fica em texto claro ao lado do hash: precisa estar, porque é necessário para reconstruir o cálculo na verificação.
- O que ele impede é o pré-cálculo: uma tabela teria de ser refeita para cada sal, e o ataque deixa de ser em massa.

---

## O sal: Exemplo

```txt
senha: "123456"   sal: a3f1…   ->  hash: 9c2b…
senha: "123456"   sal: 7d40…   ->  hash: e18a…
```

---

## O custo de computação

- O segundo problema exige uma função deliberadamente lenta.
- É isso que distingue uma função de hash comum de uma *função de derivação de chave* (KDF): a KDF recebe parâmetros de custo que a tornam cara de calcular.
- Um login que leva 200 ms é imperceptível para o usuário: e transforma um ataque de horas em um ataque de anos.
- A recomendação prática é escolher os parâmetros de modo que um hash leve entre 100 ms e 500 ms na máquina de produção.
- Menos que isso é barato demais para o atacante; muito mais vira negação de serviço na sua própria rota de login.

---

## O custo de computação: Tabela

- Iterações: tempo de CPU | qualquer hardware
- Memória: RAM necessária por cálculo | GPU e ASIC, que têm pouca RAM
- Paralelismo: threads usadas | ajusta o custo ao servidor

---

## As três KDFs usadas na prática

- Praticamente todo código Express que você vai encontrar usa `bcrypt.hash` e `bcrypt.compare`.
- Entender o que essas duas linhas fazem: sal embutido, custo em `saltRounds`, comparação: é o que permite ler esse código e decidir conscientemente usar...
- O `bcrypt` embute sal e custo no próprio resultado:
- A limitação do `bcrypt` é o custo de memória fixo e baixo, que o torna vulnerável a hardware dedicado: e é exatamente o que o Argon2 foi projetado para...

---

## As três KDFs usadas na prática: Exemplo 1

```txt
$2b$10$13Aak6RFaLSM2BWra67RA.KElfrt41YQsTjy9nul0bxBhXI2vjiPe
 │  │  └──────────────────┬─────────────────────────────────
 │  │                     └─ sal (22 chars) + hash (31 chars)
 │  └─ custo: 2^10 iterações
 └─ versão do algoritmo
```

---

## As três KDFs usadas na prática: Exemplo 2

```js
const hash = await bcrypt.hash('senha-secreta', 10);
//=> $2b$10$13Aak6RFaLSM2BWra67RA.KElfrt41…
const ok = await bcrypt.compare('senha-secreta', hash);
//=> true
```

---

## Implementando com `node:crypto`

- O `bcrypt` é uma dependência nativa que precisa compilar em cada plataforma.
- Desde o Node 24 existe `argon2Sync` embutido, e o mesmo formato de saída pode ser reproduzido sem nenhum pacote.

---

## O formato PHC

- O segredo de um hash portável é guardar os parâmetros junto do resultado. O formato PHC é o padrão que `bcrypt`, `scrypt` e `argon2` seguem:
- Guardar os parâmetros junto permite endurecer os custos amanhã sem invalidar os hashes de hoje: a verificação usa os parâmetros que vieram no próprio...

---

## O formato PHC: Exemplo

```txt
$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG
 │        │    │                │            └─ hash em base64
 │        │    │                └─ sal em base64
 │        │    └─ memória (KiB), passagens, paralelismo
 │        └─ versão do Argon2
 └─ algoritmo
```

---

## Gerando o hash

- Cada chamada gera um sal novo de 16 bytes com `randomBytes`: o gerador criptográfico do Node, não `Math.random()`.

---

## Verificando

- A verificação refaz o cálculo com os parâmetros extraídos do hash armazenado e compara os resultados:

---

## Comparação em tempo constante

- A última linha é a menos óbvia e a mais importante.
- Ele lança se os comprimentos diferirem: por isso o código compara `length` antes.
- E o próprio comprimento não é segredo: o hash tem tamanho fixo conhecido.

---

## Comparação em tempo constante: Exemplo

```ts
// Vaza informação pelo tempo de execução
return hashArmazenado === hashCalculado;
// Tempo constante, independente de onde está a diferença
return timingSafeEqual(hashArmazenado, hashCalculado);
```

---

## Testando

- Uma implementação de senha sem teste é um risco. Três propriedades precisam ser verificadas:

---

## Testando: Exemplo 1

```bash
node --test "src/utils/*.test.ts"
```

---

## Testando: Exemplo 2

```txt
✔ produz hashes diferentes para a mesma senha
✔ gera o hash no formato PHC
✔ aceita a senha correta
✔ rejeita a senha errada
✔ rejeita um hash malformado
```

---

## Nativo ou pacote?

- Nada para instalar, nada para compilar, nada para atualizar por CVE.
- Exige Node 24 para o Argon2: em versões anteriores, `scryptSync` segue a mesma estrutura.
- API mais curta, parâmetros padrão já calibrados e suporte a versões antigas do Node.
- Em troca, uma dependência nativa que compila em cada plataforma.
- Usar o pacote depois de ter escrito a versão nativa é uma decisão; usar o pacote sem saber o que ele faz é sorte.

---

## Nativo ou pacote?: Tabela

- Dependências: nenhuma | uma, com binário nativo
- Instalação em CI e Docker: trivial | exige toolchain de compilação
- Padrões seguros: você define | já vêm calibrados
- Entendimento do que ocorre: explícito | encapsulado
- Node mínimo (Argon2): 24 | qualquer

---

## Nativo ou pacote?: Exemplo

```ts
    import { argon2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
```

---

## Exercício

- No projeto `express-auth`:
- Rode os testes e confirme que dois hashes da mesma senha são diferentes.
- Meça o tempo de `hashPassword` com `console.time`.
- Reduza `MEMORY_KIB` para `4096` e meça de novo. Quanto mais rápido ficou: e o que isso
- significa para um atacante?

---

## Exercício: Exemplo

```ts
  console.time('hash');
  hashPassword('senha-secreta');
  console.timeEnd('hash');
  //=> hash: 61.2ms   (m=65536)
  //=> hash: 4.8ms    (m=4096)
```

---

## Desafio

- Implemente `needsRehash(storedHash)`, que devolve `true` quando o hash foi gerado com parâmetros mais fracos que os atuais.
- Use-a no login: quando a senha estiver correta e o hash estiver defasado, regrave-o com os parâmetros novos.
- Explique por que esse é o único momento em que o *rehash* é possível.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Como guardar senhas com segurança: função de hash, sal, funções de derivação de chave, bcrypt e Argon2, implementação nativa com node:crypto e...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Fundamentos

- Por que não se guarda a senha criptografada?
- Porque criptografia é reversível: existe uma chave capaz de revelar todas as senhas, e ela costuma estar no mesmo servidor.
- Hash é de mão única: não há o que revelar.
- O que o sal impede, exatamente?
- O pré-cálculo. Sem sal, uma tabela pronta traduz hashes conhecidos de volta para senhas, e senhas iguais têm hashes iguais.

---

## Implementação

- Por que os parâmetros ficam guardados dentro do hash?
- Para que a verificação possa refazer o cálculo exatamente como ele foi feito, mesmo depois de os padrões terem sido endurecidos.
- É o que permite aumentar o custo sem invalidar os registros antigos.
- Por que `timingSafeEqual` em vez de `===`?
- Porque `===` para no primeiro byte diferente, e o tempo de resposta revela o tamanho do prefixo correto.

---

## Na prática

- O projeto executável desta aula é Express Auth.

---

## Próxima aula

- Cadastro de Usuário: a rota que usa esse hash.

---

## Arquivos-Chave da Aula

- **src/utils/password.ts**: `examples/courses/express/projects/auth/src/utils/password.ts` (linhas marcadas `36-43`)
- **src/utils/password.ts**: `examples/courses/express/projects/auth/src/utils/password.ts` (linhas marcadas `75`)
- **src/utils/password.test.ts**: `examples/courses/express/projects/auth/src/utils/password.test.ts` (linhas marcadas `8-9`)

---

## Resumo da Aula

- **Express.js: Senhas e Hash** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
