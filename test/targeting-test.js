'use strict';

var expect = require('chai').expect;

var targeting = require('../server/targeting.js');

describe('targeting', function() {
  describe('SelectVoters', function() {

    it('should randomly assign voters', function() {
      var dwids = Array.from({length: 10}, (x,i) => i);
      var experiment_voters = targeting.SelectVoters(dwids, 'MN2', 0.1)
      var cohorts = experiment_voters.map(row => row['cohort'])
      expect(cohorts.sort()).to.eql([
        'CONTROL',
        'TEST', 'TEST', 'TEST',
        'TEST', 'TEST', 'TEST',
        'TEST', 'TEST', 'TEST']);
    });

    it('should use stratification when sampling', function() {
      // There's no easy way to set a random seed in JavaScript, so we're going
      // to set each gender to either an even or odd id, sample one for each gender,
      // then check that the samples ids sum to an odd number.
      var dwid_rows = Array.from({length: 10}, function(x,i) {
        return {'dwid': i, 'gender': i % 2 ? 'm' : 'f'};});
      var experiment_voters = targeting.StratifiedSelectVoters(dwid_rows, 'MN2', 0.2)
      var control_voters = experiment_voters.filter(row => row['cohort'] == 'CONTROL')
      expect(control_voters.length).to.eql(2);
      var control_ids = control_voters.map(voter => voter['voter_id'])
      var ids_sum = control_ids.reduce((total, num) => total + num)
      expect(ids_sum % 2).to.eql(1);
    });

  });
});
