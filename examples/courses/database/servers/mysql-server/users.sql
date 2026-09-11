-- #region create
-- Usuário de aplicação, identificado por nome e origem da conexão
CREATE USER 'invest_app'@'%' IDENTIFIED BY 'app-secret';

GRANT SELECT, INSERT, UPDATE ON invest.* TO 'invest_app'@'%';

SHOW GRANTS FOR 'invest_app'@'%';
-- #endregion create

-- #region revoke
REVOKE UPDATE ON invest.* FROM 'invest_app'@'%';
DROP USER 'invest_app'@'%';
-- #endregion revoke
