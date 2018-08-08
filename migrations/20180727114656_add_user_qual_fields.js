'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.string('twitter_profile_url', 1028);
    table.string('facebook_profile_url', 1028);
    table.string('linkedin_profile_url', 1028);
    table.string('why_write_letters', 1028);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('twitter_profile_url');
    table.dropColumn('facebook_profile_url');
    table.dropColumn('linkedin_profile_url');
    table.dropColumn('why_write_letters');
  })
};
