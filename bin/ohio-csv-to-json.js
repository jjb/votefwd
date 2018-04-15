'use strict';

const fs = require('fs');
const parse = require('csv-parse');
const sizeof = require('object-sizeof');
const through2 = require('through2');

let inputFilePath;
let outputFilePath;

if (!process.argv[2] || !process.argv[3]) {
  console.log('Missing file path argument.');
  console.log('First argument should be input file path.');
  console.log('Second argument should be output file path.');
  process.exit();
}
else {
  inputFilePath = process.argv[2];
  outputFilePath = process.argv[3];
}

const fileStream = fs.createReadStream(inputFilePath);
const writeStream = fs.createWriteStream(outputFilePath);
writeStream.on('error', function(err) {
  console.log("err:", err);
});

const parser = parse({columns:true}, function(err, data) {
  if (err) {
    console.log('err:', err);
  }
  console.log(data);
  console.log(sizeof(data));
})

const toJSON = () => {
  let objs = [];
  return through2.obj(function(data, enc, cb) {
    objs.push(data);
    cb(null, null);
  }, function(cb) {
    this.push(JSON.stringify(objs, 'utf8'));
    cb();
  });
};

fileStream
  .pipe(parser)
  .pipe(toJSON())
  .pipe(writeStream);
