 //voterService.js
'use strict'

var db = require('./db');
var emailService = require('./emailService');

var letterService = require('./letterService');
var slackService = require('./slackService');
var userService = require('./userService');

const allowedVoterBulkCount = [1, 5, 25, 50];
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
      callback(result);
    })
    .catch(err => {
      console.error(err);
    });
}

function adoptRandomVoter(adopterId, numVoters, districtId, callback) {
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
    _adoptSomeVoters(adopterId, numToAdopt, districtId, callback);
  });
}

function _adoptSomeVoters(adopterId, numVoters, districtId, callback) {
  db('voters')
    .count()
    .where('adopter_user_id', null)
    .where('district_id', districtId)
    .then(function(results) {
      let availableVoterCount = results[0].count;
      if (availableVoterCount < numVoters) {
        console.error("not enough available voters.");
        callback(null, []);
        return;
      }
      db('voters')
        .where('adopter_user_id', null)
        .where('district_id', districtId)
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
              callback(null, voters)
            })
            .then(function() {
              slackService.publishToSlack('A user adopted ' + numVoters + ' voters in ' + districtId + '.')
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

function downloadLetterToVoter(voterId, callback) {
  db('voters')
    .where('id', voterId)
    .then(function(voter) {
      letterService.generatePdfForVoters(voter, callback)
    })
    .catch(err => {
      console.error(err);
    });
}

function downloadAllLetters(userId, callback) {
  // Downloads all not-yet-prepped letters for a user
  db('voters')
    .where('adopter_user_id', userId)
    .where('confirmed_prepped_at', null)
    .then(function(voters) {
      letterService.generatePdfForVoters(voters, callback)
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

function getVoterSummaryByDistrict(callback) {
  db('voters')
    .select(
      'district_id',
      db.raw('sum(available) as available'),
      db.raw('sum(adopted) as adopted'),
      db.raw('sum(prepped) as prepped'),
      db.raw('sum(sent) as sent')
    )
    .from(function() {
      this.select(
        'district_id',
        db.raw(`
          case when adopted_at is null
                and confirmed_prepped_at is null
                and confirmed_sent_at is null then 1
                else 0
            end as available
                `),
        db.raw(`
          case when adopted_at is not null
                and confirmed_prepped_at is null
                and confirmed_sent_at is null then 1
                else 0
            end as adopted
          `),
        db.raw(`
          case when confirmed_prepped_at is not null
                and confirmed_sent_at is null then 1
                else 0
            end as prepped
          `),
        db.raw(`
          case when confirmed_prepped_at is not null
                and confirmed_sent_at is not null then 1
                else 0
            end as sent
          `)
        )
        .from('voters')
        .as('stats')
    })
    .groupBy('district_id')
    .then(function(results) {
      results = results.map(r => {
        r.available = parseInt(r.available);
        r.adopted = parseInt(r.adopted);
        r.prepped = parseInt(r.prepped);
        r.sent = parseInt(r.sent);
        return r;
      });
      callback(null, results);
    })
  .catch(err => {
    console.error(err);
    callback(err);
  });
}


function getAdoptedVoterSummary(callback) {
  db('voters')
    .select(
      'adopter_user_id',
      db.raw('sum(adopted) as adopted'),
      db.raw('sum(prepped) as prepped'),
      db.raw('sum(sent) as sent')
    )
    .from(function() {
      this.select(
        'adopter_user_id',
        db.raw(`
          case when adopted_at is not null
                and confirmed_prepped_at is null
                and confirmed_sent_at is null then 1
                else 0
            end as adopted
          `),
        db.raw(`
          case when confirmed_prepped_at is not null
                and confirmed_sent_at is null then 1
                else 0
            end as prepped
          `),
        db.raw(`
          case when confirmed_prepped_at is not null
                and confirmed_sent_at is not null then 1
                else 0
            end as sent
          `)
        )
        .from('voters')
        .whereNotNull('adopter_user_id')
        .as('stats')
    })
    .groupBy('adopter_user_id')
    .then(function(results) {
      results = results.map(r => {
        r.adopted = parseInt(r.adopted);
        r.prepped = parseInt(r.prepped);
        r.sent = parseInt(r.sent);
        r.total = r.adopted + r.prepped + r.sent;
        return r;
      });
      callback(null, results);
    })
    .catch(err => {
      console.error(err);
      callback(err);
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
    console.error('voterService._prepForTests called outside of tests');
    return;
  }

  allowedVoterBulkCount.push(256);
  adoptionOrder = 'id DESC';
}

module.exports = {
  getVoterById,
  getUsersAdoptedVoters,
  downloadLetterToVoter,
  downloadAllLetters,
  adoptRandomVoter,
  confirmSent,
  undoConfirmSent,
  confirmPrepped,
  undoConfirmPrepped,
  makePledge,
  getAdoptedVoterSummary,
  getVoterSummaryByDistrict,
  _prepForTests
}
