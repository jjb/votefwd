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
  // This function should only be called by admins and verified through a middlewear.

  // check that we have a valid qual state
  var newState = QualStateEnum[qualState];
  if (newState == null){
    //return an error in callback
    callback("invalidEnum", null);
    return;
  }
  // update that state for the user
  db('users')
  .where({auth0_id: auth0_id})
  .update({qual_state: newState})
  .then(function() {
    callback(null, newState);
    return;
  })
  .catch(err => {
      console.error(err);
      callback(err);
  });
}

module.exports = {
  isAdmin,
  updateEmail,
  updateUserQualifiedState
}
