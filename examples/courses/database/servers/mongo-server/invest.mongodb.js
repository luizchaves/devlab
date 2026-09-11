// Sessão do mongosh: cada instrução abaixo pode ser colada no shell.
// Execute de uma vez com: mongosh -u root -p secret --quiet < invest.mongodb.js

// #region use
// Seleciona (ou cria, na primeira escrita) o banco de dados
use('invest');
// #endregion use

// #region insert
// Não há CREATE TABLE: a coleção nasce na primeira inserção, e cada documento
// pode ter campos diferentes
db.investments.insertMany([
  { name: 'Tesouro Selic 2029', value: 10000, category: 'Pós', broker: 'Tesouro Direto' },
  { name: 'Tesouro IPCA 2029', value: 25000.5, category: 'Pós', broker: 'Tesouro Direto' },
  { name: 'CDB Banco X', value: 5000, category: 'Pré', fgc: true },
]);
// #endregion insert

// #region find
// Consulta por igualdade e projeção dos campos devolvidos
db.investments.find({ category: 'Pós' }, { _id: 0, name: 1, value: 1 });

// Operadores de comparação ficam dentro do filtro
db.investments.find({ value: { $gt: 8000 } }, { _id: 0, name: 1 });
// #endregion find

// #region update
db.investments.updateOne({ name: 'CDB Banco X' }, { $set: { value: 5500 } });

db.investments.findOne({ name: 'CDB Banco X' }, { _id: 0 });
// #endregion update

// #region aggregate
// O pipeline de agregação é o equivalente do GROUP BY
db.investments.aggregate([
  { $group: { _id: '$category', total: { $sum: '$value' }, count: { $sum: 1 } } },
  { $sort: { _id: 1 } },
]);
// #endregion aggregate

// #region delete
db.investments.deleteOne({ name: 'Tesouro IPCA 2029' });

db.investments.countDocuments();
// #endregion delete
