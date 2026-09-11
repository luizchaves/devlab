-- #region functions
SELECT
  COUNT(*) AS total_posts,
  AVG(views) AS media_visualizacoes,
  MAX(views) AS maior_audiencia
FROM Post;
-- #endregion functions

-- #region group-by
-- Contar quantos posts cada autor escreveu
SELECT authorId, COUNT(*) AS total_posts
FROM Post
GROUP BY authorId;
-- #endregion group-by

-- #region having
-- Listar apenas autores que possuem mais de 2 posts
SELECT authorId, COUNT(*) AS total_posts
FROM Post
GROUP BY authorId
HAVING COUNT(*) > 2;
-- #endregion having
