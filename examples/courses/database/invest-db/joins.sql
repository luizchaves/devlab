-- #region inner
SELECT User.name AS autor, Post.title AS titulo
FROM Post
INNER JOIN User ON Post.authorId = User.id
WHERE Post.published = 1;
-- #endregion inner

-- #region left
SELECT User.name AS autor, Post.title AS titulo
FROM User
LEFT JOIN Post ON User.id = Post.authorId;
-- #endregion left

-- #region left-excluding
-- Só o que existe em User e não em Post: o LEFT JOIN sem a interseção
SELECT User.name AS autor
FROM User
LEFT JOIN Post ON User.id = Post.authorId
WHERE Post.id IS NULL;
-- #endregion left-excluding

-- #region full
-- Tudo dos dois lados; o filtro no ON deixa o rascunho sem par, como um post sem autor
SELECT User.name AS autor, Post.title AS titulo
FROM User
FULL OUTER JOIN Post ON User.id = Post.authorId AND Post.published = 1
ORDER BY User.id, Post.id;
-- #endregion full

-- #region full-excluding
-- Só o que não tem par em nenhum dos lados: o FULL OUTER JOIN sem a interseção
SELECT User.name AS autor, Post.title AS titulo
FROM User
FULL OUTER JOIN Post ON User.id = Post.authorId AND Post.published = 1
WHERE User.id IS NULL OR Post.id IS NULL;
-- #endregion full-excluding

-- #region tables
-- As duas tabelas antes de qualquer junção: o que cada JOIN combina
SELECT id, name FROM User;

SELECT id, title, published, authorId FROM Post;
-- #endregion tables
