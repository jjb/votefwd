'use strict';
var db = require('../server/db');

/**
 * Runs targeting of voters for a given district based on Catalist data.
 *
 * Creates an experiment for the district in the `experiments` table, finds
 * unassigned voters for the district, and creates a row in `experiment_voter`
 * for each one.
 *
 * Experiment cohort of TEST and CONTROL is based on sampling rate.
 * 
 * To test this locally:
 *
 *   * Load the catalyst data into Postgresql:
 *        \copy catalist_raw FROM ./seed_data/catalist.csv with (format csv, header true, delimiter ',');
 *   * If you've run it before, delete the experiment and experiment_voter tables.
 *        `delete from experiment_voter;`
 *        `delete from experiment;`
 * TODO: Introduce stratified sampling.
 */

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

/**
 * Select test and control voters based on random sampling.
 *
 * Args:
 *   dwids: Array of catalist voter ids.
 *   experiment_id: uuid of the experiment.
 *   control_holdout: ratio of CONTROL over TEST. E.g. 0.1 will have 10% in CONTROL.
 *
 * Returns:
 *   Array of experiment_voter dictionaries with experiment, voter and cohort data.
 */
function SelectVoters(dwids, experiment_id, control_holdout=0.1) {
  console.log('Number of unassigned dwids: ' + dwids.length);
  console.log('Assigning ' + control_holdout * 100 + '% to control.');
  shuffle(dwids);
  var num_controls = Math.floor(dwids.length * control_holdout);
  var num_test = dwids.length - num_controls;
  console.log('Assigning ' + num_test + ' to TEST, and ' + num_controls + ' to CONTROL.');
  var experiment_voters = dwids.map(function (dwid, index) {
    var cohort = index < num_test ? 'TEST' : 'CONTROL';
    return {'experiment_id': experiment_id, 'voter_id': dwid, 'cohort': cohort};
  });
  return experiment_voters;
}

/**
 * Runs targeting for the given district.
 */
function Target(state, district, description, control_holdout) {
  // We run everything under a single transaction.
  db.transaction(function(trx) {
    console.log('Started transaction.')
    db('experiment')
      .transacting(trx)
      .insert({'name': state + district, 'description': description}, 'id')
      .catch(function(error) {
        console.log(error);
        console.log('Error creating experiment.');
        trx.rollback();
        process.exit(1);
      })
      .then(function(ids_response) {
        var experiment_id = ids_response[0];
        console.log("Registered experiment with ID: ", experiment_id);
        // Find all voters from the district which are not yet part of an experiment. Note that
        // in rare cases, a single voter might be in multiple districts.
        db.raw(`
          select
            dwid
          from catalist_raw
          left join experiment_voter
            on catalist_raw.dwid = experiment_voter.voter_id
          where
            catalist_raw.state = ?
            and catalist_raw.congressional_district= ?`,
          [state, district])
          .then(function(dwids_result) {
            var dwids = dwids_result.rows;
            var experiment_voters = SelectVoters(dwids, experiment_id, control_holdout);
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
}

module.exports = {
  SelectVoters,
  Target
};

