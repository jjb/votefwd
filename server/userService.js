//userService.js
'use strict'

var db = require('./db');
var emailService = require('./emailService');

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
  qualified: parseInt(process.env.REACT_APP_QUAL_NUM || '100', 10),
  super_qualified: parseInt(process.env.REACT_APP_SUPERQUAL_NUM || '5000', 10)
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

function updateUserQualifiedState(auth0_id, qualState, callback){
  // takes an auth0_id of a user and a qualStateValue from QualStateEnum
  // and gives the user that state.
  // This function should only be called by admins and verified through
  // a middleware.

  // check that we have a valid qual state
  var newState = QualStateEnum[qualState];
  if (newState == null){
    //return an error in callback
    callback("invalidEnum", null);
    return;
  }
  // get the user for email sending and then update that state for the user
  db('users')
  .first()
  .where({auth0_id: auth0_id})
  .then(function(user){
    db('users')
    .where({auth0_id: auth0_id})
    .update({qual_state: newState})
    .then(function() {
      notifyUserOfNewQualifiedState(user, newState);
      callback(null, newState);
      return;
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

function batchApprovePending(auth0_ids, callback){
  // Takes a list of auth0_ids of users and approves them.
  //
  // This function should only be called by admins and verified through
  // a middleware.

  db('users')
  .whereIn('auth0_id', auth0_ids)
  .andWhere({qual_state: QualStateEnum.pre_qualified})
  .update({qual_state: QualStateEnum.qualified})
  .returning(['email', 'qual_state'])
  .then(function(users) {
    users.forEach(function(user) {
      notifyUserOfNewQualifiedState(user, QualStateEnum.qualified);
    });
    callback(null, QualStateEnum.qualified);
    return;
  })
  .catch(err => {
      console.error(err);
      callback(err);
  });
}

function notifyUserOfNewQualifiedState(user, newState){
  // this function takes a user right before their qualified state is changed and compares
  // their old state to their new state.  Depending on what changed we might want to send them
  // an email so they are aware of this change.
  // Note that user['qual_state'] is their *previous* state and newState is their just set current state.
  console.log("Notifying user of updated status.", user);
  if (user['qual_state'] == QualStateEnum.pre_qualified && newState == QualStateEnum.qualified) {
    //notify users when promoted to qualified
    if (process.env.NODE_ENV !== 'test') {
      emailService.sendEmail('qualified', user, 'You\'re approved to send letters on Vote Forward');
    }
    return 'sent qualified email';
  } else if ((user['qual_state'] == QualStateEnum.pre_qualified || user['qual_state'] == QualStateEnum.qualified) && newState == QualStateEnum.super_qualified) {
    if (process.env.NODE_ENV !== 'test') {
      //notify users when promoted to super_qualified
      emailService.sendEmail('super_qualified', user, 'You\'re a super-volunteer on Vote Forward!');
    }
    return 'sent super_qualified email';
  }

  return 'not sending an email';

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

function _prepForTests() {
  if (process.env.NODE_ENV !== 'test') {
    console.error('userService._prepForTests called outside of tests');
    return;
  }

  AllowedVoterAdoption.test_qualified = 5;
}

module.exports = {
  batchApprovePending,
  canAdoptMoreVoters,
  isAdmin,
  updateEmail,
  updateUserQualifiedState,
  notifyUserOfNewQualifiedState,
  _prepForTests
}
