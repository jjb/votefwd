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

module.exports = {
  getDistrict
}
