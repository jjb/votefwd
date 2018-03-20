'use strict';

const fs = require('fs');
const parse = require('csv-parse/lib/sync')

var filePath = '../seeds/sample_voters-alabama.csv';

var file = fs.readFileSync(filePath, 'utf8');

var records = parse(file, {columns: true});
