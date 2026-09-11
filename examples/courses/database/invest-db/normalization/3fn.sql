-- standalone: este arquivo cria o próprio esquema

-- #region tables
-- Tabela de Endereços por CEP (3FN)
CREATE TABLE Endereco (
  cep    TEXT PRIMARY KEY,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL
);

-- Tabela de Funcionários sem dependência transitiva
CREATE TABLE Funcionario (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT    NOT NULL,
  cep  TEXT    NOT NULL,
  FOREIGN KEY (cep) REFERENCES Endereco(cep)
);
-- #endregion tables

-- #region check
INSERT INTO Endereco VALUES ('58000-000', 'João Pessoa', 'PB');
INSERT INTO Funcionario (nome, cep) VALUES ('Ana', '58000-000'), ('Bruno', '58000-000');

-- Um CEP inexistente é recusado pela chave estrangeira
INSERT INTO Funcionario (nome, cep) VALUES ('Carla', '00000-000');

SELECT Funcionario.nome, Endereco.cidade, Endereco.estado
FROM Funcionario
JOIN Endereco ON Endereco.cep = Funcionario.cep;
-- #endregion check
