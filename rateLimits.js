var RateLimit = require('express-rate-limit'); //https://www.npmjs.com/package/express-rate-limit

var makePledgeRateLimit = new RateLimit({
  windowMs: 60*60*1000, // 1 hour window
  delayAfter: 0, // begin slowing down responses after the first request
  delayMs: 0, // slow down subsequent responses by 1 seconds per request
  max: 10, // start blocking after 10 requests
  message: "Too many pledge attemps made from right now.  Please try again later.",
});

module.exports = {
  makePledgeRateLimit,
}