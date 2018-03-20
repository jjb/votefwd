'use strict';

const fs = require('fs');
const parse = require('csv-parse/lib/sync')

var filePath = '../voter_data/sample_voters-alabama.csv';
var file = fs.readFileSync(filePath, 'utf8');
var records = parse(file, {columns: true});

var processedRecords = records.map(record => 
  ({
    first_name: record['First Name'], 
    last_name: record['Last Name'],
    middle_name: record['Middle Name'],
    address: record['Residential Address'], 
    city: record['Residential City'], 
    state: record['Residential State'], 
    zip: record['Residential ZIP']
  })
);

fs.writeFileSync('../voter_data/sample_voters_alabama_processed.json', JSON.stringify(processedRecords, 'utf8'));
