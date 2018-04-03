'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.timestamp('accepted_terms_at');
    table.timestamp('accepted_code_at');
    table.timestamp('is_resident_at');
    table.timestamp('is_human_at');
    table.string('full_name', 256);
    table.string('zip', 16);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('accepted_terms_at');
    table.dropColumn('accepted_code_at');
    table.dropColumn('is_resident_at');
    table.dropColumn('is_human_at');
    table.dropColumn('full_name');
    table.dropColumn('zip');
  })
};
