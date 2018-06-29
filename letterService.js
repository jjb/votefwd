 //letterService.js
'use strict'

var db = require('./src/db');
var pdf = require('html-pdf');
var merge = require('easy-pdf-merge');
var Hashids = require('hashids');
var Storage = require('@google-cloud/storage');
var Handlebars = require('handlebars');
var uuidv4 = require('uuid/v4');
var fs = require('fs');
var os = require('os');
var URL = require('url');

// Google cloud storage setup needed for getting and storing files
const storage = new Storage({
  keyFilename: './googleappcreds.json'
})
const bucketName = 'voteforward';
const voterBucket = storage.bucket(bucketName);

function dateStamp() {
  var newDate = new Date();
  var DateString;
  DateString = newDate.getFullYear() + '-'
             + ('0' + (newDate.getMonth()+1)).slice(-2) + '-'
             + ('0' + newDate.getDate()).slice(-2);
  return DateString;
}

function getSignedUrl(url, callback) {
  let path = URL.parse(url).path
  let fileName = path.substr(path.lastIndexOf('/') + 1);
  let GCPFile = voterBucket.file(fileName);
  getSignedUrlForGCPFile(GCPFile, function(plea_letter_url) {
    callback(plea_letter_url)
  })
}

function getSignedUrlForGCPFile(gcpFileObject, callback) {
  /*
  Takes a gcp file object and applies a static config to create a signed url.
  Inputs:
    gcpFileObject - an instance of  https://cloud.google.com/nodejs/docs/reference/storage/1.6.x/File
  Returns:
    A callback with a signed url https://cloud.google.com/nodejs/docs/reference/storage/1.6.x/File#getSignedUrl
    or an error
  */

  // Set a date two days in a future
  var expDate = new Date();
  expDate.setDate(expDate.getDate() + 2);

  var config = {
      action: 'read',
      expires: expDate,
  }

  gcpFileObject.getSignedUrl(config, function(err, url) {
    if (err) {
      console.error(err);
      return;
    };

    callback(url);
  });
}

var hashids = new Hashids(process.env.REACT_APP_HASHID_SALT, 6,
  process.env.REACT_APP_HASHID_DICTIONARY);

function generateAndStorePdfForVoter(voter, callback) {
  // wrapper function to generate and store a pdf for a voter
  generatePdfForVoter(voter, function(response, voter, storageArgs){
    storePdfForVoter(response, voter, storageArgs, callback);
  });
}

function generateBulkPdfForVoters(voters, callback) {
  // wrapper function to take a list of voters and make one pdf for all of them.
  var pdf_filenames = [];
  for (var i = 0; i < voters.length; i++){
    generatePdfForVoter(voters[i], function(response, voter, storageArgs){
      // some might fail and return nothing, insert an empty string as a place holder
      var filename = response.filename ? response.filename : '';
      pdf_filenames.push(filename);

      if (pdf_filenames.length == voters.length){
        // filter out any '' strings
        var pdf_filenames_final = pdf_filenames.filter(file => file != '');
        // make bulk args
        var datestamp = dateStamp();
        var uuid = uuidv4();
        const tmpdir = os.tmpdir();
        const remotefileName = datestamp + '-' + uuid + '-letter.pdf'
        const downloadFileName = datestamp + '-bulk-VoteForward-' + voters.length + '-letters.pdf';
        const filePath = tmpdir + '/' + remotefileName;
        merge(pdf_filenames_final, filePath, function(err){
          if(err) {
            return console.log(err);
          }
          callback(filePath, downloadFileName);
        });
      }
    });
  }
}

function generatePdfForVoter(voter, callback) {
  var voterId = voter.id;
  var datestamp = dateStamp();
  var hashId = hashids.encode(voterId);
  var uuid = uuidv4();
  var pledgeUrl = `${process.env.REACT_APP_URL}/pledge`;
  var template = fs.readFileSync('./letter.html', 'utf8');
  var uncompiledTemplate = Handlebars.compile(template);
  var fullName =
    voter.first_name +
    ' ' +
    voter.middle_name +
    ' ' +
    voter.last_name +
    ' ' +
    voter.suffix;
  var fullAddress = voter.address + ', ' + voter.city + ', ' + voter.state + ' ' + voter.zip;
  var context = {
    voterId: voterId,
    voterName: fullName,
    voterAddress: fullAddress,
    datestamp: datestamp,
    hashId: hashId,
    pledgeUrl: pledgeUrl
    };
  var html = uncompiledTemplate(context);
  var options = { format: 'Letter' };
  const tmpdir = os.tmpdir();
  const remotefileName = datestamp + '-' + uuid + '-letter.pdf'
  const downloadFileName = datestamp + '-' + voter.last_name + '-VoteForward-letter.pdf';
  const filePath = tmpdir + '/' + remotefileName;
  pdf.create(html).toFile(filePath, function(err, response){
    if(err) {
      console.error('ERROR:', err);
    }
    var storageArgs = {
      downloadFileName: downloadFileName,
      remotefileName: remotefileName,
      hashId: hashId
    }
    callback(response, voter, storageArgs);
  });
}

function storePdfForVoter(response, voter, storageArgs, callback){
  const uploadOptions =
            {
                gzip: true,
                contentType: 'application/pdf',
                contentDisposition: 'attachment',
                metadata: {
                    contentType: 'application/pdf',
                    contentDisposition: `attachment; filename='${storageArgs["downloadFileName"]}'`,
                },
                headers: {
                    contentType: 'application/pdf',
                    contentDisposition: 'attachment',
                }
            };

  storage
    .bucket(bucketName)
    .upload(response.filename, uploadOptions)
    .then((response) => {
      var gcpFile = response[0];
      getSignedUrlForGCPFile(gcpFile, function(plea_letter_url) {
        voter['plea_letter_url'] = encodeURI(plea_letter_url);
        callback(voter);
      });
    })
    .then(() => {
      let pleaLetterUrl = 'http://storage.googleapis.com/' + bucketName + '/' + storageArgs["remotefileName"];
      db('voters')
        .where('id', voter.id)
        .update('plea_letter_url', pleaLetterUrl)
        .update('hashid', storageArgs["hashId"])
        .catch(err=> {
          console.error('ERROR: ', err);
        });
    })
    .catch(err => {
      console.error('ERROR: ', err);
    });
}

module.exports = {
  generateAndStorePdfForVoter,
  generateBulkPdfForVoters,
  generatePdfForVoter,
  getSignedUrl
}
