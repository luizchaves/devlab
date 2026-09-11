-- #region commit
-- Uma transferência entre contas: as duas escritas acontecem juntas ou não acontecem
CREATE TABLE Account (
  id      INTEGER PRIMARY KEY,
  owner   TEXT    NOT NULL,
  balance INTEGER NOT NULL CHECK (balance >= 0)
);

INSERT INTO Account VALUES (1, 'Ana', 1000), (2, 'Bruno', 500);

BEGIN;
UPDATE Account SET balance = balance - 300 WHERE id = 1;
UPDATE Account SET balance = balance + 300 WHERE id = 2;
COMMIT;

SELECT * FROM Account;
-- #endregion commit

-- #region rollback
-- A segunda escrita viola o CHECK: a transação inteira é desfeita
BEGIN;
UPDATE Account SET balance = balance + 900 WHERE id = 2;
UPDATE Account SET balance = balance - 900 WHERE id = 1;
ROLLBACK;

SELECT * FROM Account;
-- #endregion rollback

-- #region savepoint
-- Um ponto de retorno dentro da transação desfaz só uma parte
BEGIN;
UPDATE Account SET balance = balance - 100 WHERE id = 1;
SAVEPOINT bonus;
UPDATE Account SET balance = balance + 50 WHERE id = 2;
ROLLBACK TO bonus;
COMMIT;

SELECT * FROM Account;
-- #endregion savepoint
