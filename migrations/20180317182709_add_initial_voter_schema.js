'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('voters', function (table) {
    table.increments();
    table.string('hashid', 16).unique();
    table.string('first_name', 256);
    table.string('last_name', 256);
    table.string('middle_name', 256);
    table.string('address', 512);
    table.string('city', 256);
    table.string('state', 16);
    table.string('zip', 16);
    table.string('adopter_user_id', 1024).references('auth0_id').inTable('users');
    table.timestamp('adopted_at');
    table.string('plea_letter_url', 1024);
    table.timestamp('confirmed_sent_at');
    table.timestamp('pledge_made_at');
    table.timestamps(false, true);
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('voters');  
};
