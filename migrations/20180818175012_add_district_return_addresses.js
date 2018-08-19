'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('districts', function (table) {
    table.string('return_address', 512);
    table.string('ra_city', 256);
    table.string('ra_state', 16);
    table.string('ra_zip', 16);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('districts', function (table) {
    table.dropColumn('return_address');
    table.dropColumn('ra_city');
    table.dropColumn('ra_state');
    table.dropColumn('ra_zip');
  });
};
