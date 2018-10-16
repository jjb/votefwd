'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('districts', function (table) {
    table.integer('available_voter_count');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('districts', function (table) {
    table.dropColumn('available_voter_count');
  });
};
