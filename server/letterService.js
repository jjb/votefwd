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
  'AZ02': '1517 N Wilmot Rd #121, Tucson, AZ 85712',
  'TX23': '224 W Campbell Rd #203, Richardson, TX 75080',
  'MN02': '7635 W 148th St #104, Apple Valley, MN 55124',
  'FL27': '7742 N Kendall Dr #323, Kendall, FL 33156',
  'CA10': '1169 S Main St #331, Manteca, CA 95337',
  'PA10': '1784 East 3rd Street #162, Williamsport, PA 17701',
  'TX32': '224 W Campbell Rd #203, Richardson, TX 75080',
  'KS03': '119 N Parker St #184, Olathe, KS 66061'
}

function dateStamp() {
  var newDate = new Date();
  var DateString;
  DateString = newDate.getFullYear() + '-'
             + ('0' + (newDate.getMonth()+1)).slice(-2) + '-'
             + ('0' + newDate.getDate()).slice(-2);
  return DateString;
}

var hashids = new Hashids(process.env.REACT_APP_HASHID_SALT, 6,
  process.env.REACT_APP_HASHID_DICTIONARY);

function generatePdfForVoters(voters, callback) {
  let html;
  if (voters.length === 1) {
    html = generateHtmlForVoter(voters[0]);
  }
  else {
    let pdf_filenames = [];
    html += generateCoverPageHtmlForVoters(voters);
    for (var i = 0; i < voters.length; i++) {
      html += generateHtmlForVoter(voters[i]);
    }
  }
  generatePdfFromHtml(html, voters, function(response, downloadFileName){
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
  storeHashIdForVoter(voter, hashId);
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

function storeHashIdForVoter(voter, hashid) {
  db('voters')
    .where('id', voter.id)
    .update('hashid', hashid)
    .catch(err=> {
      console.error('ERROR: ' , err);
    });
}


function generatePdfFromHtml(html, voters, callback) {
  const tmpdir = os.tmpdir();
  const datestamp = dateStamp();
  const uuid = uuidv4();
  const remotefileName = datestamp + '-' + uuid + '-letter.pdf'
  const filePath = tmpdir + '/' + remotefileName;
  const options = { format: 'Letter', timeout: '100000' };
  let downloadFileName;
  if (voters.length === 1) {
    const lastName = voters[0].last_name;
    downloadFileName = datestamp + '-' + lastName + '-VoteForward-letter.pdf';
  }
  else {
    downloadFileName = datestamp + '-votefwd-letters-batch-of-' + voters.length + '.pdf';
  }
  pdf.create(html, options).toFile(filePath, function(err, response){
    if(err) {
      console.error('ERROR:', err);
    }
    callback(response, downloadFileName);
  });
}

module.exports = {
  generatePdfForVoters
}
