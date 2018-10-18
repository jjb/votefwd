'use strict';

exports.up = function(knex, Promise) {
  return knex.raw(`
    UPDATE districts
    SET
      available_voter_count=
      (select count(1) from voters where voters.district_id=districts.district_id and voters.adopter_user_id is null)
    `);
};

exports.down = function(knex, Promise) {
  return knex.raw(`
    update
      districts 
    set 
      districts.available_voter_count=null
    `);
};
