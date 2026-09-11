-- standalone: este arquivo cria o próprio esquema

-- #region tables
-- Tabela de Clientes com atributos atômicos
CREATE TABLE Cliente (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT    NOT NULL
);

-- Tabela separada para Telefones (eliminando o atributo multivalorado)
CREATE TABLE Cliente_Telefone (
  cliente_id INTEGER NOT NULL,
  telefone   TEXT    NOT NULL,
  PRIMARY KEY (cliente_id, telefone),
  FOREIGN KEY (cliente_id) REFERENCES Cliente(id)
);
-- #endregion tables

-- #region check
INSERT INTO Cliente (nome) VALUES ('Ana');
INSERT INTO Cliente_Telefone VALUES (1, '83 99999-0001'), (1, '83 99999-0002');

SELECT Cliente.nome, Cliente_Telefone.telefone
FROM Cliente
JOIN Cliente_Telefone ON Cliente_Telefone.cliente_id = Cliente.id;
-- #endregion check
