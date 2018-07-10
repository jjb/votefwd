//userService.js
'use strict'

var db = require('./db');

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

module.exports = {
  isAdmin
}
