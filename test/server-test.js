var expect = require('chai').expect;
var request = require('request');

it('API status', function(done) {
  request('http://localhost:3001/api', function(error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it('Get voters', function(done) {
  request('http://localhost:3001/api/voters', function(error, response, body) {
    expect(JSON.parse(body)).to.be.an.instanceof(Array);
    done();
  });
});
