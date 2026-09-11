-- standalone: modelo de e-commerce (catálogo, pedido fechado e estoque)

-- #region schema
CREATE TABLE customer (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT    NOT NULL,
  email TEXT    NOT NULL UNIQUE
) STRICT;

CREATE TABLE product (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  sku   TEXT    NOT NULL UNIQUE,
  name  TEXT    NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0)
) STRICT;

CREATE TABLE "order" (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customer(id),
  status      TEXT    NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'paid', 'shipped', 'cancelled')),
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

-- O preço é copiado de propósito: o pedido guarda o preço de quando foi feito
CREATE TABLE order_item (
  order_id   INTEGER NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES product(id),
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL,
  PRIMARY KEY (order_id, product_id)
) STRICT;
-- #endregion schema

-- #region check
INSERT INTO customer (name, email) VALUES ('Bruno', 'bruno@example.com');
INSERT INTO product (sku, name, price, stock) VALUES ('KB-01', 'Teclado', 15000, 10), ('MS-01', 'Mouse', 8000, 0);
INSERT INTO "order" (customer_id) VALUES (1);
INSERT INTO order_item VALUES (1, 1, 2, 15000);

-- O preço do catálogo sobe; o pedido fechado não muda
UPDATE product SET price = 16000 WHERE id = 1;

SELECT product.name, order_item.quantity, order_item.unit_price / 100.0 AS paid, product.price / 100.0 AS current
FROM order_item
JOIN product ON product.id = order_item.product_id;

-- Baixa de estoque protegida pelo CHECK: o mouse não tem unidades
UPDATE product SET stock = stock - 1 WHERE id = 2;
-- #endregion check
