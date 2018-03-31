var expect = require('chai').expect;
var request = require('request');
var uuidv4 = require('uuid/v4');

it('API status', function(done) {
  request('http://localhost:3001/api', function(error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

var randomId = uuidv4();

it('Saves a new user', function(done) {
  request
    .post({url: 'http://localhost:3001/api/user', form: {auth0_id: randomId}},
    function(error, response, body) {
      expect(response.statusCode).to.equal(201);
    done();
  });
});

// Attempting to add another user with the same ID as the one we added in
// the 'Saves a new user' test, to see that it fails.

it('Recognizes an existing user', function(done) {
  request.post({url: 'http://localhost:3001/api/user', form: {auth0_id: randomId}},
    function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.equal('User already exists.');
    done();
  });
});

it('Handles lack of user ID gracefully when creating a user', function(done) {
  request.post({url: 'http://localhost:3001/api/user', form: {auth0_id: null}},
    function(error, response, body) {
      expect(response.statusCode).to.equal(500);
    done();
  });
});

it('Retrieves a random unclaimed voter', function(done) {
  request.get({url: 'http://localhost:3001/api/voter/random'},
    function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body.adopter_user_id).to.be.an('undefined');
      expect(body.adopted_at).to.be.an('undefined');
      expect(body.confirmed_sent_at).to.be.an('undefined');
    done();
  });
});
