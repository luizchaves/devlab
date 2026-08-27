---
title: 'TypeScript: Classes'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Classes

## Ideia Central

- Classes existem nos dois mundos: geram código **e** definem um tipo
- TypeScript acrescenta visibilidade, `abstract` e `implements`

## Declaração

- Propriedades declaradas com tipo antes do uso
- `strictPropertyInitialization` exige inicialização garantida
- Saídas: inicializar na declaração, no construtor, `?` ou `!`
- `!` é promessa não verificada — use com parcimônia

## Modificadores

- **`public`**: padrão, acessível em qualquer lugar
- **`protected`**: na classe e nas subclasses
- **`private`**: só na própria classe
- **`readonly`**: escrita apenas na inicialização
- Todos valem só em tempo de compilação

## Propriedades de Parâmetro

- Declaram e atribuem direto na assinatura do construtor
- Exigem um modificador (`private`, `readonly`…) para funcionar
- Eliminam a repetição de declarar e depois atribuir

## Acessadores

- `get` expõe valor derivado com sintaxe de propriedade
- `set` adiciona validação sem mudar a interface
- Getter sem setter cria propriedade somente leitura

## implements

- Verifica que a classe satisfaz uma interface
- Não herda nada e não altera comportamento
- A compatibilidade continua **estrutural**
- Serve para o erro aparecer na classe, não no consumidor

## Classes Abstratas

### Características
- Não podem ser instanciadas
- Membros `abstract` obrigam a subclasse a implementar
- Podem conter implementação e estado compartilhados

### Versus interface
- Interface: só forma, zero custo, herança múltipla
- Abstract class: implementação e estado, herança única

## private x #

- `private` é apagado: acessível em runtime via `objeto["campo"]`
- `#campo` é sintaxe padrão do JavaScript, protegida pelo runtime
- `#` não aparece em `Object.keys` nem em `JSON.stringify`
- Prefira `#` em código novo

## Boas Práticas

- **Comece com atributo simples**, promova a `property` quando precisar validar
- **Prefira composição** a hierarquias profundas
- **Use `#`** quando a privacidade precisar valer em runtime
- **`implements` documenta** o contrato pretendido
