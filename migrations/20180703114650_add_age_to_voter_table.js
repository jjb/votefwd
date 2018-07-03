'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('voters', function (table) {
    table.smallint('age');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('voters', function (table) {
    table.dropColumn('age');
  });
};
