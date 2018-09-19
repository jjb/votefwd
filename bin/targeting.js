'use strict';
/**
 * Runs targeting of voters for a given district based on Catalist data.
 *
 * Example invocation:
 * node bin/targeting.js --state=MN --district=2 --experiment_description='My fancy experiment.' --control_holdout=0.2
 */

var targeting = require('../server/targeting');

// TODO: Introduce argument validation.
const args = require('yargs').argv;
console.log('STATE: ' + args.state);  
console.log('DISTRICT: ' + args.district);  
console.log('EXPERIMENT_DESCRIPTION: ' + args.experiment_description);  
console.log('CONTROL_HOLDOUT: ' + args.control_holdout);
targeting.Target(args.state, args.district, args.experiment_description, args.control_holdout)
