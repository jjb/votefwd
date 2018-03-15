var expect = require('chai').expect;
var request = require('request');

it('API status', function(done) {
  request('http://localhost:3001/api', function(error, response, body) {
    expect(response.statusCode).to.equal(200);
    done()
  });
});
