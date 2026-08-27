---
title: 'Python: Classes e Objetos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Python: Classes e Objetos

## Ideia Central

- Classes juntam **estado** e **comportamento** em um novo tipo
- Tudo em Python já é objeto: definir classes é criar tipos como os embutidos

## Classes e Instâncias

- `class Nome:` em `PascalCase`
- `__init__` inicializa a instância recém-criada
- `self` é o primeiro parâmetro, preenchido automaticamente
- `objeto.metodo()` equivale a `Classe.metodo(objeto)`

## Atributos

- **De instância**: definidos em `__init__`, individuais
- **De classe**: no corpo da classe, compartilhados
- Atribuir na instância **sombreia** o atributo de classe
- Coleção mutável como atributo de classe é compartilhada por todos

## Métodos

- **De instância**: recebem `self`, operam sobre o objeto
- **`@classmethod`**: recebem `cls`, servem como construtor alternativo
- **`@staticmethod`**: sem `self` nem `cls`, utilitário relacionado

## Encapsulamento

### Convenções
- `nome`: público
- `_nome`: interno por convenção
- `__nome`: *name mangling* (`_Classe__nome`)

### Propriedades
- `@property` expõe método como atributo
- `@nome.setter` adiciona validação
- Sem setter, o atributo fica somente leitura

## Métodos Especiais

- `__str__`: legível para o usuário (`print`)
- `__repr__`: técnica, para depuração e coleções
- `__eq__`, `__lt__`: comparação e ordenação
- `__len__`, `__getitem__`, `__contains__`: comportamento de coleção
- `__add__`, `__call__`: operadores e chamada

## Herança

- `class Sub(Base):` especializa a superclasse
- `super()` reaproveita e estende o comportamento
- **Polimorfismo**: cada subclasse responde à sua maneira
- `isinstance()` e `issubclass()` verificam a relação
- Hierarquias profundas acoplam e escondem a origem dos métodos

## Composição e Duck Typing

- Composição expressa "tem um"; herança, "é um tipo de"
- **Duck typing**: basta responder aos mesmos métodos
- `typing.Protocol` formaliza a interface implícita

## dataclasses

- `@dataclass` gera `__init__`, `__repr__` e `__eq__`
- `field(default_factory=list)` evita coleção compartilhada
- `frozen=True` torna imutável e hasheável
- `slots=True` reduz o consumo de memória

## Boas Práticas

- **Comece com atributo simples**; promova a `property` quando precisar validar
- **Implemente `__repr__`** antes de `__str__`
- **Prefira composição** a hierarquias profundas
- **Use `dataclass`** para classes que só guardam dados
