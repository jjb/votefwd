// /seed/ohio_12.js

const ohio_data= require('../voter_data/ohio_12.json');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ohio_12_wide').del()
    .then(function () {
      // Inserts seed entries
      return knex('ohio_12_wide').insert(ohio_data);
    });
};
