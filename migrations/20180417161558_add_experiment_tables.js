'use strict';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('experiments', function (table) {
      table.increments();
      table.string('name', 16).unique().notNullable();
      table.string('randomization_query');
      table.date('randomization_date');
    })
    .createTable('experiment_variant', function (table) {
      table.increments();
      table.string('name', 16).unique().notNullable();
      table.integer('experiment_id').unsigned().references('id').inTable('experiments').notNullable();
    })
    .createTable('voter_experiment_variant', function (table) {
      table.increments();
      table.string('voter_registration_id').references('registration_id').inTable('voters').notNullable();
      table.integer('experiment_id').references('id').inTable('experiments').notNullable();
      table.integer('variant_id').references('id').inTable('experiment_variant').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('voter_experiment_variant')
    .dropTableIfExists('experiment_variant')
    .dropTableIfExists('experiments');
};
