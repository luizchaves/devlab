-- standalone: este arquivo cria o esquema completo do domínio acadêmico avançado

-- #region schema
CREATE TABLE Pessoa (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  nome  TEXT    NOT NULL,
  email TEXT    NOT NULL UNIQUE
) STRICT;

CREATE TABLE Aluno (
  pessoa_id INTEGER PRIMARY KEY,
  matricula TEXT    NOT NULL UNIQUE,
  FOREIGN KEY (pessoa_id) REFERENCES Pessoa(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE Professor (
  pessoa_id INTEGER PRIMARY KEY,
  titulacao  TEXT    NOT NULL,
  FOREIGN KEY (pessoa_id) REFERENCES Pessoa(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE Perfil (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  biografia    TEXT,
  lattes       TEXT    NOT NULL UNIQUE,
  professor_id INTEGER NOT NULL UNIQUE,
  FOREIGN KEY (professor_id) REFERENCES Professor(pessoa_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE Turma (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT    NOT NULL UNIQUE
) STRICT;

CREATE TABLE Disciplina (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT    NOT NULL UNIQUE,
  nome   TEXT    NOT NULL
) STRICT;

CREATE TABLE Disciplina_Pre_Requisito (
  disciplina_id    INTEGER NOT NULL,
  pre_requisito_id INTEGER NOT NULL,
  PRIMARY KEY (disciplina_id, pre_requisito_id),
  FOREIGN KEY (disciplina_id) REFERENCES Disciplina(id) ON DELETE CASCADE,
  FOREIGN KEY (pre_requisito_id) REFERENCES Disciplina(id) ON DELETE CASCADE,
  CHECK (disciplina_id <> pre_requisito_id)
) STRICT;

CREATE TABLE Semestre (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT    NOT NULL UNIQUE
) STRICT;

CREATE TABLE Oferta (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  professor_id  INTEGER NOT NULL,
  disciplina_id INTEGER NOT NULL,
  turma_id      INTEGER NOT NULL,
  semestre_id   INTEGER NOT NULL,
  FOREIGN KEY (professor_id) REFERENCES Professor(pessoa_id),
  FOREIGN KEY (disciplina_id) REFERENCES Disciplina(id),
  FOREIGN KEY (turma_id) REFERENCES Turma(id),
  FOREIGN KEY (semestre_id) REFERENCES Semestre(id),
  UNIQUE (professor_id, disciplina_id, turma_id, semestre_id)
) STRICT;

CREATE TABLE Matricula (
  aluno_id       INTEGER NOT NULL,
  oferta_id      INTEGER NOT NULL,
  data_matricula TEXT    NOT NULL,
  PRIMARY KEY (aluno_id, oferta_id),
  FOREIGN KEY (aluno_id) REFERENCES Aluno(pessoa_id) ON DELETE CASCADE,
  FOREIGN KEY (oferta_id) REFERENCES Oferta(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE Avaliacao (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  aluno_id  INTEGER NOT NULL,
  oferta_id INTEGER NOT NULL,
  descricao TEXT    NOT NULL,
  nota      REAL    NOT NULL CHECK (nota >= 0 AND nota <= 10),
  FOREIGN KEY (aluno_id, oferta_id) REFERENCES Matricula(aluno_id, oferta_id)
) STRICT;
-- #endregion schema

-- #region seed
INSERT INTO Pessoa (nome, email) VALUES
  ('Marina', 'marina@example.com'),
  ('João', 'joao@example.com'),
  ('Lia', 'lia@example.com');

INSERT INTO Professor (pessoa_id, titulacao) VALUES (1, 'Doutora em Computação');
INSERT INTO Aluno (pessoa_id, matricula) VALUES (2, 'A2026001'), (3, 'A2026002');
INSERT INTO Perfil (biografia, lattes, professor_id)
VALUES ('Doutora em Computação', 'http://lattes.cnpq.br/123456', 1);

INSERT INTO Turma (codigo) VALUES ('BD-2026');
INSERT INTO Disciplina (codigo, nome) VALUES
  ('LOGICA', 'Lógica de Programação'),
  ('BD', 'Banco de Dados');
INSERT INTO Disciplina_Pre_Requisito (disciplina_id, pre_requisito_id) VALUES (2, 1);
INSERT INTO Semestre (codigo) VALUES ('2026.1');

INSERT INTO Oferta (professor_id, disciplina_id, turma_id, semestre_id)
VALUES (1, 2, 1, 1);

INSERT INTO Matricula (aluno_id, oferta_id, data_matricula) VALUES
  (2, 1, '2026-02-10'),
  (3, 1, '2026-02-11');

INSERT INTO Avaliacao (aluno_id, oferta_id, descricao, nota) VALUES
  (2, 1, 'Prova 1', 8.5),
  (3, 1, 'Prova 1', 9.0);
-- #endregion seed

-- #region query
SELECT
  Turma.codigo AS turma,
  Disciplina.codigo AS disciplina,
  Semestre.codigo AS semestre,
  Pessoa.nome AS aluno,
  Avaliacao.descricao,
  Avaliacao.nota
FROM Avaliacao
JOIN Matricula
  ON Matricula.aluno_id = Avaliacao.aluno_id
 AND Matricula.oferta_id = Avaliacao.oferta_id
JOIN Aluno ON Aluno.pessoa_id = Matricula.aluno_id
JOIN Pessoa ON Pessoa.id = Aluno.pessoa_id
JOIN Oferta ON Oferta.id = Matricula.oferta_id
JOIN Turma ON Turma.id = Oferta.turma_id
JOIN Disciplina ON Disciplina.id = Oferta.disciplina_id
JOIN Semestre ON Semestre.id = Oferta.semestre_id
ORDER BY Pessoa.nome;
-- #endregion query
