'use strict';

var expect = require('chai').expect;

var util = require('../server/util');

describe('util', function() {
  describe('exposeForTests', function() {
    var gated = util.exposeForTests('gated', function(a, b) {
      return (a + b);
    });

    it('should run the function in test env', function() {
      var result = gated(3, 6);
      expect(result).to.eql(9);
    });

    it('should do nothing in non-test env', function() {
      var env = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      var result = gated(3, 6);
      process.env.NODE_ENV = env;
      expect(result).to.eql(undefined);
    });
  });
});
