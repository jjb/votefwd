'use strict';
const rewire = require('rewire');
const expect = require('chai').expect;

const slackService = rewire('../server/slackService');

describe('slackService', function() {
  describe('nbrNewUsers', function() {
    it('should report the number of new users in the last interval on Slack', function(done) {
      districtService.getDistrict('OH12')
      .then((result) => {
        console.log(result.state);
        expect(result.state).to.equal("Ohio");
        expect(districtService.__get__("dbhits")).to.eql(1);
        done();
      });
    });
    it('should retrieve the district from cache', function(done) {
      districtService.getDistrict('OH12')
      .then((result) => {
        console.log(result.state);
        expect(result.state).to.equal("Ohio");
        expect(districtService.__get__("dbhits")).to.eql(1);
        done();
      });
    });
    it('should retrieve new district from db', function(done) {
      districtService.getDistrict('TX23')
      .then((result) => {
        console.log(result.state);
        expect(result.state).to.equal("Texas");
        expect(districtService.__get__("dbhits")).to.eql(2);
        done();
      });
    });
  });
});
