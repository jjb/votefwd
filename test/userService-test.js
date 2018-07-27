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

  describe('canAdoptMoreVoters', function() {
    it('should consider a missing user to have no more adoptees', function(done) {
      userService.canAdoptMoreVoters(users[0].auth0_id + 'MISSING', function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(0);
        done();
      });
    });

    it('should offer no voters to a banned user', function(done) {
      userService.canAdoptMoreVoters(users[2].auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(0);
        done();
      });
    });

    it('should offer no voters to a pre-qualified user', function(done) {
      userService.canAdoptMoreVoters(users[3].auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(0);
        done();
      });
    });

    it('should offer 100 voters to a qualified user', function(done) {
      userService.canAdoptMoreVoters(users[4].auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(100);
        done();
      });
    });

    it('should offer 1000 voters to a qualified user', function(done) {
      userService.canAdoptMoreVoters(users[5].auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(1000);
        done();
      });
    });

    // Will get to this when we have better handling of test data
    it('should calculate the remaining voters allowed');
  });
});
