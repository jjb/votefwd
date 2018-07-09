 //letterService.js
'use strict'

var db = require('./src/db');
var pdf = require('html-pdf');
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
const bucketName = process.env.REACT_APP_CLOUD_STORAGE_BUCKET_NAME;
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
  var html = ''
  html += generateCoverPageHtmlForVoters(voters);
  for (var i = 0; i < voters.length; i++){
    html += generateHtmlForVoter(voters[i]);
  }
  generatePdfFromBulkHtml(html, voters.length, function(response, downloadFileName){
      var filename = response.filename ? response.filename : '';
      callback(filename, downloadFileName);
  });
}

function generateCoverPageHtmlForVoters(voters) {
  // given a list of voters from the db, make a cover page that has their names and addresses.
  var template = fs.readFileSync('./templates/coverpage.html', 'utf8');
  var uncompiledTemplate = Handlebars.compile(template);
  var processedVoters = [];
  voters.forEach(function(voter) {
    if (voter.gender == 'male') {
      voter.salutation = 'Mr.';
    }
    else if (voter.gender == 'female') {
      voter.salutation = 'Ms.';
    }
    processedVoters.push(voter);
  });
  var context = {
      voters: processedVoters,
    };
  var html = uncompiledTemplate(context);
  return html;
}

function generateHtmlForVoter(voter) {
  // takes a voter and makes a html template for them to be made into a pdf
  var voterId = voter.id;
  var datestamp = dateStamp();
  var hashId = hashids.encode(voterId);
  var pledgeUrl = `${process.env.REACT_APP_URL}/pledge`;
  var template = fs.readFileSync('./templates/letter.html', 'utf8');
  var uncompiledTemplate = Handlebars.compile(template);
  var salutation;
  if (voter.gender === 'M') {
    salutation = "Mr."
  } else if (voter.gender === 'F') {
    salutation = "Ms."
  } else { salutation = null };
  var fullName = [salutation, voter.first_name, voter.middle_name, voter.last_name, voter.suffix].filter(Boolean).join(" ");
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
  return html;
}

function generatePdfFromBulkHtml(html, numvoters, callback) {
  // takes a bunch of merged html templates and makes them into a pdf
  var uuid = uuidv4();
  var datestamp = dateStamp();

  const tmpdir = os.tmpdir();
  const remotefileName = datestamp + '-' + uuid + '-letter.pdf'
  const downloadFileName = datestamp + '-votefwd-letters-batch-of-' + numvoters + '.pdf';
  const filePath = tmpdir + '/' + remotefileName;
  pdf.create(html, {timeout: '100000'}).toFile(filePath, function(err, response){
    if(err) {
      console.error('ERROR:', err);
    }
    callback(response, downloadFileName);
  });
}

function generatePdfForVoter(voter, callback) {
  var uuid = uuidv4();
  var datestamp = dateStamp();
  var hashId = hashids.encode(voter.id);
  var html = generateHtmlForVoter(voter)

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
