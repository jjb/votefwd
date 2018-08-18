'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('voters', function(table) {
    table.string('district_id').references('district_id').inTable('districts');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('voters', function (table) {
    table.dropColumn('district_id');
  });
};
