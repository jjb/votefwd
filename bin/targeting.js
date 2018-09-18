'use strict';
/**
 * Runs targeting of voters for a given district based on Catalist data.
 */

var targeting = require('../server/targeting');

// TODO: Introduce flags or a configuration file for these options:
var STATE = 'MN';
// TODO(sjforman): Pad the district (or don't).
var DISTRICT = '2';
var EXPERIMENT_DESCRIPTION = 'Propensity 5-75, Dem partisanship > 90';
var CONTROL_HOLDOUT = 0.1;

targeting.Target(STATE, DISTRICT, EXPERIMENT_DESCRIPTION, CONTROL_HOLDOUT)
