'use strict';

const knex = require('knex');

const config = {
    user: process.env.SQL_USER,
    password: process.env.REACT_APP_SQL_PASSWORD,
    database: process.env.REACT_APP_SQL_DATABASE
  }

if (process.env.REACT_APP_INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
  config.host = `/cloudsql/${process.env.REACT_APP_INSTANCE_CONNECTION_NAME}`;
}

var knexClient = knex({
  client: process.env.REACT_APP_DATABASE_DIALECT,
  connection: config,
  migrations: {
    tableName: 'knex_migrations'
  }
});

module.exports = knexClient;
