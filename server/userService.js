//userService.js
'use strict'

var db = require('./db');

// What level of permissions does this user have?
const QualStateEnum = {
  banned: 1, // not allowed on the platform
  pre_qualified: 2, // awaiting account review
  qualified: 3, // approved for limited activity
  super_qualified: 4, // approved for all activity
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

module.exports = {
  isAdmin,
  updateEmail
}
