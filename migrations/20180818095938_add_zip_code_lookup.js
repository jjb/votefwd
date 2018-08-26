'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('lu_zip', function (table) {
    table.string('zip', 16).unique();
    table.string('city', 64);
    table.string('state', 16);
    table.float('lat');
    table.float('long');
    table.specificType('coordinates', 'POINT');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('lu_zip');  
};
