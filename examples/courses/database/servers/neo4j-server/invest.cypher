// ==============================================================================
// Neo4j: Modelagem em Grafos e Consultas Cypher no Domínio InvestApp
// ==============================================================================

// 1. Limpeza inicial
MATCH (n) DETACH DELETE n;

// 2. Criação de Restrições de Unicidade
CREATE CONSTRAINT user_email IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE;
CREATE CONSTRAINT asset_code IF NOT EXISTS FOR (a:Asset) REQUIRE a.code IS UNIQUE;

// 3. Criação de Nós (Investidores, Ativos e Categorias)
CREATE (u1:User {id: 1, name: 'Lucas Chaves', email: 'lucas@devlab.com', city: 'João Pessoa'})
CREATE (u2:User {id: 2, name: 'Ana Silva', email: 'ana@devlab.com', city: 'Recife'})
CREATE (u3:User {id: 3, name: 'Carlos Souza', email: 'carlos@devlab.com', city: 'São Paulo'})

CREATE (c1:Category {name: 'Renda Fixa'})
CREATE (c2:Category {name: 'Ações'})
CREATE (c3:Category {name: 'Fundos Imobiliários'})

CREATE (a1:Asset {code: 'CDB_PREFIXADO', name: 'CDB Prefixado 12%', minInvestment: 1000.00})
CREATE (a2:Asset {code: 'TESOURO_SELIC', name: 'Tesouro Selic 2029', minInvestment: 150.00})
CREATE (a3:Asset {code: 'VALE3', name: 'Vale S.A.', minInvestment: 65.00})
CREATE (a4:Asset {code: 'HGLG11', name: 'CSHG Logística FII', minInvestment: 160.00});

// 4. Criação de Relacionamentos
MATCH (a1:Asset {code: 'CDB_PREFIXADO'}), (c1:Category {name: 'Renda Fixa'}) CREATE (a1)-[:IN_CATEGORY]->(c1);
MATCH (a2:Asset {code: 'TESOURO_SELIC'}), (c1:Category {name: 'Renda Fixa'}) CREATE (a2)-[:IN_CATEGORY]->(c1);
MATCH (a3:Asset {code: 'VALE3'}), (c2:Category {name: 'Ações'}) CREATE (a3)-[:IN_CATEGORY]->(c2);
MATCH (a4:Asset {code: 'HGLG11'}), (c3:Category {name: 'Fundos Imobiliários'}) CREATE (a4)-[:IN_CATEGORY]->(c3);

MATCH (u1:User {id: 1}), (a1:Asset {code: 'CDB_PREFIXADO'}) CREATE (u1)-[:INVESTS_IN {amount: 5000.00, since: date('2024-01-15')}]->(a1);
MATCH (u1:User {id: 1}), (a2:Asset {code: 'TESOURO_SELIC'}) CREATE (u1)-[:INVESTS_IN {amount: 3500.00, since: date('2024-02-10')}]->(a2);
MATCH (u2:User {id: 2}), (a2:Asset {code: 'TESOURO_SELIC'}) CREATE (u2)-[:INVESTS_IN {amount: 8000.00, since: date('2024-03-01')}]->(a2);
MATCH (u2:User {id: 2}), (a3:Asset {code: 'VALE3'}) CREATE (u2)-[:INVESTS_IN {amount: 2000.00, since: date('2024-03-15')}]->(a3);
MATCH (u3:User {id: 3}), (a3:Asset {code: 'VALE3'}) CREATE (u3)-[:INVESTS_IN {amount: 15000.00, since: date('2024-04-01')}]->(a3);

// Rede Social / Conexões entre Investidores
MATCH (u1:User {id: 1}), (u2:User {id: 2}) CREATE (u1)-[:FOLLOWS]->(u2);
MATCH (u2:User {id: 2}), (u3:User {id: 3}) CREATE (u2)-[:FOLLOWS]->(u3);

// 5. Consultas Cypher

// a) Ativos investidos por Lucas e suas respectivas categorias
MATCH (u:User {name: 'Lucas Chaves'})-[r:INVESTS_IN]->(a:Asset)-[:IN_CATEGORY]->(c:Category)
RETURN a.name AS Ativo, r.amount AS Valor, c.name AS Categoria;

// b) Sistema de Recomendação Colaborativa:
// "Ativos que as pessoas que eu sigo investem, mas que eu ainda não invisto"
MATCH (eu:User {name: 'Lucas Chaves'})-[:FOLLOWS]->(amigo:User)-[:INVESTS_IN]->(ativo:Asset)
WHERE NOT (eu)-[:INVESTS_IN]->(ativo)
RETURN amigo.name AS Amigo, ativo.name AS AtivoRecomendado;

// c) Menor caminho de conexões entre Lucas e Carlos
MATCH p = shortestPath((u1:User {name: 'Lucas Chaves'})-[:FOLLOWS*]-(u3:User {name: 'Carlos Souza'}))
RETURN p;
