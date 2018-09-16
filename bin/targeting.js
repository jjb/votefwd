'use strict';

var db = require('../server/db');

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

var STATE = 'MN'
var DISTRICT = '2'
var EXPERIMENT_DESCRIPTION = 'Propensity 5-75, Dem partizanship > 90'
var NUMBER_OF_CONTROLS = 10000;

var Promise = require('bluebird');

// Delete all experiment, just for convenience while developing.
// TODO: Remove this before actually running.
var del_resp = db('experiment_voter').delete().then(function(){
  db('experiment').delete().then(function() {
    db.transaction(function(trx) {
      console.log('Started transaction.')
      // TODO(scott): Pad the district (or don't).
      var ids_response = db('experiment')
          .transacting(trx)
          .insert({name: STATE + DISTRICT, description: EXPERIMENT_DESCRIPTION}, 'id')
          .catch(function(error) {
            console.log(error);
            console.log('Error creating experiment.');
            trx.rollback();
            process.exit(1);
          });
      ids_response.then(function(ids) {
        console.log("Registered experiment with ID: ", ids[0]);
        var experiment_id = ids[0];
        // Find all voters from the district which are not yet part of an experiment. Note that
        // in rare cases, a single voter might be in multiple districts.
        db.raw("select dwid from catalist_raw left join experiment_voter on catalist_raw.dwid = experiment_voter.voter_id where experiment_voter.voter_id is NULL and catalist_raw.state='MN' and catalist_raw.congressional_district='2'")
          .then(function(dwiws_result) {
            var dwiws = dwiws_result.rows;
            shuffle(dwiws);
            console.log('Found ' + dwiws.length + ' unassigned dwiw.');
            var num_test = dwiws.length - NUMBER_OF_CONTROLS;
            console.log('Assigning ' + num_test + ' to TEST, and ' + NUMBER_OF_CONTROLS + ' to CONTROL.');
            var experiment_voters = dwiws.map(function (dwiw, index) {
              var cohort = index <= num_test ? 'TEST' : 'CONTROL';
              return {'experiment_id': experiment_id, 'voter_id': dwiw, 'cohort': cohort};
            });
            db('experiment_voter').transacting(trx).insert(experiment_voters).then(function() {
              console.log('Inserted experiment voters.');
              trx.commit();
            })
            .catch(function(err) {
              console.error(err);
              trx.rollback();
              process.exit(1);
            });
          })
          .catch(function(err) {
            console.error(err);
            trx.rollback();
            process.exit(1);
          });
      })
      .catch(trx.rollback);
    })
    .then(function(resp) {
      console.log('Transaction complete.');
      process.exit(0);
    })
    .catch(function(err) {
      console.error(err);
      process.exit(1);
    });
  });
});

