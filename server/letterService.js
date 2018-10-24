 //letterService.js
'use strict'

var async = require('async');
var db = require('./db');
var pdf = require('html-pdf');
var Hashids = require('hashids');
var Handlebars = require('handlebars');
var uuidv4 = require('uuid/v4');
var fs = require('fs');
var os = require('os');
var URL = require('url');
var util = require('./util');
var semaphore = require('semaphore');
const { splitEvery } = require('ramda');

const VOTERS_PER_COVER_PAGE = 20;
const PAGE_BREAK = '<!DOCTYPE html>\n<html>\n<body>\n<div class="pagebreak">&nbsp;\n</div></body>\n</html>\n'
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

function generateHtmlForGroup(voters, callback) {
  var context = {
    num_voters: this.num_voters
  }
  generateCoverPageHtmlForVoters(voters, function (err, html) {
    if (err) {
      callback(err);
      return;
    }
    // Limit parallel queries to 5 to lighten the load on the db
    async.mapLimit(voters, 5, generateHtmlForVoter, function (err, results) {
      if (err) {
        callback(err);
        return;
      }
      html = html + results.join('');
      callback(null, html);
    });
  }, context);
}

function generatePdfForVoters(voters, callback) {
  const groups = splitEvery(VOTERS_PER_COVER_PAGE, voters);
  var context = {
    num_voters: voters.length
  };
  
  async.mapLimit(groups, 5, generateHtmlForGroup.bind(context), function(err, results) {
    const html = results.join(PAGE_BREAK);
    generatePdfFromHtml(html, voters, function(err, response, downloadFileName) {
      const filename = (response && response.filename) ? response.filename : '';
      callback(err, filename, downloadFileName);
    });
  })
}

function generateCoverPageHtmlForVoters(voters, callback, context) {
  // Return an empty string so that no cover page is generated. This function is
  // meant to be called whether we need a cover page or not, and it gets to be
  // the decider.
  if (voters.length === 1) {
    callback(null, '');
    return;
  }
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
  // Chose to limit parallel queries to 5 just to lighten the load on the db
  async.mapLimit(voters, 5, getReturnAddressForVoter, function (err, results) {
    if (err) {
      callback(err);
      return;
    }
    results.forEach(function(returnAddress) {
      if (returnAddress && returnAddresses.indexOf(returnAddress) === -1) {
        returnAddresses.push(returnAddress);
      }
    });
    var template_vars = {
      voters: processedVoters,
      returnAddresses: returnAddresses,
      total_voters: context.num_voters,
      multiple_batches : context.num_voters > processedVoters.length ? true : false
    };
    var html = uncompiledTemplate(template_vars);
    callback(null, html);
  });
}

// gets return address for voter's district
function getReturnAddressForVoter(voter, callback) {
  db.from('districts')
    .first(
      'return_address',
      'ra_city',
      'ra_state',
      'ra_zip'
    )
    .where('district_id', voter.district_id)
    .limit(1)
    .then(function (result) {
      if (!result) {
        callback(`No district found for ${voter.district_id}`);
        return;
      }
      const returnAddress =
        `${result.return_address}, ${result.ra_city}, ${result.ra_state} ${result.ra_zip}`
        .toUpperCase();
      callback(null, returnAddress);
    })
    .catch(err => {
      callback(err);
    });
}

function generateHtmlForVoter(voter, callback) {
  getReturnAddressForVoter(voter, function (err, returnAddress) {
    if (err) {
      callback(err);
      return;
    }
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
    callback(null, html);
  });
}

function storeHashIdForVoter(voter, hashid) {
  db('voters')
    .where('id', voter.id)
    .update('hashid', hashid)
    .catch(err=> {
      console.error('ERROR: ' , err);
    });
}

const generateSemaphore = semaphore(parseInt(process.env.PDF_GEN_LIMIT || '20'));

function _setSemaphoreCapacity(capacity) {
  generateSemaphore.capacity = capacity;
}

function generatePdfFromHtml(html, voters, callback) {
  const tmpdir = os.tmpdir();
  const datestamp = dateStamp();
  const uuid = uuidv4();
  const remotefileName = datestamp + '-' + uuid + '-letter.pdf'
  const filePath = tmpdir + '/' + remotefileName;
  let downloadFileName;
  if (voters.length === 1) {
    const lastName = voters[0].last_name;
    downloadFileName = datestamp + '-' + lastName + '-VoteForward-letter.pdf';
  }
  else {
    downloadFileName = datestamp + '-votefwd-letters-batch-of-' + voters.length + '.pdf';
  }
  generateSemaphore.take(function () {
    pdf.create(html, { format: 'Letter', timeout: '100000' }).toFile(filePath, function(err, response) {
      generateSemaphore.leave();

      if (err) {
        console.error('ERROR:', err);
        callback(err);
        return;
      }

      callback(null, response, downloadFileName);
    });
  });
}

module.exports = {
  generatePdfForVoters,
  _generatePdfFromHtml: util.exposeForTests('_generatePdfFromHtml', generatePdfFromHtml),
  _getReturnAddressForVoter: util.exposeForTests('_getReturnAddressForVoter', getReturnAddressForVoter),
  _setSemaphoreCapacity: util.exposeForTests('_setSemaphoreCapacity', _setSemaphoreCapacity),
}
