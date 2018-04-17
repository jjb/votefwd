'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('experiments', function (table) {
    table.increments();
    table.string('name', 16).unique().notNullable();
    table.string('randomization_query');
    table.date('randomization_date');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('experiments');  
};
