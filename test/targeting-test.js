'use strict';

var expect = require('chai').expect;

var targeting = require('../server/targeting.js');

describe('targeting', function() {
  describe('SelectVoters', function() {

    it('should run the function in test env', function() {
      var dwids = Array.from({length: 10}, (x,i) => i);
      var experiment_voters = targeting.SelectVoters(dwids, 'MN2', 0.1)
      var cohorts = experiment_voters.map(row => row['cohort'])
      expect(cohorts.sort()).to.eql([
        'CONTROL',
        'TEST', 'TEST', 'TEST',
        'TEST', 'TEST', 'TEST',
        'TEST', 'TEST', 'TEST']);
    });

  });
});
