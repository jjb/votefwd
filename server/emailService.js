// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var fs = require('fs');
var Handlebars = require('handlebars');

// Set the region
AWS.config.update({region: 'us-west-2'});

function sendEmail(templateName, context, subject){
    // This function takes a template name for an email and a context that is
    // is a javascript object that has key value pairs to populate variables in the
    // passed template.
    var header = fs.readFileSync('./email/header.html', 'utf8');
    var body = fs.readFileSync('./email/' + templateName + '.html', 'utf8');
    var footer = fs.readFileSync('./email/footer.html', 'utf8');
    var template = header + body + footer;
    var uncompiledTemplate = Handlebars.compile(template);
    var html = uncompiledTemplate(context);
    // Create sendEmail params
    var params = {
      Destination: { /* required */
        // CcAddresses: [
        //   'EMAIL_ADDRESS',
        //   /* more items */
        // ],
        ToAddresses: [
          context.email,
          /* more items */
        ]
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
           Charset: "UTF-8",
           Data: html
          },
          Text: {
           Charset: "UTF-8",
           Data: "TEXT_FORMAT_BODY"
          }
         },
         Subject: {
          Charset: 'UTF-8',
          Data: subject
         }
        },
      Source: 'Vote Forward <hello@votefwd.org>', /* required */
      ReplyToAddresses: [
          'help@votefwd.org',
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
