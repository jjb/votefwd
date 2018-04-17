'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('voter_experiment_variant', function (table) {
    table.increments();
    table.string('voter_registration_id').references('registration_id').inTable('voters').notNullable();
    table.integer('experiment_id').references('id').inTable('experiments').notNullable();
    table.integer('variant_id').references('id').inTable('experiment_variant').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('voter_experiment_variant');  
};
