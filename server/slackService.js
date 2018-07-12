//slackService.js
'use strict'

var SlackUrl = process.env.REACT_APP_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(SlackUrl);

function publishToSlack(message) {
  slack.send({
    channel: '#app-activity',
    text: message
  })
}

module.exports = {
  publishToSlack
}
