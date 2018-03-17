'use strict';

require('dotenv').config()

var config = {
  client: process.env.REACT_APP_DATABASE_DIALECT,
  connection: process.env.REACT_APP_DATABASE_URL,
  migrations: {
    tableName: 'knex_migrations'
  }
};

module.exports = {
  development: config,
  production: config
};
