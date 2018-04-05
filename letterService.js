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
  getSignedUrlForGCPFile(GCPFile, function(signedUrl) {
    callback(signedUrl)
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

function generatePdfForVoter(voter, callback) {
  var voterId = voter.id;
  var datestamp = dateStamp();
  var hashId = hashids.encode(voterId);
  var uuid = uuidv4();
  // TODO: make this configurable by environment
  var pledgeUrl = 'http://localhost:3000/pledge';
  var template = fs.readFileSync('./letter.html', 'utf8');
  var uncompiledTemplate = Handlebars.compile(template);
  var fullName = voter.first_name + ' ' + voter.last_name;
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
  const uploadOptions =
              {
                  gzip: true,
                  contentType: 'application/pdf',
                  contentDisposition: 'attachment',
                  metadata: {
                      contentType: 'application/pdf',
                      contentDisposition: `attachment; filename='${downloadFileName}`,
                  },
                  headers: {
                      contentType: 'application/pdf',
                      contentDisposition: 'attachment',
                  }
              };
  pdf.create(html).toFile(filePath, function(err, response){
    if(err) {
      console.error('ERROR:', err)
    }
    else {
      storage
        .bucket(bucketName)
        .upload(response.filename, uploadOptions)
        .then((response) => {
          var gcpFile = response[0];
          getSignedUrlForGCPFile(gcpFile, function(signedUrl) {
            callback(signedUrl);
          });
        })
        .then(() => {
          let pleaLetterUrl = 'http://storage.googleapis.com/' + bucketName + '/' + remotefileName;
          db('voters')
            .where('id', voterId)
            .update('plea_letter_url', pleaLetterUrl)
            .update('hashid', hashId)
            .catch(err=> {
              console.error('ERROR: ', err);
            });
        })
        .catch(err => {
          console.error('ERROR: ', err);
        });
    }
  });
}

module.exports = {
  generatePdfForVoter,
  getSignedUrl
}
