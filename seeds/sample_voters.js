// /seed/sample_voters.js

const voter_data = require('../seed_data/seed-voters.json');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('voters').del()
    .then(function () {
      // Inserts seed entries
      return knex('voters').insert(voter_data);
    });
};
