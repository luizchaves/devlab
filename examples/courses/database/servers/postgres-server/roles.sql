-- #region create
-- Um papel de aplicação, sem superpoderes, com senha própria
CREATE ROLE invest_app LOGIN PASSWORD 'app-secret';

GRANT CONNECT ON DATABASE invest TO invest_app;
GRANT USAGE ON SCHEMA public TO invest_app;
GRANT SELECT, INSERT, UPDATE ON investment TO invest_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO invest_app;
-- #endregion create

-- #region check
-- Executa a próxima instrução como o papel de aplicação
SET ROLE invest_app;

INSERT INTO investment (name, value, category) VALUES ('LCI Banco Y', 3000, 'Pré');

-- DELETE não foi concedido: o servidor recusa
DELETE FROM investment WHERE id = 1;

RESET ROLE;
-- #endregion check

-- #region revoke
REVOKE UPDATE ON investment FROM invest_app;

-- Um papel só pode ser removido depois que nada mais depende dele
DROP OWNED BY invest_app;
DROP ROLE invest_app;
-- #endregion revoke
