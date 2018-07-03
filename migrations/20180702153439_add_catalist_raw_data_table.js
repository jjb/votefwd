'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('catalist_raw', function (table) {
    table.string('dwid'),
    table.string('state'),
    table.string('hhid1'),
    table.string('hhid2'),
    table.string('name_prefix'),
    table.string('first_name'),
    table.string('middle_name'),
    table.string('last_name'),
    table.string('name_suffix'),
    table.string('age'),
    table.string('gender'),
    table.string('race'),
    table.string('registration_address_line_1'),
    table.string('registration_address_line_2'),
    table.string('registration_address_city'),
    table.string('registration_address_state'),
    table.string('registration_address_zip'),
    table.string('registration_address_zip_plus_4'),
    table.string('mail_address_line_1'),
    table.string('mail_address_line_2'),
    table.string('mail_address_city'),
    table.string('mail_address_state'),
    table.string('mail_address_zip'),
    table.string('mail_address_zip_plus_4'),
    table.string('county_name'),
    table.string('township'),
    table.string('precinct_code'),
    table.string('precinct_name'),
    table.string('unique_precinct_code'),
    table.string('unique_precinct_name'),
    table.string('ward'),
    table.string('congressional_district'),
    table.string('state_house_district'),
    table.string('state_senate_district'),
    table.string('municipal_district'),
    table.string('school_board'),
    table.string('precinct_split'),
    table.string('city_council'),
    table.string('likely_cell'),
    table.string('likely_cell_restricted'),
    table.string('likely_cell_connectivity_score'),
    table.string('likely_cell_assignment_score'),
    table.string('likely_landline'),
    table.string('likely_landline_restricted'),
    table.string('likely_landline_connectivity_score'),
    table.string('likely_landline_assignment_score')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('catalist_raw');
};
