-- standalone: este arquivo cria o próprio esquema

-- #region tables
CREATE TABLE Pedido (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  data DATE    NOT NULL
);

-- Tabela de Produtos (o nome e o preço dependem apenas de produto_id)
CREATE TABLE Produto (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  nome  TEXT    NOT NULL,
  preco REAL    NOT NULL
);

-- Tabela de Itens (a quantidade depende da chave composta inteira)
CREATE TABLE Item_Pedido (
  pedido_id  INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  PRIMARY KEY (pedido_id, produto_id),
  FOREIGN KEY (pedido_id) REFERENCES Pedido(id),
  FOREIGN KEY (produto_id) REFERENCES Produto(id)
);
-- #endregion tables

-- #region check
INSERT INTO Pedido (data) VALUES ('2026-09-10');
INSERT INTO Produto (nome, preco) VALUES ('Teclado', 150.00), ('Mouse', 80.00);
INSERT INTO Item_Pedido VALUES (1, 1, 2), (1, 2, 1);

-- O preço mora em um só lugar: alterá-lo não exige tocar nos itens
UPDATE Produto SET preco = 160.00 WHERE id = 1;

SELECT Produto.nome, Item_Pedido.quantidade, Produto.preco * Item_Pedido.quantidade AS subtotal
FROM Item_Pedido
JOIN Produto ON Produto.id = Item_Pedido.produto_id;
-- #endregion check
