-- #region alter
-- Adicionar uma nova coluna a uma tabela existente
ALTER TABLE User ADD COLUMN bio TEXT;

SELECT id, name, bio FROM User WHERE id = 1;
-- #endregion alter

-- #region drop
-- Excluir uma tabela permanentemente, junto com todos os seus dados
DROP TABLE IF EXISTS Post;

SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;
-- #endregion drop
