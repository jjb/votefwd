'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('districts', function (table) {
    table.increments()
    table.string('state', 16);
    table.string('district', 16);
    table.string('description', 512);
    table.float('lat');
    table.float('long');
    table.specificType('coordinates', 'POINT');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('districts');  
};
