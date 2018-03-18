var expect = require('chai').expect;
var request = require('request');
var uuidv4 = require('uuid/v4');

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

var randomId = uuidv4();

it('Saves a new user', function(done) {
  request
    .post({url: 'http://localhost:3001/api/user', form: {auth0_id: randomId}},
    function(error, response, body) {
      expect(response.statusCode).to.equal(200);
    done();
  });
});

// Here attempting to add another user with the same ID as the one we added in
// the 'Saves a new user' test, so it will fail. There's probably a better way,
// that keeps the two tests decoupled, perhaps some kind of mocking, but this
// works for now.

it('Recognizes an existing user', function(done) {
  request.post({url: 'http://localhost:3001/api/user', form: {auth0_id: randomId}},
    function(error, response, body) {
      expect(response.statusCode).to.equal(422);
    done();
  });
});

it('Fails gracefully when user ID is missing', function(done) {
  request.post({url: 'http://localhost:3001/api/user', form: {auth0_id: null}},
    function(error, response, body) {
      expect(response.statusCode).to.equal(500);
    done();
  });
});

it('Retrieves a list of voters', function(done) {
  request.get({url: 'http://localhost:3001/api/voters'},
    function(error, response, body) {
      expect(response.statusCode).to.equal(200);
    done();
  });
});
