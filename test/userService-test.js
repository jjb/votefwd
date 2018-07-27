'use strict';

var expect = require('chai').expect;

var db = require('../server/db');
var userService = require('../server/userService');

var users = [];

describe('userService', function() {
  before(function() {
    return db('users')
      .insert([{
        auth0_id: 'test-auth0-id-0',
        full_name: 'Regular Joe'
      }, {
        auth0_id: 'test-auth0-id-1',
        full_name: 'Admin Sally',
        is_admin: true
      }])
      .returning('*')
      .tap(function(result) {
        users = result;
      });
  });

  after(function() {
    if (users && users.length) {
      return db('users')
        .whereIn('id', users.map(u => u.id))
        .del();
    }
    return Promise.resolve(true);
  });


  describe('isAdmin', function() {
    it('should find a non-admin', function(done) {
      userService.isAdmin(users[0].auth0_id, function(error, isAdmin) {
        if (error) {
          return done(error);
        }
        expect(isAdmin).to.be.false;
        done();
      });
    });

    it('should find an admin', function(done) {
      userService.isAdmin(users[1].auth0_id, function(error, isAdmin) {
        if (error) {
          return done(error);
        }
        expect(isAdmin).to.be.true;
        done();
      });
    });

    it('should consider missing user not an admin', function(done) {
      userService.isAdmin(users[0].auth0_id + 'MISSING', function(error, isAdmin) {
        if (error) {
          return done(error);
        }
        expect(isAdmin).to.be.false;
        done();
      });
    });
  });

  describe('updateUserQualifiedState', function() {
    it('should fail on an invalid qualified state', function(done) {
      userService.updateUserQualifiedState(users[0].auth0_id, 'somethingFakeAndNotValid', function(error, newState) {
        expect(error).to.be.eql('invalidEnum', 'incorrect or missing error for test. Expected: invalidEnum. Got: ' + error);
        expect(newState).to.be.a('null');
        done();
      });
    });

    it('should succeed on setting qualified state to banned', function(done) {
      userService.updateUserQualifiedState(users[0].auth0_id, 'banned', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('banned', 'incorrect or missing newState for test. Expected: banned. Got: ' + newState);
        done();
      });
    });

    it('should succeed on setting qualified state to pre_qualified', function(done) {
      userService.updateUserQualifiedState(users[0].auth0_id, 'pre_qualified', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('pre_qualified', 'incorrect or missing newState for test. Expected: pre_qualified. Got: ' + newState);
        done();
      });
    });

    it('should succeed on setting qualified state to qualified', function(done) {
      userService.updateUserQualifiedState(users[0].auth0_id, 'qualified', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('qualified', 'incorrect or missing newState for test. Expected: qualified. Got: ' + newState);
        done();
      });
    });

    it('should succeed on setting qualified state to super_qualified', function(done) {
      userService.updateUserQualifiedState(users[0].auth0_id, 'super_qualified', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('super_qualified', 'incorrect or missing newState for test. Expected: super_qualified. Got: ' + newState);
        done();
      });
    });

  });
});
