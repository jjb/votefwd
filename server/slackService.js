//slackService.js
'use strict'

var SlackUrl = process.env.REACT_APP_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(SlackUrl);
var cron = require('node-cron');

cron.schedule('0 * * * *', () => {
  console.log('running a task every hour');
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
