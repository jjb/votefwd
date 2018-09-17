'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.index('current_district');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropIndex('current_district');
  })
};
