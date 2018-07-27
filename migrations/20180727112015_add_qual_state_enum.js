'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.string('qual_state', 32).notNull().defaultTo('pre_qualified');
  }).then(function(){
    return knex('users').update('qual_state', 'qualified');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('qual_state');
  })
};
