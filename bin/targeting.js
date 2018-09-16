'use strict';

var db = require('../server/db');

var voters = db.select().table('voters')
  .then(function(result) {
    return result;
  });

//console.log(voters.length);

function updateVoterSuffix(dwid) {
  db('voters')
    .where('registration_id', dwid)
    .update({
      suffix: 'JRs'
    })
    .catch(err => {
      console.error(err);
    });
}

// Fisher–Yates Shuffle.
// Author: Mike Bostock
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

updateVoterSuffix(9912895);

function sampleExample() {
	var x = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
	console.log(x)
	shuffle(x)
	console.log(x)

	var sample = x.slice(0, 10);
	console.log(sample)
}

// TODO: Write a new experiment.
var Promise = require('bluebird');
db.transaction(function(trx) {
  console.log('Started transaction.')
  var ids = db('experiment')
      .transacting(trx)
      .insert({name: 'CA10', description: 'Propensity 5-75, Dem partizanship > 90'})
      .then(function(response) {
        console.log("Response:", response);
      })
      .then(trx.commit)
      .catch(trx.rollback);
})
.then(function(resp) {
  console.log('Transaction complete.');
})
.catch(function(err) {
  console.error(err);
});


// TODO: Write to experiment_voter all catalyst_raw voters based on state and district,
// which are not already in experiment_voter (can have duplicates).
// TODO: Log the number of experiment_voter records where cohort is null.
// TODO: Set all to control where cohort is null.
// TODO: Set to TARGET for randomly selected voters in experiment_voter based on experiment_id.
// TODO: Add all new TREATMENT (TEST) experiment_voters to voters table.

