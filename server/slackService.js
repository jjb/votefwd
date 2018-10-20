//slackService.js
'use strict'

var voterService = require('./voterService');
var SlackUrl = process.env.REACT_APP_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(SlackUrl);
var cron = require('node-cron');
var db = require('./db');
// var n = 30;
var n = 1;
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + (today.getMinutes() - n) + ":" + today.getSeconds()
var dateTime = date+' '+time;

// cron.schedule('*/n * * * *', () => {
//   console.log('running a task every thirty minutes');
  console.log('running a task every minute');
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
  .where({created_at >= dateTime})
  .then(function(){
        var msg = 'the number of new users is ' + count(*);
        callback(msg);
        return;
    })
    .catch(err => {
        console.error(err);
    });
  })
  .catch(err => {
      console.error(err);
  });
}

module.exports = {
  publishToSlack
}
