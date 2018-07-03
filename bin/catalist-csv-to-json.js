'use strict';

const fs = require('fs');
const parse = require('csv-parse/lib/sync')

var filePath = '../voter_data/CATALIST_OH_Vote_Forward_Mailing_PHONE.csv';
var file = fs.readFileSync(filePath, 'utf8');
var records = parse(file, {columns: true});

var processedRecords = records.map(record => 
  ({
    dwid: record['DWID'],
    state: record['STATE'],
    hhid1: record['HHID1'],
    hhid2: record['HHID2'],
    name_prefix: record['NAME_PREFIX'],
    first_name: record['FIRST_NAME'],
    middle_name: record['MIDDLE_NAME'],
    last_name: record['LAST_NAME'],
    name_suffix: record['NAME_SUFFIX'],
    age: record['AGE'],
    gender: record['GENDER'],
    race: record['RACE'],
    registration_address_line_1: record['REGISTRATION_ADDRESS_LINE_1'],
    registration_address_line_2: record['REGISTRATION_ADDRESS_LINE_2'],
    registration_address_city: record['REGISTRATION_ADDRESS_CITY'],
    registration_address_state: record['REGISTRATION_ADDRESS_STATE'],
    registration_address_zip: record['REGISTRATION_ADDRESS_ZIP'],
    registration_address_zip_plus_4: record['REGISTRATION_ADDRESS_ZIP_PLUS_4'],
    mail_address_line_1: record['MAIL_ADDRESS_LINE_1'],
    mail_address_line_2: record['MAIL_ADDRESS_LINE_2'],
    mail_address_city: record['MAIL_ADDRESS_CITY'],
    mail_address_state: record['MAIL_ADDRESS_STATE'],
    mail_address_zip: record['MAIL_ADDRESS_ZIP'],
    mail_address_zip_plus_4: record['MAIL_ADDRESS_ZIP_PLUS_4'],
    county_name: record['COUNTY_NAME'],
    township: record['TOWNSHIP'],
    precinct_code: record['PRECINCT_CODE'],
    precinct_name: record['PRECINCT_NAME'],
    unique_precinct_code: record['UNIQUE_PRECINCT_CODE'],
    unique_precinct_name: record['UNIQUE_PRECINCT_NAME'],
    ward: record['WARD'],
    congressional_district: record['CONGRESSIONAL_DISTRICT'],
    state_house_district: record['STATE_HOUSE_DISTRICT'],
    state_senate_district: record['STATE_SENATE_DISTRICT'],
    municipal_district: record['MUNICIPAL_DISTRICT'],
    school_board: record['SCHOOL_BOARD'],
    precinct_split: record['PRECINCT_SPLIT'],
    city_council: record['CITY_COUNCIL'],
    likely_cell: record['LIKELY_CELL'],
    likely_cell_restricted: record['LIKELY_CELL_RESTRICTED'],
    likely_cell_connectivity_score: record['LIKELY_CELL_CONNECTIVITY_SCORE'],
    likely_cell_assignment_score: record['LIKELY_CELL_ASSIGNMENT_SCORE'],
    likely_landline: record['LIKELY_LANDLINE'],
    likely_landline_restricted: record['LIKELY_LANDLINE_RESTRICTED'],
    likely_landline_connectivity_score: record['LIKELY_LANDLINE_CONNECTIVITY_SCORE'],
    likely_landline_assignment_score: record['LIKELY_LANDLINE_ASSIGNMENT_SCORE']
  })
);

fs.writeFileSync('../voter_data/catalist-data.json', JSON.stringify(processedRecords, 'utf8'));
