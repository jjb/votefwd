 //voterService.js
'use strict'

var db = require('./db');
var emailService = require('./emailService');

var letterService = require('./letterService');
const allowedVoterBulkCount = [1, 2, 5, 15, 30, 60];

function getVoterById(voterId, callback) {
  db.select().table('voters')
    .where('id', voterId)
    .then(function(result) {
      if (callback) {
        callback(result);
        return;
      }
      return result;
    });
}

function getUsersAdoptedVoters(userId, callback) {
  db('voters')
    .where('adopter_user_id', userId)
    .then(function(result) {
      //TODO: process the voter array to return signed PDF urls
      callback(result);
    })
    .catch(err => {
      console.error(err);
    });
}

function adoptRandomVoter(adopterId, numVoters, callback) {
  if (allowedVoterBulkCount.includes(numVoters) !== true){
    //user requested a weird number of voters, deny!
    console.error("invalid number of voters requested");
    return; //should we return a 500? idk
  }
  db('voters')
    .where('adopter_user_id', null)
    .orderByRaw('RANDOM()')
    .limit(numVoters)
    .then(function(voters) {
      var ids = voters.map(voter => voter.id)
      db('voters')
        .whereIn('id', ids)
        .update({
          adopter_user_id: adopterId,
          adopted_at: db.fn.now(),
          updated_at: db.fn.now()
        })
        .then(function() {
          var voters_to_return = [];
          for (var i = 0; i < voters.length; i++){
            var voter = voters[i];
            var num_finished_calls = 0;
            letterService.generateAndStorePdfForVoter(voter, function(voter) {
              num_finished_calls += 1;
              voters_to_return.push(voter)
              if (num_finished_calls == voters.length){
                callback(voters_to_return);
              }
            });
          }
        })
        .catch(err => {
          console.error(err);
        })
    })
    .catch(err => {
      console.error(err);
    });
}

function downloadAllLetters(userId, callback) {
  db('voters')
    .where('adopter_user_id', userId)
    .where('confirmed_prepped_at', null)
    .then(function(voters) {
      letterService.generateBulkPdfForVoters(voters, callback)
    })
    .catch(err => {
      console.error(err);
    });
}

function confirmPrepped(voterId, callback) {
  db('voters')
    .where('id', voterId)
    .update({
      confirmed_prepped_at: db.fn.now(),
      updated_at: db.fn.now()
    })
    .then(function(result) {
      getVoterById(voterId, function(voter) {
        callback(voter);
      })
    })
    .catch(err => {
      console.error(err)
    });
}

function undoConfirmPrepped(voterId, callback) {
  db('voters')
    .where('id', voterId)
    .update({
      confirmed_prepped_at: null,
      updated_at: db.fn.now()
    })
    .then(function(result) {
      getVoterById(voterId, function(voter) {
        callback(voter);
      })
    })
    .catch(err => {
      console.error(err)
    });
}

function confirmSent(voterId, callback) {
  db('voters')
    .where('id', voterId)
    .update({
      confirmed_sent_at: db.fn.now(),
      updated_at: db.fn.now()
    })
    .then(function(result) {
      getVoterById(voterId, function(voter) {
        callback(voter);
      })
    })
    .catch(err => {
      console.error(err)
    });
}

function makePledge(code, callback) {
  console.log('hi we are sending pledge email')
  emailService.sendEmail();
  console.log('hi we are sending pledge email')
  // db('voters')
  //   .where('hashid', code)
  //   .update({
  //     pledge_made_at: db.fn.now(),
  //     updated_at: db.fn.now()
  //   })
  //   .then(function(result) {
  //     callback(result);
  //   })
  //   .catch(err => {
  //     console.error(err)
  //   });
}

module.exports = {
  getVoterById,
  getUsersAdoptedVoters,
  downloadAllLetters,
  adoptRandomVoter,
  confirmSent,
  confirmPrepped,
  undoConfirmPrepped,
  makePledge
}
