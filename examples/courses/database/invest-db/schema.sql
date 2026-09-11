-- #region user
CREATE TABLE User (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT    NOT NULL,
  email     TEXT    NOT NULL UNIQUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- #endregion user

-- #region post
CREATE TABLE Post (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  title     TEXT    NOT NULL,
  content   TEXT,
  category  TEXT,
  views     INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT 0,
  authorId  INTEGER NOT NULL,
  FOREIGN KEY (authorId) REFERENCES User(id) ON DELETE CASCADE
);
-- #endregion post

-- #region product
CREATE TABLE Product (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT    NOT NULL,
  price REAL    NOT NULL
);
-- #endregion product
