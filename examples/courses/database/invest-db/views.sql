-- Criar uma visão simplificada de relatórios de autores
CREATE VIEW RelatorioAutores AS
SELECT
  User.id AS autor_id,
  User.name AS autor_nome,
  COUNT(Post.id) AS total_posts
FROM User
LEFT JOIN Post ON User.id = Post.authorId
GROUP BY User.id;

-- Consultar a visão como se fosse uma tabela comum
SELECT * FROM RelatorioAutores WHERE total_posts > 0;
