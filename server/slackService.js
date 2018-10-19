//slackService.js
'use strict'

var SlackUrl = process.env.REACT_APP_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(SlackUrl);
var cron = require('node-cron');
var n = 30;

cron.schedule('*/n * * * *', () => {
  console.log('running a task every two minutes');
  publishToSlack('You are old, Father William, the Young Man said');

});


function publishToSlack(message) {
  slack.send({
    channel: '#app-activity',
    text: message
  })
}

module.exports = {
  publishToSlack
}
