-- Busca por padrão de texto (% representa qualquer sequência de caracteres)
SELECT id, name FROM User WHERE name LIKE 'Ana%';

-- Busca em uma lista de valores
SELECT id, name FROM User WHERE id IN (1, 3, 5);

-- Busca por intervalo numérico ou de datas
SELECT id, title, views FROM Post WHERE views BETWEEN 40 AND 100;

-- Busca por valores nulos ou existentes
SELECT id, title FROM Post WHERE content IS NULL;

-- Combinação de condições lógicas
SELECT id, title FROM Post WHERE published = 1 AND authorId = 2;
