'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('voters', function(table) {
    table.index('district_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('voters', function(table) {
    table.dropIndex('district_id');
  })
};
