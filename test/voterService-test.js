'use strict';

var expect = require('chai').expect;

var db = require('../server/db');
var voterService = require('../server/voterService');

var users = [];
var voters = [];

describe('voterService', function() {
  before(function() {
    return db('users')
      .insert([{
        auth0_id: 'test-auth0-id-0',
        full_name: 'Regular Joe'
      }, {
        auth0_id: 'test-auth0-id-1',
        full_name: 'Regular Sally'
      }])
      .returning('*')
      .tap(function(result) {
        users = result;
      });
  });

  before(function() {
    return db('voters')
      .insert([{
        hashid: 'test-hash-id-0'
      }, {
        hashid: 'test-hash-id-1'
      }])
      .returning('*')
      .tap(function(result) {
        voters = result;
      });
  });

  after(function() {
    if (voters && voters.length) {
      return db('voters')
        .whereIn('id', voters.map(u => u.id))
        .del();
    }
    return Promise.resolve(true);
  });

  after(function() {
    if (users && users.length) {
      return db('users')
        .whereIn('id', users.map(u => u.id))
        .del();
    }
    return Promise.resolve(true);
  });

  describe('adoptRandomVoter', function() {
    before(function() {
      voterService._prepForTests();
    });

    it('should error if not a valid number of voters requested', function(done) {
      voterService.adoptRandomVoter(users[0], 10, function(error, adoptees) {
        expect(error).not.to.be.null;
        expect(error.message).to.eql('Invalid number of voters requested');
        done();
      });
    });

    it('should do nothing if not enough voters left', function(done) {
      voterService.adoptRandomVoter(users[0], 256, function(error, adoptees) {
        expect(adoptees.length).to.eql(0);
        done();
      });
    });

    it('should error if user is not allowed to adopt more voters');

    // Pending b/c we need to mock out letterService and slackService
    it('should let the user adopt voters');
  });
});
