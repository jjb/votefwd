'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.timestamp('pledged_vote_at');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('pledged_vote_at');
  })
};
