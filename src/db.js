'use strict';

var knex = require('knex');

var knexClient = knex({
  client: process.env.REACT_APP_DATABASE_DIALECT,
  connection: process.env.REACT_APP_DATABASE_URL,
  migrations: {
    tableName: 'knex_migrations'
  }
});

module.exports = knexClient
