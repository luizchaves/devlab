-- #region create
-- 1. CREATE (Inserção de dados)
INSERT INTO User (name, email, createdAt) VALUES ('Eva Rocha', 'eva@example.com', '2026-05-01 10:00:00');
-- #endregion create

-- #region read
-- 2. READ (Consulta de dados)
SELECT * FROM User;

SELECT id, name FROM User WHERE id = 1;
-- #endregion read

-- #region update
-- 3. UPDATE (Atualização de dados)
UPDATE User SET name = 'Ana Maria Silva' WHERE id = 1;

SELECT id, name FROM User WHERE id = 1;
-- #endregion update

-- #region delete
-- 4. DELETE (Exclusão de dados)
DELETE FROM User WHERE id = 5;

SELECT COUNT(*) AS total FROM User;
-- #endregion delete
