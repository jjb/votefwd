 //voterService.js
'use strict'

var db = require('./src/db');

function getVoterById(voterId) {
  var query = db.select().table('voters');
  query.where('id', voterId)
    .then(function(result) {
      return result;
    });
}

function getUsersAdoptedVoters(userId, callback) {
  var query = db.select().table('voters')
  query.where('adopter_user_id', userId)
    .then(function(result) {
      callback(result);
    })
    .catch(err => {
      console.error(err);
    });
}


function getRandomVoter(callback) {
  // TODO: make this actually random
  var query = db.select().table('voters');
  query.where('adopter_user_id', null).limit(1)
    .then(function(result) {
      callback(result);
    });
}

function updateVoter(voter) {
}

// 2. take a voter object 
// validate it
// compare it to the corresponding voter record in the db
// update it if anything has changed
// return it.

module.exports = {
  getVoterById,
  getUsersAdoptedVoters,
  getRandomVoter
}
