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
