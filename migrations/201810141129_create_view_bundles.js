'use strict';

const view = 'bundles'
exports.up = function(knex, Promise) {
  const createView =
  `create or replace view ${view} as
   select x.adopter_user_id, x.adopted_at,
          sum(x.prepped::int) - sum(x.sent::int) as prepped_count,
          sum(x.sent::int) as sent_count,
          sum(x.count) - sum(x.prepped::int) - sum(x.sent::int) as unprepped_count
   from (select   adopted_at, adopter_user_id,
                  confirmed_prepped_at is not null as prepped,
                  confirmed_sent_at is not null as sent,
                  count(*)
         from     voters
         where    adopter_user_id is not null
         group by adopted_at, adopter_user_id, confirmed_prepped_at, confirmed_sent_at)
         as x
   group by x.adopter_user_id, x.adopted_at;`
  return knex.raw(createView);
};

exports.down = function(knex, Promise) {
  return knex.raw(`drop view ${view}`);
};
