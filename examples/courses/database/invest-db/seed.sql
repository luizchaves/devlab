INSERT INTO User (name, email, createdAt) VALUES
  ('Ana Silva', 'ana@example.com', '2026-01-10 09:00:00'),
  ('Bruno Costa', 'bruno@example.com', '2026-02-15 14:30:00'),
  ('Carla Souza', 'carla@example.com', '2026-03-20 08:45:00'),
  ('Diego Lima', 'diego@example.com', '2026-04-05 17:10:00');

INSERT INTO Post (title, content, category, views, published, authorId) VALUES
  ('Introdução ao SQL', 'DDL e DML.', 'Tecnologia', 120, 1, 1),
  ('Junções explicadas', 'INNER e LEFT.', 'Tecnologia', 80, 1, 1),
  ('Rascunho sobre índices', NULL, 'Tecnologia', 0, 0, 1),
  ('Receita de pão', 'Farinha e água.', 'Culinária', 45, 1, 2),
  ('Viagem ao litoral', 'Fotos e dicas.', 'Viagem', 30, 1, 2),
  ('Normalização na prática', '1FN a 3FN.', 'Tecnologia', 200, 1, 3);

INSERT INTO Product (name, price) VALUES
  ('Teclado', 150.00),
  ('Mouse', 80.00),
  ('Monitor', 1200.00),
  ('Cabo HDMI', 40.00);
