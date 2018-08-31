'use strict';

const fs = require('fs');
const parse = require('csv-parse/lib/sync')

var filePath = '../seed_data/seed-voters.csv';
var file = fs.readFileSync(filePath, 'utf8');
var records = parse(file, {columns: true});

var processedRecords = records.map(record =>
  ({
    first_name: record['first_name'],
    last_name: record['last_name'],
    middle_name: record['middle_name'],
    suffix: record['suffix'],
    gender: record['gender'],
    registration_id: record['registration_id'],
    address: record['address'],
    city: record['city'],
    state: record['state'],
    zip: record['zip'],
    district_id: record['district_id']
  })
);

fs.writeFileSync('../seed_data/seed-voters.json', JSON.stringify(processedRecords, 'utf8'));
