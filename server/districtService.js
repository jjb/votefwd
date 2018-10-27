//districtService.js
'use strict'

const db = require('./db');
const mem = require("mem")
let dbhits = 0;
function getDistrictFromDB(district_id) {
  dbhits += 1;
  return db('districts')
  .select("*")
  .first()
  .where({district_id: district_id});
}
// Cache the district so we don't have to hit the db each time
const getDistrict = mem(getDistrictFromDB);

function getDistrictWithStats(district_id) {
  return
    db.raw(`select
      count(users.id) as num_users_using_district,
      voters_agg.voters_available,
      voters_agg.voters_adopted,
      voters_agg.letters_prepped,
      voters_agg.letters_sent,
      districts.district_id,
      districts.state,
      districts.state_abbr,
      districts.district_num,
      districts.description,
      districts.display_name,
      districts.why_this_district,
      districts.url_election_info,
      districts.url_wikipedia,
      districts.url_ballotpedia,
      districts.url_swingleft,
      districts.lat,
      districts.long,
      districts.return_address,
      districts.ra_city,
      districts.ra_state,
      districts.ra_zip
      from districts
      left join users
      on districts.district_id = users.current_district
      left join (
          select
          sum(available) voters_available,
          sum(adopted) voters_adopted,
          sum(prepped) letters_prepped,
          sum(sent) letters_sent,
          district_id
          from (
              select
              district_id,
              case when adopted_at is null
                  and confirmed_prepped_at is null
                  and confirmed_sent_at is null then 1
                  else 0
              end as available,
              case when adopted_at is not null
                  and confirmed_prepped_at is null
                  and confirmed_sent_at is null then 1
                  else 0
              end as adopted,
              case when confirmed_prepped_at is not null
                  and confirmed_sent_at is null then 1
                  else 0
              end as prepped,
              case when confirmed_prepped_at is not null
                  and confirmed_sent_at is not null then 1
                  else 0
              end as sent
              from voters
              where district_id = ?
          ) voters_case
          group by district_id
      ) voters_agg
      on districts.district_id = voters_agg.district_id
      where districts.district_id = ?
      group by voters_agg.voters_available, voters_agg.voters_adopted, voters_agg.letters_prepped, voters_agg.letters_sent, districts.district_id, districts.state, districts.state_abbr, districts.district_num, districts.description,districts.display_name,districts.why_this_district, districts.url_election_info, districts.url_wikipedia, districts.url_ballotpedia, districts.url_swingleft, districts.lat, districts.long, districts.return_address, districts.ra_city, districts.ra_state, districts.ra_zip`,
      [district_id, district_id]
    );
}

module.exports = {
  getDistrict,
  // Cache the results of the district stats query since it is hard on the db
  getDistrictWithStats: mem(getDistrictWithStats, {
    maxAge: 30 /* minutes */ * 60 /* seconds */ * 1000 /* ms */
  })
}
