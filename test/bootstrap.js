'use strict';

var db = require('../server/db');

// Runs Mocha hooks that apply for all tests

// Starts up the server
var server = require('../server/server');

before('Adding user data to the database', function() {
  var context = this;
  return db('users')
    .insert([{
      auth0_id: 'test-auth0-id-0',
      full_name: 'Regular Joe',
      email: 'reggo_joe@schmoe.com'
    }, {
      auth0_id: 'test-auth0-id-1',
      full_name: 'Admin Sally',
      is_admin: true,
      email: 'sallyboss@bigboss.com'
    }, {
      auth0_id: 'test-auth0-id-2',
      full_name: 'Banned Billy',
      qual_state: 'banned',
      email: 'billy_da_grifter@grifthub.com'
    }, {
      auth0_id: 'test-auth0-id-3',
      full_name: 'Prequal Patty',
      qual_state: 'pre_qualified',
      email: 'pattycake@pattycake.com'
    }, {
      auth0_id: 'test-auth0-id-4',
      full_name: 'Qualified Quincy',
      qual_state: 'qualified',
      email: 'quincy@qal.com'
    }, {
      auth0_id: 'test-auth0-id-5',
      full_name: 'Superqual Cindy',
      qual_state: 'super_qualified',
      email: 'cinderella@shoe.com'
    }, {
      auth0_id: 'test-auth0-id-6',
      full_name: 'Testqual Timmy',
      qual_state: 'test_qualified' // only valid for tests
    }, {
      auth0_id: 'test-auth0-id-7',
      full_name: 'Fullup Francis',
      qual_state: 'test_qualified' // only valid for tests
    }])
    .returning('*')
    .tap(function(result) {
      context.users = {
        all: result,
        regular: result[0],
        admin: result[1],
        banned: result[2],
        prequal: result[3],
        qual: result[4],
        superqual: result[5],
        testqual: result[6],
        full: result[7]
      };
    });
});

before('Adding voter data to the database', function() {
  var context = this;
  // The test-qualified user
  var user = context.users.testqual;
  // The user with all voter adoptions full
  var full = context.users.full;
  return db('voters')
    .insert([{
      hashid: 'test-hash-id-0',
      district_id: 'GA06'
    }, {
      hashid: 'test-hash-id-1',
      adopter_user_id: user.auth0_id,
      adopted_at: db.fn.now(),
      district_id: 'GA06'
    }, {
      hashid: 'test-hash-id-2',
      adopter_user_id: user.auth0_id,
      adopted_at: db.fn.now(),
      district_id: 'GA06'
    }, {
      hashid: 'test-hash-id-3',
      district_id: 'GA06'
    }, {
      hashid: 'test-hash-id-4',
      adopter_user_id: full.auth0_id,
      adopted_at: db.fn.now(),
      district_id: 'GA06'
    }, {
      hashid: 'test-hash-id-5',
      adopter_user_id: full.auth0_id,
      adopted_at: db.fn.now(),
      confirmed_prepped_at: db.fn.now(),
      district_id: 'GA06'
    }, {
      hashid: 'test-hash-id-6',
      adopter_user_id: full.auth0_id,
      adopted_at: db.fn.now(),
      confirmed_prepped_at: db.fn.now(),
      district_id: 'GA06'
    }, {
      hashid: 'test-hash-id-7',
      adopter_user_id: full.auth0_id,
      adopted_at: db.fn.now(),
      confirmed_prepped_at: db.fn.now(),
      confirmed_sent_at: db.fn.now(),
      district_id: 'GA06'
    }, {
      hashid: 'test-hash-id-8',
      adopter_user_id: full.auth0_id,
      adopted_at: db.fn.now(),
      district_id: 'GA06'
    }])
    .returning('*')
    .tap(function(result) {
      context.voters = {
        all: result
      };
    });
});

after('Deleting voter data from the database', function() {
  var context = this;
  var voters = context.voters;
  if (voters && voters.all && voters.all.length) {
    return db('voters')
      .whereIn('id', voters.all.map(u => u.id))
      .del();
  }
  return Promise.resolve(true);
});

after('Deleting user data from the database', function() {
  var context = this;
  var users = context.users;
  if (users && users.all && users.all.length) {
    return db('users')
      .whereIn('id', users.all.map(u => u.id))
      .del();
  }
  return Promise.resolve(true);
});

after('Shutting down the server', function(done) {
  server.close(function() {
    done();
  });
});

after('Shutting down the database', function() {
  return db.destroy();
});
