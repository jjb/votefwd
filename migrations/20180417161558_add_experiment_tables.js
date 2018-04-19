'use strict';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('experiment', function (table) {
      table.increments();
      table.string('name', 32).unique().notNullable();
      table.string('description', 128);
    })
    .createTable('experiment_voter', function (table) {
      table.increments();
      table.string('voter_id').notNullable();
      table.integer('experiment_id').references('id').inTable('experiment');
      table.enu('cohort', ['TEST', 'CONTROL']);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('experiment_voter')
    .dropTableIfExists('experiment');
};
