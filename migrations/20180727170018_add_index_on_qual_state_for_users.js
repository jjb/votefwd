'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.index('qual_state');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropIndex('qual_state');
  })
};
