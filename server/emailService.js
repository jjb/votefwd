// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

function sendEmail(){
    // Create sendEmail params
    var params = {
      Destination: { /* required */
        // CcAddresses: [
        //   'EMAIL_ADDRESS',
        //   /* more items */
        // ],
        ToAddresses: [
          'andrewjtimmons@gmail.com',
          /* more items */
        ]
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
           Charset: "UTF-8",
           Data: "HTML_FORMAT_BODY"
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
      Source: 'scott@votefwd.org', /* required */
      ReplyToAddresses: [
          'scott@votefwd.org',
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