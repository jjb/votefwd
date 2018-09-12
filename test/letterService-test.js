'use strict';

var async = require('async');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');

chai.use(require('chai-sorted'));

var letterService = require('../server/letterService');

var htmlFile = require.resolve('html-pdf/examples/businesscard/businesscard.html');
var imgFile = require.resolve('html-pdf/examples/businesscard/image.png');

describe('letterService', function() {
  describe('_generatePdfFromHtml', function() {
    it('should not be invoked too many times concurrently', function(done) {
      // Artificially limit the semaphore capacity so that we can test that it
      // is working at all.
      letterService._setSemaphoreCapacity(1);

      // Increase timeouts for this test, since we expect it to go for a while
      this.timeout(10000);

      var tmpl = fs.readFileSync(htmlFile, 'utf8');
      var html = tmpl.replace('{{image}}', `file://${imgFile}`);

      var generate = function (num) {
        return function (cb) {
          letterService._generatePdfFromHtml(html, [{}, {}],
            function(response, downloadFilename) {
              cb(null, num, Date.now(), response, downloadFilename);
            }
          );
        };
      };
      async.parallel([
        generate(0),
        generate(1),
        generate(2),
        generate(3),
        generate(4),
      ], function (err, results) {
        // Check that each is done in the correct order. That must be the case
        // since we use a semaphore of capacity 1.
        var endTimes = results.map(function (result) {
          return result[1];
        });
        expect(endTimes).to.be.sorted();
        done();
      });
    });
  });
});
