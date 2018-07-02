'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('voters', function (table) {
    table.timestamp('confirmed_prepped_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('voters', function(table) {
    table.dropColumn('confirmed_prepped_at');
  })
};
