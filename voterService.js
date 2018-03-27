 //voterService.js
'use strict'

var db = require('./src/db');

function getVoterById(voterId) {
  db.select().table('voters')
    .query.where('id', voterId)
    .then(function(result) {
      return result;
    });
}

function getUsersAdoptedVoters(userId, callback) {
  db('voters')
    .where('adopter_user_id', userId)
    .then(function(result) {
      callback(result);
    })
    .catch(err => {
      console.error(err);
    });
}


function getRandomVoter(callback) {
  // TODO: make this actually random
  db('voters')
    .where('adopter_user_id', null).limit(1)
    .then(function(result) {
      callback(result);
    })
    .catch(err => {
      console.error(err);
    });
}

function adoptVoter(voterId, adopterId, callback) {
  db('voters')
    .where('id', voterId)
    .update({
      adopter_user_id: adopterId,
      adoption_timestamp: db.fn.now(),
      updated_at: db.fn.now()
    })
    .then(function(result) {
      callback(result);
    })
    .catch(err => {
      console.error(err);
    });
}

function confirmSend(voterId, callback) {
  db('voters')
    .where('id', voterId)
    .update({
      plea_letter_sent_timestamp: db.fn.now(),
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
  getRandomVoter,
  adoptVoter,
  confirmSend
}
