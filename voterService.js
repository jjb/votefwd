 //voterService.js
'use strict'

var db = require('./src/db');
var letterService = require('./letterService');

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

function adoptRandomVoter(adopterId, callback) {
  db('voters')
    .where('adopter_user_id', null)
    .orderByRaw('RANDOM()')
    .limit(1)
    .then(function(result) {
      let voter = result[0];
      db('voters')
        .where('id', voter.id)
        .update({
          adopter_user_id: adopterId,
          adopted_at: db.fn.now(),
          updated_at: db.fn.now()
        })
        .then(function() {
          console.log('Voter id: ' + voter.id);
          letterService.generatePdfForVoter(voter, function(signedUrl) {
              callback(voter, signedUrl);
            });
          })
        .catch(err => {
          console.error(err);
        })
    })
    .catch(err => {
      console.error(err);
    });
}

function confirmSend(voterId, callback) {
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
  db('voters')
    .where('hashid', code)
    .update({
      pledge_made_at: db.fn.now(),
      updated_at: db.fn.now()
    })
    .then(function(result) {
      callback(result);
    })
    .catch(err => {
      console.error(err)
    });
}

module.exports = {
  getVoterById,
  getUsersAdoptedVoters,
  adoptRandomVoter,
  confirmSend,
  makePledge
}
