//slackService.js
'use strict'

var voterService = require('./voterService');
var SlackUrl = process.env.REACT_APP_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(SlackUrl);
var cron = require('node-cron');
var db = require('./db');
var n = 30;

cron.schedule('*/n * * * *', () => {
  console.log(`running a task every ${n} minutes`);
  nbrNewUsers(n, publishToSlack);
});


function publishToSlack(message) {
  slack.send({
    channel: '#app-activity',
    text: message
  })
}

function nbrNewUsers(n, callback) {
  db('users')
    .count()
    .whereRaw("created_at >= current_timestamp + interval '30 minutes'")
    .then((results) => {
      let newUserCount = results[0].count;
        callback(`number of new users in the last ${n} minutes is ${newUserCount}`);
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
