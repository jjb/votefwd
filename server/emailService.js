// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var fs = require('fs');
var template = fs.readFileSync('./email/layout.html', 'utf8');

// Set the region
AWS.config.update({region: 'us-west-2'});

function sendEmail(){
    // Create sendEmail params
    var params = {
      Destination: { /* required */
        // CcAddresses: [
        //   'EMAIL_ADDRESS',
        //   /* more items */
        // ],
        ToAddresses: [
          'sjforman@gmail.com',
          /* more items */
        ]
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
           Charset: "UTF-8",
           Data: template
          },
          Text: {
           Charset: "UTF-8",
           Data: "TEXT_FORMAT_BODY"
          }
         },
         Subject: {
          Charset: 'UTF-8',
          Data: 'Test email'
         }
        },
      Source: 'andrewjtimmons@gmail.com', /* required */
      ReplyToAddresses: [
          'andrewjtimmons@gmail.com',
        /* more items */
      ],
    };

    // Create the promise and SES service object
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
      function(data) {
        console.log(data.MessageId);
      }).catch(
        function(err) {
        console.error(err, err.stack);
      });
}

module.exports = {
  sendEmail
}
