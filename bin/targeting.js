'use strict';

var db = require('../server/db');

var voters = db.select().table('voters')
  .then(function(result) {
    return result;
    });

console.log(voters.length);

function updateVoterSuffix(dwid) {
  db('voters')
    .where('registration_id', dwid)
    .update({
      suffix: 'JR'
    })
    .catch(err => {
      console.error(err);
    });
}

updateVoterSuffix(9912895);
