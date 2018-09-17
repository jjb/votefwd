var RateLimit = require('express-rate-limit'); //https://www.npmjs.com/package/express-rate-limit

var makePledgeRateLimit = new RateLimit({
  windowMs: 60*60*1000, // 1 hour window
  delayAfter: 0, // no delay
  delayMs: 0, // no delay
  max: 10, // start blocking after 10 requests
  message: "Too many pledge attemps made from right now.  Please try again later.",
});

var lookupDistrictRateLimit = new RateLimit({
  windowMs: 60*1000, // 1 minute window
  delayAfter: 0, // no delay
  delayMs: 0, // no delay
  max: 10, // start blocking after 10 requests
  message: "Too many district lookup attemps made from right now.  Please try again later.",
});

module.exports = {
  makePledgeRateLimit,
  lookupDistrictRateLimit,
}
