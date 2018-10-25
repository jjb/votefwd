var RateLimit = require('express-rate-limit'); //https://www.npmjs.com/package/express-rate-limit

var makePledgeRateLimit = new RateLimit({
  windowMs: 60*60*1000, // 1 hour window
  delayAfter: 0, // no delay
  delayMs: 0, // no delay
  max: 10, // start blocking after 10 requests
  message: "Too many pledge attempts made in short succession.  Please try again later.",
});

var lookupDistrictRateLimit = new RateLimit({
  windowMs: 60*1000, // 1 minute window
  delayAfter: 0, // no delay
  delayMs: 0, // no delay
  max: 100, // start blocking after 100 requests
  message: "Too many district lookup attempts made in short succession.  Please try again later.",
});

module.exports = {
  makePledgeRateLimit,
  lookupDistrictRateLimit,
}
