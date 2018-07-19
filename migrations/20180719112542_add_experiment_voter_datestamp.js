'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('experiment_voter', function (table) {
    table.timestamps(false, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('experiment_voter', function (table) {
    table.dropTimestamps();
  });
};
