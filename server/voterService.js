 //voterService.js
'use strict'

var db = require('./db');
var emailService = require('./emailService');

var letterService = require('./letterService');
var slackService = require('./slackService');
var userService = require('./userService');

const allowedVoterBulkCount = [1, 2, 5, 15, 30, 60];
let adoptionOrder = 'RANDOM()';

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
    console.error("invalid number of voters requested %s", numVoters);
    callback(new Error('Invalid number of voters requested'));
    return;
  }

  userService.canAdoptMoreVoters(adopterId, function(error, numCanAdopt) {
    if (error) {
      callback(error);
      return;
    }
    if (numCanAdopt <= 0) {
      callback(null, []);
      return;
    }

    let numToAdopt = Math.min(numVoters, numCanAdopt);
    _adoptSomeVoters(adopterId, numToAdopt, callback);
  });
}

function _adoptSomeVoters(adopterId, numVoters, callback) {
  db('voters')
    .count()
    .where('adopter_user_id', null)
    .then(function(results) {
      let availableVoterCount = results[0].count;
      if (availableVoterCount < numVoters) {
        console.error("not enough available voters.");
        callback(null, []);
        return;
      }

      db('voters')
        .where('adopter_user_id', null)
        .orderByRaw(adoptionOrder)
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
                  if (num_finished_calls === voters.length){
                    callback(null, voters_to_return);
                  }
                });
              }
            })
            .then(function() {
              slackService.publishToSlack('A user adopted ' + numVoters + ' voters.');
            })
            .catch(err => {
              console.error(err);
              callback(err);
            });
        })
        .catch(err => {
          console.error(err);
          callback(err);
        });
    })
    .catch(err => {
      console.error(err);
      callback(err);
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
    .then(function() {
      slackService.publishToSlack('A user marked a letter prepped.');
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
    .then(function() {
      slackService.publishToSlack('A user marked a letter *not* prepped.');
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
    .then(function() {
      slackService.publishToSlack('A user marked a letter sent.');
    })
    .catch(err => {
      console.error(err)
    });
}

function undoConfirmSent(voterId, callback) {
  db('voters')
    .where('id', voterId)
    .update({
      confirmed_sent_at: null,
      updated_at: db.fn.now()
    })
    .then(function(result) {
      getVoterById(voterId, function(voter) {
        callback(voter);
      })
    })
    .then(function() {
      slackService.publishToSlack('A user marked a letter *not* sent.');
    })
    .catch(err => {
      console.error(err)
    });
}

function makePledge(code, callback) {
  db('voters')
  .where('hashid', code)
  .then(function(result){
    if (result[0] == null){
      // should we tell them we couldnt find it? This will just succeed and move on.
      // I think we should probably, yes.
      callback('invalid code');
      return;
    }
    if (result[0].pledge_made_at != null){
      // check if already pledge and exit early if yes
      callback('already pledged');
      return;
    }
    // get the pledge row and update it with pledge time
    db('voters')
    .where('hashid', code)
    .update({
      pledge_made_at: db.fn.now(),
      updated_at: db.fn.now()
    })
    // send an email to the person who wrote the letter telling them a pledge was made
    .then(getLetterWritingUserFromPledge(code)
      .then(function(user){
        emailService.sendEmail('pledge', user, 'One of your unlikely voters pledged to vote!');
      })
    )
    .then(function() {
      slackService.publishToSlack('A recipient made a vote pledge.');
    })
    .then(function() {
      callback('successful pledge');
    })
    .catch(err => {
      console.error(err)
    });
  });
}

var getLetterWritingUserFromPledge = function getLetterWritingUserFromPledge(code){
  return new Promise(function(resolve, reject) {
    db('voters')
    .where('hashid', code)
    .then(function(result){
      db('users')
      .where('auth0_id', result[0].adopter_user_id)
      .then(function(result){
        resolve(result[0]);
      })
    })
    .catch(err => {
      reject(err);
    });
  });
}

function _prepForTests() {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Someone is calling _prepForTests outside of tests');
    return;
  }

  allowedVoterBulkCount.push(256);
  adoptionOrder = 'id DESC';
}

module.exports = {
  getVoterById,
  getUsersAdoptedVoters,
  downloadAllLetters,
  adoptRandomVoter,
  confirmSent,
  undoConfirmSent,
  confirmPrepped,
  undoConfirmPrepped,
  makePledge,
  _prepForTests
}
