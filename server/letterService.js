 //letterService.js
'use strict'

var db = require('./db');
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

// Hard-coding return addresses temporarily, so we can launch multiple-district support
// Couldn't figure out how to get from DB inside synchronous generation
// functions. TODO: get these from the database.

const returnAddresses = {
  'OH12': '829 Bethel Road #137, Columbus, OH 43214',
  'GA06': '2870 Peachtree Road #172, Atlanta, GA 30305',
  'AZ02': '1517 N Wilmot Rd #TBD, Tucson, AZ 85712',
  'TX23': '476 S Bibb Ave Ste C #308, Eagle Pass, TX 78852',
  'MN02': '7635 W 148th St. #TBD, Apple Valley, MN 55124',
  'FL27': '7742 N Kendall Dr #323, Kendall, FL 33156',
  'CA10': '1169 S Main St #331, Manteca, CA 95337',
  'PA10': '1784 East 3rd Street #TBD, Williamsport, PA 17701'
}

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
  var returnAddresses = [];
  voters.forEach(function(voter) {
    if (voter.gender == 'male') {
      voter.salutation = 'MR';
    }
    else if (voter.gender == 'female') {
      voter.salutation = 'MS';
    }
    processedVoters.push(voter);
  });
  voters.forEach(function(voter) {
    var returnAddress = getReturnAddressForVoter(voter);
    if (returnAddresses.indexOf(returnAddress) === -1) {
      returnAddresses.push(returnAddress);
    }
  });
  var context = {
      voters: processedVoters,
      returnAddresses: returnAddresses
    };
  var html = uncompiledTemplate(context);
  return html;
}

// gets return address for voter's district
function getReturnAddressForVoter(voter) {
  let returnAddress = returnAddresses[voter.district_id];
  if (returnAddress) {
    return returnAddress.toUpperCase();
  }
  else {
    return null;
  }
  //db.from('districts')
    //.select(
      //'districts.return_address',
      //'districts.ra_city',
      //'districts.ra_state',
      //'districts.ra_zip'
    //)
    //.where('districts.district_id', voter.district_id)
    //.limit(1)
    //.then(function(result) {
      //returnAddress=
        //result[0].return_address + ', ' +
        //result[0].ra_city + ', ' +
        //result[0].ra_state + ' ' +
        //result[0].ra_zip;
      //callback(returnAddress);
      //return returnAddress;
    //})
    //.catch(err=> {
      //console.error('ERROR: ', err);
    //});
}

function generateHtmlForVoter(voter) {
  let returnAddress = getReturnAddressForVoter(voter);
  // takes a voter and makes a html template for them to be made into a pdf
  var voterId = voter.id;
  var hashId = hashids.encode(voterId);
  var pledgeUrl = `${process.env.REACT_APP_URL}/pledge`;
  var template = fs.readFileSync('./templates/letter.html', 'utf8');
  var uncompiledTemplate = Handlebars.compile(template);
  var salutation;
  if (voter.gender === 'M' || voter.gender === 'male') {
    salutation = "Mr."
  } else if (voter.gender === 'F' || voter.gender === 'female') {
    salutation = "Ms."
  } else { salutation = null };
  var fullName = [salutation, voter.first_name, voter.middle_name, voter.last_name, voter.suffix].filter(Boolean).join(" ");
  var fullAddress = voter.address + ', ' + voter.city + ', ' + voter.state + ' ' + voter.zip;
  var context = {
    voterId: voterId,
    voterName: fullName,
    voterAddress: fullAddress,
    returnAddress: returnAddress,
    hashId: hashId,
    pledgeUrl: pledgeUrl
    };
  var html = uncompiledTemplate(context);
  return(html);
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
  var html = generateHtmlForVoter(voter);
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
