'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('voters', function (table) {
    table.string('registration_id').unique();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('voters', function (table) {
    table.dropColumn('registration_id');
  });
};
