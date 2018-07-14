'use strict';

var db = require('../server/db');

// Runs Mocha hooks that apply for all tests

// Starts up the server
var server = require('../server/server');

after('Shutting down the server', function(done) {
  server.close(function() {
    done();
  });
});

after('Shutting down the database', function() {
  return db.destroy();
});
