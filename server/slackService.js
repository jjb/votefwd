//slackService.js
'use strict'

var voterService = require('./voterService');
var SlackUrl = process.env.REACT_APP_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(SlackUrl);
var cron = require('node-cron');
var db = require('./db');
var n = 30;
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + (today.getMinutes() - n) + ":" + today.getSeconds()
var dateTime = date+' '+time;

cron.schedule('*/n * * * *', () => {
  console.log('running a task every thirty minutes');
  publishToSlack('You are old, Father William, the Young Man said');

});


function publishToSlack(message) {
  slack.send({
    channel: '#app-activity',
    text: message
  })
}

function nbrNewUsers(n, dateTime) {
  db('users')
  .where({created_at >= dateTime})
  .then(function(user){

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
