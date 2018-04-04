'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('voters', function (table) {
    table.string('gender', 16);
    table.date('date_of_birth');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('voters', function (table) {
    table.dropColumn('gender');
    table.dropColumn('date_of_birth');
  });
};
