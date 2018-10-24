'use strict';

const view = 'bundles'

exports.up = function(knex, Promise) {
  const createView =
  `drop view ${view};
   create or replace view ${view} as
   select x.adopter_user_id,
          x.adopted_at,
          extract(epoch from x.adopted_at) as epoch,
          x.district_id,
          x.prepped - x.sent as prepped_count,
          x.sent as sent_count,
          x.count - x.prepped - x.sent as unprepped_count
   from (select   adopted_at, adopter_user_id, district_id,
                  count(confirmed_prepped_at) as prepped,
                  count(confirmed_sent_at) as sent,
                  count(*)
         from     voters
         where    adopter_user_id is not null
         group by adopted_at, adopter_user_id, district_id
         )
         as x
   group by x.adopter_user_id, x.adopted_at, x.district_id, x.prepped, x.sent, x.count;`
  return knex.raw(createView);

};

exports.down = function(knex, Promise) {   
   const createView =
  `drop view ${view};
   create view ${view} as
   select x.adopter_user_id,
          x.adopted_at,
          extract(epoch from x.adopted_at) as epoch,
          x.district_id,
          sum(x.prepped::int) - sum(x.sent::int) as prepped_count,
          sum(x.sent::int) as sent_count,
          sum(x.count) - sum(x.prepped::int) - sum(x.sent::int) as unprepped_count
   from (select   adopted_at, adopter_user_id, district_id,
                  confirmed_prepped_at is not null as prepped,
                  confirmed_sent_at is not null as sent,
                  count(*)
         from     voters
         where    adopter_user_id is not null
         group by adopted_at, adopter_user_id, district_id, confirmed_prepped_at, confirmed_sent_at)
         as x
   group by x.adopter_user_id, x.adopted_at, x.district_id;`
  return knex.raw(createView);
};
