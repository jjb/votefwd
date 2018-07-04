'use strict';

require('dotenv').config();

const connection = {
    user: process.env.REACT_APP_SQL_USER,
    password: process.env.REACT_APP_SQL_PASSWORD,
    database: process.env.REACT_APP_SQL_DATABASE,
    host: process.env.REACT_APP_SQL_HOST
  }

const config = {
  client: process.env.REACT_APP_DATABASE_DIALECT,
  connection: connection,
  migrations: {
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

module.exports = {
  development: config,
  production: config
};
