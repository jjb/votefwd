'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.timestamp('qualified_at');
    table.string('full_name', 256);
    table.string('zip', 16);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('qualified_at');
    table.dropColumn('full_name');
    table.dropColumn('zip');
  })
};
