//slackService.js
'use strict'

var voterService = require('./voterService');
var SlackUrl = process.env.REACT_APP_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(SlackUrl);
var cron = require('node-cron');
var db = require('./db');

/*Must set minutes between reports here and also hard code in the .whereRaw in functions
  nbrNewUsers, nbrVotersAdopted
  Postgresql has no easy way to subtract a number of minutes from the current timestamp
*/

var n = 30;

cron.schedule('*/n * * * *', () => {
  console.log(`running a task every ${n} minutes`);
  nbrNewUsers(n, publishToSlack);
  nbrVotersAdopted(n, publishToSlack);
});


function publishToSlack(message) {
  slack.send({
    channel: '#app-activity',
    text: message
  })
}

/* Must change interval in .whereRaw clause as well as in var n above
   because Postgresql 10 has no easy way to subtract a variable interval from the current current_timestamp
*/

function nbrNewUsers(n, callback) {
  db('users')
    .count()
    .whereRaw("created_at >= current_timestamp - interval '30 minutes'")
    .then((results) => {
      let newUserCount = results[0].count;
        (newUserCount == 1) ?
            callback(`${newUserCount} new user signed up in the last ${n} minutes`) :
            callback(`${newUserCount} new users signed up in the last ${n} minutes`);
        return;
    })
    .catch(err => {
      console.error(err);
      callback(err);
    });
}

function nbrVotersAdopted(n, callback) {
  db('voters')
    .count()
    .whereRaw("adopted_at >= current_timestamp - interval '30 minutes'")
    .then((results) => {
      let adoptedVoterCount = results[0].count;
        (adoptedVoterCount == 1) ?
        callback(`${adoptedVoterCount} voter adopted in the last ${n} minutes`) :
        callback(`${adoptedVoterCount} voters adopted in the last ${n} minutes`);
        return;
    })
    .catch(err => {
      console.error(err);
      callback(err);
    });
}

module.exports = {
  publishToSlack
}
