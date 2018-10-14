'use strict';
const rewire = require('rewire');
const expect = require('chai').expect;

const districtService = rewire('../server/districtService');

describe('districtService', function() {
  describe('adoptRandomVoter', function() {
    it('should retrieve the district', function(done) {
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
