'use strict';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('pledges', function (table) {
      table.increments();
      table.integer('voter_id').references('id').inTable('voters');
      table.enu('type', ['VIEW', 'COMMIT']);
      table.boolean('real_voter');
      table.timestamps(false, true);
      table.index('voter_id');
    })
    .table('voters', function(table) {
      table.integer('pledge_count');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('pledges')
    .table('voters', function (table) {
      table.dropColumn('pledge_count');
    });
};
