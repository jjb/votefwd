// /seed/sample_voters.js

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('voters').del()
    .then(function () {
      // Inserts seed entries
      return knex('voters').insert([
        { id: 1, first_name: 'Jim', last_name: 'Xray', state: 'CA'},
        { id: 2, first_name: 'Frank', last_name: 'Yankee', state: 'PA'},
        { id: 3, first_name: 'Anne', last_name: 'Zulu', state: 'AK'},
        { id: 4, first_name: 'Herman', last_name: 'Apple', state: 'NY'},
        { id: 5, first_name: 'Barry', last_name: 'Charlie', state: 'CT'},
        { id: 6, first_name: 'Joe', last_name: 'Delta', state: 'CO'},
        { id: 7, first_name: 'Hank', last_name: 'Gamma', state: 'LA'},
        { id: 8, first_name: 'Mary', last_name: 'Foxtrot', state: 'NJ'},
        { id: 9, first_name: 'Jane', last_name: 'McHugh', state: 'VT'},
        { id: 10, first_name: 'Max', last_name: 'Powers', state: 'IL'}
      ]);
    });
};
