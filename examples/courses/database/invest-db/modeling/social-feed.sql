-- standalone: modelo de rede social (seguidores, posts e curtidas)

-- #region schema
CREATE TABLE account (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  handle   TEXT    NOT NULL UNIQUE
) STRICT;

-- Autorrelacionamento N:M: uma conta segue outras contas
CREATE TABLE follow (
  follower_id INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  followed_id INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  PRIMARY KEY (follower_id, followed_id),
  CHECK (follower_id <> followed_id)
) STRICT;

CREATE TABLE post (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id  INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  body       TEXT    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE TABLE "like" (
  account_id INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  post_id    INTEGER NOT NULL REFERENCES post(id) ON DELETE CASCADE,
  PRIMARY KEY (account_id, post_id)
) STRICT;

-- O feed é lido por autor e data: o índice cobre as duas colunas
CREATE INDEX idx_post_author_date ON post (author_id, created_at);
-- #endregion schema

-- #region check
INSERT INTO account (handle) VALUES ('ana'), ('bruno'), ('carla');
INSERT INTO follow VALUES (1, 2), (1, 3);
INSERT INTO post (author_id, body, created_at) VALUES
  (2, 'Primeiro post do Bruno', '2026-09-10 08:00'),
  (3, 'Carla no ar', '2026-09-10 09:00'),
  (1, 'Ana fala sozinha', '2026-09-10 10:00');
INSERT INTO "like" VALUES (1, 1), (3, 1);

-- Seguir a si mesmo é recusado pelo CHECK
INSERT INTO follow VALUES (1, 1);

-- O feed de Ana: posts de quem ela segue, do mais recente ao mais antigo, com curtidas
SELECT account.handle, post.body, COUNT("like".post_id) AS likes
FROM follow
JOIN post ON post.author_id = follow.followed_id
JOIN account ON account.id = post.author_id
LEFT JOIN "like" ON "like".post_id = post.id
WHERE follow.follower_id = 1
GROUP BY post.id
ORDER BY post.created_at DESC;
-- #endregion check

-- #region plans
EXPLAIN QUERY PLAN SELECT body FROM post WHERE author_id = 2;
EXPLAIN QUERY PLAN SELECT body FROM post WHERE author_id = 2 AND created_at >= '2026-09-10';
EXPLAIN QUERY PLAN SELECT body FROM post WHERE created_at >= '2026-09-10';
-- #endregion plans
