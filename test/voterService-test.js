'use strict';

var expect = require('chai').expect;
const rewire = require('rewire');

var db = require('../server/db');
var voterService = rewire('../server/voterService');
var Hashids = require('hashids');
var hashids = new Hashids(process.env.REACT_APP_HASHID_SALT, 6,
  process.env.REACT_APP_HASHID_DICTIONARY);

describe('voterService', function() {
  describe('adoptRandomVoter', function() {
    before(function() {
      voterService._prepForTests();
    });

    it('should error if not a valid number of voters requested', function(done) {
      voterService.adoptRandomVoter(this.users.regular.auth0_id, 10, 'GA06', function(error, adoptees) {
        expect(error).not.to.be.null;
        expect(error.message).to.eql('Invalid number of voters requested');
        done();
      });
    });

    it('should do nothing if not enough voters left', function(done) {
      voterService.adoptRandomVoter(this.users.regular.auth0_id, 256, 'GA06', function(error, adoptees) {
        const adopteeCount = adoptees ? adoptees.length : 0;
        expect(adopteeCount).to.eql(0);
        done();
      });
    });

    it('should do nothing if user is not allowed to adopt more voters', function(done) {
      voterService.adoptRandomVoter(this.users.full, 25, 'GA06', function(error, adoptees) {
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
    describe('voterInfoFromHash', function() {
      it('should produce not found error', (done) => {
        voterService.voterInfoFromHash('asdf')
        .then((info) =>{
          throw new Error("We expected a NotFoundError, but didn't get one");
          done();
        })
        .catch(err => {
          expect(err.name).to.equal("NotFoundError");
          done();
        })
      });
    });
    describe('voterInfoFromHash', function() {
      let voter;
      let hashId;
      it('should get voter info', (done) => {
        // find a voter, and manually update its hashid
        db.select("*")
          .table('voters')
          .first()
        .then((voterFromDB) => {
          voter = voterFromDB;
          hashId =  `${hashids.encode(voter.id)}`;
          //manually update the hashid
          return db('voters')
          .where('id', voter.id)
          .update({
            hashid: hashId
          })
        })
        .then(() => {
          return voterService.voterInfoFromHash(hashId)
        })
        .then((voterInfo) => {
          expect(voterInfo.voter.id).to.equal(voter.id);
          expect(voterInfo.voter.district_id).to.equal(voterInfo.district.district_id);
          done();
        });
      });
      afterEach(() => {
        // Set the voter hash back to what it was originally
        return db('voters')
        .where('id', voter.id)
        .update({
          hashid: voter.hashid
        })
      });
    });
    describe('denormalizeVoterCount', function() {
      it('should update voter count', (done) => {
        let originalCount;
        let districtId;
        let voterId;
        const denormalizeVoterCount = voterService.__get__('denormalizeVoterCount');

        db.select("*")
          .table("voters")
          .where("voters.adopter_user_id", null)
          .first()
        .then((voter) => {
          districtId = voter.district_id;
          voterId = voter.id;
          return denormalizeVoterCount(districtId);
        })
        .then(() => {
          return db.select("*")
            .table("districts")
            .where("district_id", districtId)
            .first()
        })
        .then((district) => {
          originalCount = district.available_voter_count;
          return db('voters')
          .where('id', voterId)
          .update('adopter_user_id', 'test-auth0-id-6')
        })
        .then(() => {
          return denormalizeVoterCount(districtId);
        })
        .then(() => {
          return db.select("*")
            .table("districts")
            .where("district_id", districtId)
            .first()
        })
        .then((district) => {
          expect(district.available_voter_count).to.equal(originalCount - 1);
          // set the adopter_user_id back to null
          return db('voters')
          .where('id', voterId)
          .update('adopter_user_id', null)
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
});
