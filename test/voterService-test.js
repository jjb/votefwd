'use strict';

var expect = require('chai').expect;

var db = require('../server/db');
var voterService = require('../server/voterService');

describe('voterService', function() {
  describe('adoptRandomVoter', function() {
    before(function() {
      voterService._prepForTests();
    });

    it('should error if not a valid number of voters requested', function(done) {
      voterService.adoptRandomVoter(this.users.regular.auth0_id, 10, function(error, adoptees) {
        expect(error).not.to.be.null;
        expect(error.message).to.eql('Invalid number of voters requested');
        done();
      });
    });

    it('should do nothing if not enough voters left', function(done) {
      voterService.adoptRandomVoter(this.users.regular.auth0_id, 256, function(error, adoptees) {
        expect(adoptees.length).to.eql(0);
        done();
      });
    });

    it('should do nothing if user is not allowed to adopt more voters', function(done) {
      voterService.adoptRandomVoter(this.users.full, 15, function(error, adoptees) {
        expect(adoptees.length).to.eql(0);
        done();
      });
    });

    // Pending b/c we need to mock out letterService and slackService
    it('should let the user adopt voters');
  });

  describe('getAdoptedVoterSummary', function() {
    it('should get the data', function(done) {
      voterService.getAdoptedVoterSummary(function(error, summary) {
        expect(error).to.be.null;
        expect(summary).to.have.lengthOf.above(1);
        var v1 = summary.find(s => s.adopter_user_id === 'test-auth0-id-6');
        expect(v1).to.eql({
          adopter_user_id: 'test-auth0-id-6',
          adopted: 2,
          prepped: 0,
          sent: 0,
          total: 2
        });
        var v2 = summary.find(s => s.adopter_user_id === 'test-auth0-id-7');
        expect(v2).to.eql({
          adopter_user_id: 'test-auth0-id-7',
          adopted: 2,
          prepped: 2,
          sent: 1,
          total: 5
        });
        done(error);
      });
    });
  });
});
