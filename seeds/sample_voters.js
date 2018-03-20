// /seed/sample_voters.js

const voter_data = require('../voter_data/sample_voters_alabama_processed.json'); 

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('voters').del()
    .then(function () {
      // Inserts seed entries
      return knex('voters').insert(voter_data);
    });
};
