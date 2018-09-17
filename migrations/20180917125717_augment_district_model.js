'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('districts', function(table) {
    table.string('why_this_district', 1024);
    table.string('display_name', 256);
    table.string('url_election_info', 512);
    table.string('url_wikipedia', 512);
    table.string('url_ballotpedia', 512);
    table.string('url_swingleft', 512);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('districts', function (table) {
    table.dropColumn('why_this_district');
    table.dropColumn('display_name');
    table.dropColumn('url_election_info');
    table.dropColumn('url_wikipedia');
    table.dropColumn('url_ballotpedia');
    table.dropColumn('url_swingleft');
  });
};
