'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('experiment_variant', function (table) {
    table.increments();
    table.string('name', 16).unique().notNullable();
    table.integer('experiment_id').unsigned().references('id').inTable('experiments').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('experiment_variant');  
};
