-- Ordenar resultados (ASC = ascendente, DESC = descendente)
SELECT id, name FROM User ORDER BY name ASC;

-- Paginação: pular 2 registros e trazer os próximos 2
SELECT id, title, views FROM Post ORDER BY views DESC LIMIT 2 OFFSET 2;
