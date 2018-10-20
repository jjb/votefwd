//slackService.js
'use strict'

var voterService = require('./voterService');
var SlackUrl = process.env.REACT_APP_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(SlackUrl);
var cron = require('node-cron');
var db = require('./db');
// var n = 30;
var n = 2;
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + (today.getMinutes() - n) + ":" + today.getSeconds()
var dateTime = date+' '+time;

cron.schedule('*/n * * * *', () => {
//   console.log('running a task every thirty minutes');
  console.log('running a task every two minutes');
  // publishToSlack('You are old, Father William, the Young Man said');
  nbrNewUsers(n, dateTime, publishToSlack);
});


function publishToSlack(message) {
  slack.send({
    channel: '#app-activity',
    text: message
  })
}

function nbrNewUsers(n, dateTime, callback) {
  db('users')
    .count()
    .where('created_at' >= dateTime)
    .then(function(results) {
      let newUserCount = results.count;
      if (newUserCount === 0) {
        console.error(`no new users joined in last ${n} minutes.`);
        callback(`no new users joined in last ${n} minutes.`);
        return;
      } else {
        callback(`number of new users in the last ${n} minutes is ${newUserCount}`);
        return;
      }
    })
    .catch(err => {
      console.error(err);
      callback(err);
    });
}


module.exports = {
  publishToSlack
}
