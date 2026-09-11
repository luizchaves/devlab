-- #region scalar
-- Subconsulta escalar (retorna um único valor):
-- produtos com preço acima da média geral
SELECT name, price
FROM Product
WHERE price > (SELECT AVG(price) FROM Product);
-- #endregion scalar

-- #region in
-- Subconsulta com operador IN (retorna um conjunto de valores):
-- usuários que possuem posts na categoria 'Tecnologia'
SELECT name
FROM User
WHERE id IN (
  SELECT DISTINCT authorId
  FROM Post
  WHERE category = 'Tecnologia'
);
-- #endregion in
