'use strict';

var db = require('../server/db');

// Runs Mocha hooks that apply for all tests

after('Shutting down the database', function() {
  return db.destroy();
});
