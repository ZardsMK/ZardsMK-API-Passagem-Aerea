const knex = require('./.env');
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

    client: 'postgresql',
    connection: {
      database: knex.db.database,
      user: knex.db.user,
      password: knex.db.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  
};
