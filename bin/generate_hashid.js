'use strict';

const parse = require('csv-parse/lib/sync')
const fs = require('fs');

const Hashids = require('hashids');

//TODO: figure out how to load these from .env.production
const hashid_salt =
const hashid_dict =

const hashids = new Hashids(hashid_salt, 6, hashid_dict);

const inputFilePath = '../voter_data/missing_hashids.csv';
const inputFile = fs.readFileSync(inputFilePath, 'utf8');
const parsedInputFile = parse(inputFile);

let outPutArray = [];

const testArray = [
  { id: 10000000, hashid: 'ABCDEFG' },
]

for (var i = 0; i < testArray.length; i++) {
  const hash = hashids.encode(testArray[i].id);
  if (hash !== testArray[i].hashid) {
    console.log('Something is wrong! The hash of one of the test ids did not match the expected value.');
    process.exit();
  }
}

for (var i = 0; i < parsedInputFile.length; i=i+100) {
  const hash = hashids.encode(parsedInputFile[i]);
  outPutArray.push(parsedInputFile[i]);
  outPutArray.push(hash);
}

console.log(outPutArray);
