'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('voters', function (table) {
    table.string('suffix', 16);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('voters', function (table) {
    table.dropColumn('suffix');
  });
};
