'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.boolean('is_admin');
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('is_admin');
  });
  
};
