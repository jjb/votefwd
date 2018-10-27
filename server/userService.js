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

function updateEmail(auth0_id, newEmail, callback) {
  db('users')
    .where({auth0_id: auth0_id})
    .update({email: newEmail})
    .then(function(result) {
      callback(null, result);
    })
    .catch(callback);
}

function findUserByAuth0Id(auth0Id, callback) {
  db('users')
    .first()
    .where('auth0_id', auth0Id)
    .then(function(result) {
      callback(null, result);
    })
    .catch(callback);
}

// Looks for a user with the same email address but a different auth0_id
function findDuplicateUserByEmail(auth0Id, email, callback) {
  db('users')
    .first()
    .where('email', email)
    .whereNot('auth0_id', auth0Id)
    .then(function(result) {
      callback(null, result);
    })
    .catch(callback);
}
// Finds all users with a duplicate account
function findDuplicateUserEmails() {
  return db.raw(`
  select 
    count(users.id), 
    users.email
  from
    users
  group by
    users.email
  having 
    count(users.id) > 1
  `);
}
function createUser({ auth0_id, email }, callback) {
  db('users')
    .insert({ auth0_id, email })
    .returning('*')
    .then(function(results) {
      if (results && results.length) {
        callback(null, results[0]);
      }
      else {
        callback(null, null);
      }
    })
    .catch(callback);
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

function batchApprovePending(callback){
  // This function should only be called by admins and verified through
  // a middleware.
  db('users')
  .whereRaw("qual_state = 'pre_qualified' and created_at < NOW() - interval '10 min' and length(why_write_letters) > 0")
  .update({qual_state: QualStateEnum.qualified})
  .returning(['email', 'qual_state'])
  .then(function(users) {
    users.forEach(function(user) {
      notifyUserOfBasicQualifiedState(user);
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
  console.log("Notifying user of updated status.");
  if (user['qual_state'] == QualStateEnum.pre_qualified && newState == QualStateEnum.qualified) {
    //notify users when promoted to qualified
    return notifyUserOfBasicQualifiedState(user);
  } else if ((user['qual_state'] == QualStateEnum.pre_qualified || user['qual_state'] == QualStateEnum.qualified) && newState == QualStateEnum.super_qualified) {
    if (process.env.NODE_ENV !== 'test') {
      //notify users when promoted to super_qualified
      emailService.sendEmail('super_qualified', user, 'You\'re a super-volunteer on Vote Forward!');
    }
    return 'sent super_qualified email';
  }

  return 'not sending an email';

}

function notifyUserOfBasicQualifiedState(user) {
  if (process.env.NODE_ENV !== 'test') {
    console.log("Notifing user of basic approval.");
    emailService.sendEmail('qualified', user, 'You\'re approved to send letters on Vote Forward');
  }
  return 'sent qualified email';
}
/**
 * 
 * @param {Object} params 
 * @param {Boolean} params.count - boolean to indicate whether to return user counts vs. user records
 * @param {String} params.preppedLetters - Set to 'NOTPREPPED' to return users who have some voters not prepped
 *                                       - or 'NOTSENT' to return users who haven't sent the letters yet
 *  
 */
function getUsers(params) {
  let columnToCheck;
  if (['NOTPREPPED'].indexOf(params.preppedLetters) >= 0) {
    columnToCheck = 'voters.confirmed_prepped_at';
  } else if (params.preppedLetters === 'NOTSENT') {
    columnToCheck = 'voters.confirmed_sent_at';
  }
  const query = db('users')
    .whereExists(function() {
      this.select('id')
        .from('voters')
        .whereRaw('users.auth0_id = voters.adopter_user_id')
    });
  if (params.count) {
    query.count("id").as('user_count');
    query.whereExists(function() {
      this.select('id')
        .from('voters')
        .whereRaw('users.auth0_id = voters.adopter_user_id')
        .whereNull(columnToCheck)
    });

    query.first();
  } else {
    query
      .select(
        "users.id", 
        "users.email", 
        "users.auth0_id", 
        "users.full_name", 
        "users.qual_state",
        "users.zip",
        "users.created_at",
        "users.full_name"
      )
      .select(db.raw("split_part(users.auth0_id,'|',1) as identity_provider"))
      .select(db.raw("sum(case when voters.confirmed_prepped_at is null then 0 else 1 end) as prepped_count"))
      .select(db.raw("sum(case when voters.confirmed_prepped_at is null then 1 else 0 end) as remaining_count"))
      .select(db.raw("sum(case when voters.confirmed_sent_at is null then 1 else 0 end) as to_send_count"))
      .select(db.raw("count(voters.id) as adopted_count"))
      .count("users.id").as("voters_to_prep")
      .innerJoin("voters", "users.auth0_id", "voters.adopter_user_id")
      .groupBy("users.id", "users.email", "users.auth0_id", "users.full_name",db.raw("split_part(users.auth0_id,'|',1)"));
    }
  if (params.preppedLetters === 'NOTPREPPED') {
    query.select(db.raw(`'Not Prepped' as prep_status`));
    query.select(db.raw(`'NOTPREPPED' as prepped_letters`));
  } else if (params.preppedLetters === 'NOTSENT') {
    query.select(db.raw(`'Some Not Sent' as prep_status`));
    query.select(db.raw(`'NOTSENT' as prepped_letters`));
  }
  return query;
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
  createUser,
  getUsers,
  findDuplicateUserByEmail,
  findUserByAuth0Id,
  isAdmin,
  updateEmail,
  updateUserQualifiedState,
  notifyUserOfNewQualifiedState,
  notifyUserOfBasicQualifiedState,
  findDuplicateUserEmails,
  _prepForTests
}
