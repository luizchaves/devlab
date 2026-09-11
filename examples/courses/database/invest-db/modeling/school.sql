-- standalone: este arquivo cria o próprio esquema, sem o blog de schema.sql

-- #region professor
-- Entidade Professor (lado 1 do relacionamento 1:N)
CREATE TABLE Professor (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT    NOT NULL
);
-- #endregion professor

-- #region gabinete
-- Entidade Gabinete (relacionamento 1:1 com Professor)
CREATE TABLE Gabinete (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  numero       TEXT    NOT NULL UNIQUE,
  professor_id INTEGER NOT NULL UNIQUE,
  FOREIGN KEY (professor_id) REFERENCES Professor(id)
);
-- #endregion gabinete

-- #region turma
-- Entidade Turma (lado N do relacionamento 1:N)
CREATE TABLE Turma (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo       TEXT    NOT NULL,
  professor_id INTEGER NOT NULL,
  FOREIGN KEY (professor_id) REFERENCES Professor(id)
);
-- #endregion turma

-- #region aluno
-- Entidade Aluno
CREATE TABLE Aluno (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT    NOT NULL
);
-- #endregion aluno

-- #region turma-aluno
-- Tabela associativa para o relacionamento N:M entre Turma e Aluno
CREATE TABLE Turma_Aluno (
  turma_id       INTEGER NOT NULL,
  aluno_id       INTEGER NOT NULL,
  data_matricula DATE    NOT NULL,
  PRIMARY KEY (turma_id, aluno_id),
  FOREIGN KEY (turma_id) REFERENCES Turma(id) ON DELETE CASCADE,
  FOREIGN KEY (aluno_id) REFERENCES Aluno(id) ON DELETE CASCADE
);
-- #endregion turma-aluno

-- #region check
INSERT INTO Professor (nome) VALUES ('Marina');
INSERT INTO Gabinete (numero, professor_id) VALUES ('B-102', 1);
INSERT INTO Turma (codigo, professor_id) VALUES ('BD-2026', 1);
INSERT INTO Aluno (nome) VALUES ('João'), ('Lia');
INSERT INTO Turma_Aluno VALUES (1, 1, '2026-02-10'), (1, 2, '2026-02-11');

-- A mesma matrícula duas vezes viola a chave primária composta
INSERT INTO Turma_Aluno VALUES (1, 1, '2026-02-12');

SELECT Turma.codigo, Aluno.nome, Turma_Aluno.data_matricula
FROM Turma_Aluno
JOIN Turma ON Turma.id = Turma_Aluno.turma_id
JOIN Aluno ON Aluno.id = Turma_Aluno.aluno_id;
-- #endregion check
