'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('catalist_raw', function(table) {
    table.dropColumn('catalist_spanish_speaker');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('catalist_raw', function(table) {
    table.string('catalist_spanish_speaker')
  });
};
