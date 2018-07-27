'use strict';

var expect = require('chai').expect;

var db = require('../server/db');
var userService = require('../server/userService');

describe('userService', function() {
  describe('isAdmin', function() {
    it('should find a non-admin', function(done) {
      userService.isAdmin(this.users[0].auth0_id, function(error, isAdmin) {
        if (error) {
          return done(error);
        }
        expect(isAdmin).to.be.false;
        done();
      });
    });

    it('should find an admin', function(done) {
      userService.isAdmin(this.users[1].auth0_id, function(error, isAdmin) {
        if (error) {
          return done(error);
        }
        expect(isAdmin).to.be.true;
        done();
      });
    });

    it('should consider missing user not an admin', function(done) {
      userService.isAdmin(this.users[0].auth0_id + 'MISSING', function(error, isAdmin) {
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
      userService.canAdoptMoreVoters(this.users[0].auth0_id + 'MISSING', function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(0);
        done();
      });
    });

    it('should offer no voters to a banned user', function(done) {
      userService.canAdoptMoreVoters(this.users[2].auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(0);
        done();
      });
    });

    it('should offer no voters to a pre-qualified user', function(done) {
      userService.canAdoptMoreVoters(this.users[3].auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(0);
        done();
      });
    });

    it('should offer 100 voters to a qualified user', function(done) {
      userService.canAdoptMoreVoters(this.users[4].auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(100);
        done();
      });
    });

    it('should offer 1000 voters to a qualified user', function(done) {
      userService.canAdoptMoreVoters(this.users[5].auth0_id, function(error, numAdoptees) {
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

  describe('updateUserQualifiedState', function() {
    it('should fail on an invalid qualified state', function(done) {
      userService.updateUserQualifiedState(this.users[0].auth0_id, 'somethingFakeAndNotValid', function(error, newState) {
        expect(error).to.be.eql('invalidEnum', 'incorrect or missing error for test. Expected: invalidEnum. Got: ' + error);
        expect(newState).to.be.a('null');
        done();
      });
    });

    it('should succeed on setting qualified state to banned', function(done) {
      userService.updateUserQualifiedState(this.users[0].auth0_id, 'banned', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('banned', 'incorrect or missing newState for test. Expected: banned. Got: ' + newState);
        done();
      });
    });

    it('should succeed on setting qualified state to pre_qualified', function(done) {
      userService.updateUserQualifiedState(this.users[0].auth0_id, 'pre_qualified', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('pre_qualified', 'incorrect or missing newState for test. Expected: pre_qualified. Got: ' + newState);
        done();
      });
    });

    it('should succeed on setting qualified state to qualified', function(done) {
      userService.updateUserQualifiedState(this.users[0].auth0_id, 'qualified', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('qualified', 'incorrect or missing newState for test. Expected: qualified. Got: ' + newState);
        done();
      });
    });

    it('should succeed on setting qualified state to super_qualified', function(done) {
      userService.updateUserQualifiedState(this.users[0].auth0_id, 'super_qualified', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('super_qualified', 'incorrect or missing newState for test. Expected: super_qualified. Got: ' + newState);
        done();
      });
    });
  });

  describe('notifyUserOfNewQualifiedState', function() {
    it('should send a qualified email on promotion of pre_qualified to qualified', function(done) {
      var result = userService.notifyUserOfNewQualifiedState(this.users[0], 'qualified');
      expect(result).to.be.eql('sent qualified email');
      done();
    });

    it('should send a super_qualified email on promotion of pre_qualified to super_qualified', function(done) {
      var result = userService.notifyUserOfNewQualifiedState(this.users[0], 'super_qualified');
      expect(result).to.be.eql('sent super_qualified email');
      done();
    });

    it('should send a super_qualified email on promotion of pre_qualified to super_qualified', function(done) {
      var result = userService.notifyUserOfNewQualifiedState(this.users[4], 'super_qualified');
      expect(result).to.be.eql('sent super_qualified email');
      done();
    });

    it('should not send an email on banned', function(done) {
      var result = userService.notifyUserOfNewQualifiedState(this.users[4], 'banned');
      expect(result).to.be.eql('not sending an email');
      done();
    });

  });

});
