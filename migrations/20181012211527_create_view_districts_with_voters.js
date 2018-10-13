'use strict';

exports.up = function(knex, Promise) {
  const createView =
  `create or replace view districts_with_voters as
  select d.*
  from districts d
  where exists (
      select * from voters v
      where v.district_id = d.district_id);`
  return knex.raw(createView);
};

exports.down = function(knex, Promise) {
  return knex.raw(`drop view districts_with_voters`);
};
