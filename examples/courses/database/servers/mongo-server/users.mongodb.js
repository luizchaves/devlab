// Usuários e papéis no MongoDB. Execute como root:
// mongosh -u root -p secret --quiet < users.mongodb.js

// #region create
use('invest');

// Um usuário só existe dentro de um banco, com papéis por banco
db.createUser({
  user: 'invest_app',
  pwd: 'app-secret',
  roles: [{ role: 'readWrite', db: 'invest' }],
});

db.getUser('invest_app').roles;
// #endregion create

// #region revoke
db.revokeRolesFromUser('invest_app', [{ role: 'readWrite', db: 'invest' }]);
db.grantRolesToUser('invest_app', [{ role: 'read', db: 'invest' }]);

db.getUser('invest_app').roles;

db.dropUser('invest_app');
// #endregion revoke
