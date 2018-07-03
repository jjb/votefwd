'use strict';

const fs = require('fs');
const parse = require('csv-parse/lib/sync')

var filePath = '../voter_data/CATALIST_OH_Vote_Forward_Mailing_PHONE.csv';
var file = fs.readFileSync(filePath, 'utf8');
var records = parse(file, {columns: true});

console.log(records[0]);

var processedRecords = records.map(record => 
  ({
    first_name: record['FIRST_NAME'], 
    last_name: record['LAST_NAME'],
    middle_name: record['MIDDLE_NAME'],
    address: record['REGISTRATION_ADDRESS_LINE_1'], 
    city: record['REGISTRATION_ADDRESS_CITY'], 
    state: record['REGISTRATION_ADDRESS_STATE'], 
    zip: record['REGISTRATION_ADDRESS_ZIP'],
    gender: record['GENDER']
  })
);

fs.writeFileSync('../voter_data/catalist-data.json', JSON.stringify(processedRecords, 'utf8'));
