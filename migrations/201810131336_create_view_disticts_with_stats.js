'use strict';

const view = 'districts_with_stats'
exports.up = function(knex, Promise) {
  const createView = `create or replace view ${view} as
   select d.district_id, d.state, d.description, count(*) as available_voter_count
   from   districts d
   join   voters    v on v.district_id = d.district_id
   where  v.adopter_user_id is null
   group by d.district_id, d.state, d.description
   union
   select d.district_id, d.state, d.description, 0 as available_voter_count
   from   districts d
   where  not exists (select * from voters v
                      where v.district_id = d.district_id
                      and   v.adopter_user_id is null);`
  return knex.raw(createView);
};

exports.down = function(knex, Promise) {
  return knex.raw(`drop view ${view}`);
};
