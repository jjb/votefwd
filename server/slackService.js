//slackService.js
'use strict'

var slackUrl = process.env.REACT_APP_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(slackUrl);
var cron = require('node-cron');
var db = require('./db');

var interval = process.env.SLACK_REPORT_INTERVAL_MINUTES || 30;

cron.schedule('*/' + interval + ' * * * *', () => {
  Promise.all([
    getStats('users', 'created_at'),
    getStats('voters', 'adopted_at'),
    getStats('voters', 'confirmed_prepped_at'),
    getStats('voters', 'confirmed_sent_at'),
    getStats('voters', 'pledge_made_at')
  ])
  .then(values => {
    constructMessage(values)
    .then((message) => {
      publishToSlack(message)
    })
    .catch(err => {
      reject(err);
    })
  })
});

function getStats(table, timestamp_field) {
  return new Promise((resolve, reject) => {
    db(table)
      .count()
      .where(timestamp_field, '>=', db.raw(`now() - (?*'1 MINUTE'::INTERVAL)`,interval))
      .then((results) => {
        resolve(results[0].count);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function constructMessage(values) {
  return new Promise((resolve, reject) => {
    let message =
      `Over the last ${interval} minutes:
        new users: ${values[0]}
        voters adopted: ${values[1]}
        letters "prepped": ${values[2]}
        letters "sent": ${values[3]}
        pledges made: ${values[4]}
      `;
    resolve(message);
  });
}

function publishToSlack(message) {
  slack.send({
    channel: '#app-activity',
    text: message
  })
}
