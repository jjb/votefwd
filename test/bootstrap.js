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
      full_name: 'Regular Joe'
    }, {
      auth0_id: 'test-auth0-id-1',
      full_name: 'Admin Sally',
      is_admin: true,
    }, {
      auth0_id: 'test-auth0-id-2',
      full_name: 'Banned Billy',
      qual_state: 'banned'
    }, {
      auth0_id: 'test-auth0-id-3',
      full_name: 'Prequal Patty',
      qual_state: 'pre_qualified'
    }, {
      auth0_id: 'test-auth0-id-4',
      full_name: 'Qualified Quincy',
      qual_state: 'qualified'
    }, {
      auth0_id: 'test-auth0-id-5',
      full_name: 'Superqual Cindy',
      qual_state: 'super_qualified'
    }])
    .returning('*')
    .tap(function(result) {
      context.users = result;
    });
});

before('Adding voter data to the database', function() {
  var context = this;
  return db('voters')
    .insert([{
      hashid: 'test-hash-id-0'
    }, {
      hashid: 'test-hash-id-1'
    }])
    .returning('*')
    .tap(function(result) {
      context.voters = result;
    });
});

after('Deleting voter data from the database', function() {
  var context = this;
  var voters = context.voters;
  if (voters && voters.length) {
    return db('voters')
      .whereIn('id', voters.map(u => u.id))
      .del();
  }
  return Promise.resolve(true);
});

after('Deleting user data from the database', function() {
  var context = this;
  var users = context.users;
  if (users && users.length) {
    return db('users')
      .whereIn('id', users.map(u => u.id))
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
