//userService.js
'use strict'

var db = require('./db');

// What level of permissions does this user have?
const QualStateEnum = {
  banned: 'banned', // not allowed on the platform
  pre_qualified: 'pre_qualified', // awaiting account review
  qualified: 'qualified', // approved for limited activity
  super_qualified: 'super_qualified', // approved for all activity
}

// Number of voters allowed for adoption for each qualification level
const AllowedVoterAdoption = {
  banned: 0,
  pre_qualified: 0,
  qualified: 100,
  super_qualified: 1000
};

function isAdmin(auth0_id, callback) {
  db('users')
    .first('is_admin')
    .where({
      'auth0_id': auth0_id,
      'is_admin': true
    })
    .then(function(result) {
      if (result && result.is_admin === true) {
        callback(null, true);
        return;
      }
      callback(null, false);
    })
    .catch(err => {
      console.error(err);
      callback(err);
    });
}

function updateEmail(auth0_id, newEmail) {
  db('users')
  .where({auth0_id: auth0_id})
  .update({email: newEmail})
  .then(function(result) {
    return;
  });
}

/**
 * Callback with number of allowed voters
 */
function canAdoptMoreVoters(auth0_id, callback) {
  db('users')
    .first('qual_state')
    .where({
      'auth0_id': auth0_id
    })
    .then(function(result) {
      // If there is no user then just send back 0
      if (!result) {
        callback(null, 0);
        return;
      }
      let qualState = result.qual_state;
      let allowed = AllowedVoterAdoption[qualState];
      if (allowed === 0) {
        callback(null, 0);
        return;
      }
      db('voters')
        .count()
        .where('adopter_user_id', auth0_id)
        .then(function(results) {
          let count = results[0].count;
          let remaining = Math.max(0, allowed - count);
          callback(null, remaining);
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

module.exports = {
  canAdoptMoreVoters,
  isAdmin,
  updateEmail
}
