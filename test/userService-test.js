'use strict';

var expect = require('chai').expect;

var db = require('../server/db');
var userService = require('../server/userService');

describe('userService', function() {
  before(function() {
    userService._prepForTests();
  });

  describe('isAdmin', function() {
    it('should find a non-admin', function(done) {
      userService.isAdmin(this.users.regular.auth0_id, function(error, isAdmin) {
        if (error) {
          return done(error);
        }
        expect(isAdmin).to.be.false;
        done();
      });
    });

    it('should find an admin', function(done) {
      userService.isAdmin(this.users.admin.auth0_id, function(error, isAdmin) {
        if (error) {
          return done(error);
        }
        expect(isAdmin).to.be.true;
        done();
      });
    });

    it('should consider missing user not an admin', function(done) {
      userService.isAdmin(this.users.regular.auth0_id + 'MISSING', function(error, isAdmin) {
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
      userService.canAdoptMoreVoters(this.users.regular.auth0_id + 'MISSING', function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(0);
        done();
      });
    });

    it('should offer no voters to a banned user', function(done) {
      userService.canAdoptMoreVoters(this.users.banned.auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(0);
        done();
      });
    });

    it('should offer no voters to a pre-qualified user', function(done) {
      userService.canAdoptMoreVoters(this.users.prequal.auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(0);
        done();
      });
    });

    it('should offer 100 voters to a qualified user', function(done) {
      userService.canAdoptMoreVoters(this.users.qual.auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(100);
        done();
      });
    });

    it('should offer 5000 voters to a super-qualified user', function(done) {
      userService.canAdoptMoreVoters(this.users.superqual.auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(5000);
        done();
      });
    });

    it('should calculate the remaining voters allowed', function(done) {
      userService.canAdoptMoreVoters(this.users.testqual.auth0_id, function(error, numAdoptees) {
        if (error) {
          return done(error);
        }
        expect(numAdoptees).to.eql(3);
        done();
      });
    });
  });

  describe('updateUserQualifiedState', function() {
    it('should fail on an invalid qualified state', function(done) {
      userService.updateUserQualifiedState(this.users.regular.auth0_id, 'somethingFakeAndNotValid', function(error, newState) {
        expect(error).to.be.eql('invalidEnum', 'incorrect or missing error for test. Expected: invalidEnum. Got: ' + error);
        expect(newState).to.be.a('null');
        done();
      });
    });

    it('should succeed on setting qualified state to banned', function(done) {
      userService.updateUserQualifiedState(this.users.regular.auth0_id, 'banned', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('banned', 'incorrect or missing newState for test. Expected: banned. Got: ' + newState);
        done();
      });
    });

    it('should succeed on setting qualified state to pre_qualified', function(done) {
      userService.updateUserQualifiedState(this.users.regular.auth0_id, 'pre_qualified', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('pre_qualified', 'incorrect or missing newState for test. Expected: pre_qualified. Got: ' + newState);
        done();
      });
    });

    it('should succeed on setting qualified state to qualified', function(done) {
      userService.updateUserQualifiedState(this.users.regular.auth0_id, 'qualified', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('qualified', 'incorrect or missing newState for test. Expected: qualified. Got: ' + newState);
        done();
      });
    });

    it('should succeed on setting qualified state to super_qualified', function(done) {
      userService.updateUserQualifiedState(this.users.regular.auth0_id, 'super_qualified', function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('super_qualified', 'incorrect or missing newState for test. Expected: super_qualified. Got: ' + newState);
        done();
      });
    });
  });

  describe('batchApprovePending', function() {
    it('should succeed on setting pre_qualified state to qualified', function(done) {
      userService.batchApprovePending(function(error, newState) {
        if (error) {
          return done(error);
        }
        expect(newState).to.be.eql('qualified', 'incorrect or missing newState for test. Expected: qualified. Got: ' + newState);
        done();
      });
    });
  });

  describe('notifyUserOfBasicQualifiedState', function() {
    it('should send a qualified email on promotion of pre_qualified to qualified', function(done) {
      var result = userService.notifyUserOfBasicQualifiedState(this.users.prequal);
      expect(result).to.be.eql('sent qualified email');
      done();
    });

  });

  describe('findUserByAuth0Id', function() {
    it('should return nothing when not found', function(done) {
      userService.findUserByAuth0Id(this.users.regular.auth0_id + '-NOT-FOUND', function(error, user) {
        if (error) {
          return done(error);
        }
        expect(user).to.be.undefined;
        done();
      });
    });

    it('should return the user when found', function(done) {
      var expectedUser = this.users.regular;
      userService.findUserByAuth0Id(expectedUser.auth0_id, function(error, user) {
        if (error) {
          return done(error);
        }
        expect(user).exist;
        expect(user.auth0_id).to.eql(expectedUser.auth0_id);
        done();
      });
    });
  });

  describe('findDuplicateUserByEmail', function() {
    it('should return nothing when no dupicate found', function(done) {
      userService.findDuplicateUserByEmail(this.users.regular.auth0_id, this.users.regular.email, function(error, user) {
        if (error) {
          return done(error);
        }
        expect(user).to.be.undefined;
        done();
      });
    });

    it('should return the duplicate', function(done) {
      var dup1 = this.users.dup1;
      var dup2 = this.users.dup2;
      userService.findDuplicateUserByEmail(dup1.auth0_id, dup1.email, function (error, user) {
        if (error) {
          return done(error);
        }
        expect(user).to.exist;
        expect(user.auth0_id).to.eql(dup2.auth0_id);
        done();
      })
    });
  });

  describe('createUser', function() {
    var auth0Id = 'AUTH0-ID-USER-CREATION';
    after(function() {
      return db('users')
        .where('auth0_id', auth0Id)
        .del();
    });

    it('should create a user', function(done) {
      var email = 'auth0@test.com';
      userService.createUser({
        auth0_id: auth0Id,
        email: email
      }, function (error, user) {
        if (error) {
          return done(error);
        }
        expect(user).to.exist;
        expect(user.auth0_id).to.eql(auth0Id);
        expect(user.email).to.eql(email);
        done();
      });
    });
  });
  describe('getUsers', function() {
    it('should update prepped correctly', (done) => {
      let voter;
      let originalVoters;
      let originalNotpreppedCount;
      let originalNotprepped;
      let userId;

      db.select("voters.*")
        .table("voters")
        .whereNotNull("voters.adopter_user_id", null)
        .whereRaw("voters.adopter_user_id like ?", 'test-%')
        .first()
      .then((voterFromDb) => {
        voter = voterFromDb;
        console.log({voter});
        userId = voter.adopter_user_id;
        return db.select("voters.*")
          .table("voters")
          .where("voters.adopter_user_id", userId)
      })
      .then((results) => {
        originalVoters = results;
        return db('voters')
        .where('voters.adopter_user_id', userId)
        .update('confirmed_prepped_at', null)
      })
      .then(() =>{
        return db.select("users.*")
          .table("users")
          .where('users.auth0_id', userId)
      })
      .then((user) => {
        console.log({ user });
        return Promise.all([
          userService.getUsers({preppedLetters: 'NOTPREPPED'}),
          userService.getUsers({preppedLetters: 'NOTPREPPED', count: true}),
        ])
      })
      .then((results) => {
        console.log({results: JSON.stringify(results)});
        expect(results[0].filter((user) => user.auth0_id === userId).length).to.be.equal(1);
        originalNotpreppedCount = parseInt(results[1].count);
        originalNotprepped = results[0];
        return db('voters')
          .where('id', voter.id)
          .update({
            confirmed_prepped_at: db.fn.now(),
            updated_at: db.fn.now()
          })
      })
      .then(() => {
        return Promise.all([
          userService.getUsers({preppedLetters: 'NOTPREPPED'}),
          userService.getUsers({preppedLetters: 'NOTPREPPED', count: true}),
        ])
      })
      .then((results) => {
        expect(results[0].filter((user) => user.auth0_id === userId && parseInt(user.remaining_count>1)).length).to.be.equal(0);
        expect(originalNotpreppedCount).to.be.equal(parseInt(results[1].count));
        const originalUser = originalNotprepped.filter((user) => user.auth0_id === userId)[0];
        const modifiedUser = results[0].filter((user) => user.auth0_id === userId)[0]
        // We've removed one of the letters from the user's bucket, so it should be 1 less
        expect(parseInt(modifiedUser.remaining_count)+1).to.be.equal(parseInt(originalUser.remaining_count));

        // now finish all the user's voters
        return db('voters')
          .where('adopter_user_id', userId)
          .update('confirmed_prepped_at', db.fn.now())
      })
      .then(() => {
        return Promise.all([
          userService.getUsers({preppedLetters: 'NOTPREPPED'}),
          userService.getUsers({preppedLetters: 'NOTPREPPED', count: true}),
        ])
      })
      .then((results) => {
        expect(results[0].filter((user) => user.auth0_id === userId && parseInt(user.remaining_count)>0).length).to.be.equal(0);
        expect(originalNotpreppedCount-1).to.be.equal(parseInt(results[1].count));

        return Promise.all(
          originalVoters.map((voter) => db('voters')
            .where('id', voter.id)
            .update('confirmed_prepped_at', voter.confirmed_prepped_at))
        );
      })
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      })
    });
  });
});
