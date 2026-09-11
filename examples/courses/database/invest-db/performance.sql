-- #region plan-scan
-- Sem índice em views, o planejador varre a tabela inteira
EXPLAIN QUERY PLAN SELECT title FROM Post WHERE views > 100;
-- #endregion plan-scan

-- #region plan-index
CREATE INDEX idx_post_views ON Post (views);

-- Com o índice, a mesma consulta procura só o intervalo
EXPLAIN QUERY PLAN SELECT title FROM Post WHERE views > 100;

-- Um índice não ajuda quando a coluna passa por função ou por LIKE com curinga inicial
EXPLAIN QUERY PLAN SELECT title FROM Post WHERE views * 2 > 200;
-- #endregion plan-index

-- #region n-plus-one
-- N+1: uma consulta para os autores e uma por autor para os posts
SELECT id, name FROM User;
SELECT title FROM Post WHERE authorId = 1;
SELECT title FROM Post WHERE authorId = 2;

-- A mesma informação em uma consulta só, com junção
SELECT User.name, Post.title
FROM User
LEFT JOIN Post ON Post.authorId = User.id
ORDER BY User.id, Post.id;
-- #endregion n-plus-one

-- #region pagination
-- OFFSET obriga o banco a ler e descartar as linhas puladas
EXPLAIN QUERY PLAN SELECT id, title FROM Post ORDER BY id LIMIT 2 OFFSET 4;

-- Paginação por cursor: continua a partir do último id visto, usando a chave
EXPLAIN QUERY PLAN SELECT id, title FROM Post WHERE id > 4 ORDER BY id LIMIT 2;
-- #endregion pagination
