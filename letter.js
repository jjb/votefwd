//letter.js

// doing this the dumb way for now...
// TODO: migrate to proper templating language, like handlebars 

'use strict'

function prepMarkup(timestamp) {

  var markup = '';

  var text = {
    salutation :  "Dear",
    preamble :  "I have pledged to vote in every election, because",
    graph3 :  "I’d like to ask you to do the same.",
    graph4 :  "Will you commit to be a voter and cast your ballot in the mid-term election on Tuesday, November 6, 2018?",
    graph5 :  "I’m not asking you to vote for any particular candidate, only to be a voter. I’d like to know if you received this and plan to vote, so I’ve enclosed a stamped reply postcard. Just initial it and drop it in the mail.",
    graph6 :  "And then, on November 6, cast your ballot and make your voice heard!",
    closing :  "Thank you,",
    footer :  "This letter was sent via Vote Forward, a non-partisan organization that works to increase voter turnout. Visit http://votefwd.org to learn more.",
    timestamp: timestamp
  }

  console.log(text.timestamp);

  for (var key in text) {
    markup += '<p>' + text[key] + '</p>';
  }
  
  return markup
}

module.exports = prepMarkup;
