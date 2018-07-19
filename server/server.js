 //server.js
'use strict'

var express = require('express');
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');
var pdf = require('html-pdf');
var Storage = require('@google-cloud/storage');
var Handlebars = require('handlebars');
var Hashids = require('hashids');
var uuidv4 = require('uuid/v4');
var request = require('request');
var compileSass = require('express-compile-sass');

var rateLimits = require('./rateLimits')
var userService = require('./userService');
var voterService = require('./voterService');
var letterService = require('./letterService');
var slackService = require('./slackService');

var db = require('./db');
var fs = require('fs');
var os = require('os');

var app = express();
var jwt = require('express-jwt');
var jwtAuthz = require('express-jwt-authz');
var jwksRsa = require('jwks-rsa');
var router = express.Router();
var port = process.env.REACT_APP_API_PORT || 3001;
var corsOption = {
  origin: true,
  moethods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
}

var hashids = new Hashids(process.env.REACT_APP_HASHID_SALT, 6,
  process.env.REACT_APP_HASHID_DICTIONARY);

app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://votefwd.auth0.com/.well-known/jwks.json'
  }),

  // Validate the audience and the issuer.
  audience: 'https://votefwd.org/api',
  issuer: 'https://votefwd.auth0.com/',
  algorithms: ['RS256']
});


router.get('/', function(req, res) {
  res.json('API initialized.');
});

router.route('/voters')
  .get(checkJwt, function(req, res) {
    voterService.getUsersAdoptedVoters(req.query.user_id,
      function(result) {
          res.json(result)
      });
  });

router.route('/voter/adopt-random')
  .post(checkJwt, function(req, res) {
    voterService.adoptRandomVoter(req.body.adopterId, req.body.numVoters, function(voters) {
      let response = {};
      response.voters = voters;
      res.json(response);
    });
  });

router.route('/voters/downloadAllLetters')
  .get(checkJwt, function(req, res) {
    voterService.downloadAllLetters(req.query.user_id,
      function(filepath, downloadFileName) {
        res.header('Access-Control-Expose-Headers', "Filename");
        res.header('Filename', downloadFileName);
        res.download(filepath, downloadFileName, function (err) {
           if (err) {
              console.log("Error downloading all letters.");
              console.log(err);
           } else {
              console.log("Success downloading all letters.");
           }
        });
      });
  });

router.route('/voter/confirm-prepped')
  .put(checkJwt, function(req, res) {
    voterService.confirmPrepped(req.body.id, function(result) {
      res.json(result);
    });
  });

router.route('/voter/undo-confirm-prepped')
  .put(checkJwt, function(req, res) {
    voterService.undoConfirmPrepped(req.body.id, function(result) {
      res.json(result);
    });
  });

router.route('/voter/confirm-sent')
  .put(checkJwt, function(req, res) {
    voterService.confirmSent(req.body.id, function(result) {
      res.json(result);
    });
  });

router.route('/voter/pledge')
  .post(rateLimits.makePledgeRateLimit, function(req, res) {
    voterService.makePledge(req.body.code, function(result) {
      res.json(result);
    });
  });

router.route('/voter/signed-letter-url')
  .get(checkJwt, function(req, res) {
    letterService.getSignedUrl(req.query.url, function(result) {
      res.json(result);
    });
  });

router.route('/user/new')
  .post(checkJwt, function(req, res) {
    if (req.body.auth0_id) {
      db('users').where('auth0_id', req.body.auth0_id)
        .then(function(result) {
          if (result.length != 0) {
            res.status(200).send('User already exists.');
          }
          else {
            db('users').insert({auth0_id: req.body.auth0_id})
              .then(function(result) {
              res.status(201).send(result);
            })
            .then(function() {
              slackService.publishToSlack('A new user signed up.');
            })
            .catch(err => {console.error(err)});
          }
        })
        .catch(err => {console.error(err)});
    }
  })

function verifyHumanity(req, callback) {
  const recaptchaResponse = req.body.recaptchaResponse;
    request.post('https://www.google.com/recaptcha/api/siteverify', {
      form: {
        secret: process.env.REACT_APP_RECAPTCHA_SECRET_KEY,
        response: recaptchaResponse,
        remoteip: req.connection.remoteAddress
      },
    }, (err, httpResponse, body)=>{
      if(err) {
        err => {console.error(err);}
      }
      else {
        const r = JSON.parse(body);
        if (r.success) {
          callback(true);
        } else {
          callback(false);
        }
      }
    });
}

router.route('/recaptcha')
  .post(checkJwt, function(req, res) {
    verifyHumanity(req, function(r) {
      if(r) {
        res.json(r);
      } else {
        res.status(400);
        res.send({
          error: 'Please verify that you\'re human'
        })
      }
    });
  });

router.route('/user')
  .get(checkJwt, function(req, res) {
    db('users')
      .where('auth0_id', req.query.auth0_id)
      .then(function(result) {
        res.json(result);
      })
      .catch(err => {console.error(err);})
  })
  .post(checkJwt, function(req, res) {
    let query = db('users')
      .where('auth0_id', req.body.auth0_id)
      .update('updated_at', db.fn.now())
    if (req.body.is_human_at) {
      query.update('is_human_at', db.fn.now())
      .then(res.status(201).send('Stored humanness timestamp.'))
      .catch(err=> {console.error('ERROR: ', err)})
    }
    if (req.body.pledged_vote_at) {
      query.update('pledged_vote_at', db.fn.now())
      .then(res.status(201).send('Stored sender pledge to vote timestamp.'))
      .catch(err=> {console.error('ERROR: ', err)})
    }
    if (req.body.full_name) {
      query.update('full_name', req.body.full_name)
      .then(res.status(201).send('Stored full name.'))
      .catch(err=> {console.error('ERROR: ', err)})
    }
    if (req.body.is_resident_at) {
      query.update('is_resident_at', db.fn.now())
      .then(res.status(201).send('Stored legal status.'))
      .catch(err=> {console.error('ERROR: ', err)})
    }
    if (req.body.zip) {
      query.update('zip', req.body.zip)
      .then(res.status(201).send('Stored ZIP code.'))
      .catch(err=> {console.error('ERROR: ', err)})
    }
    if (req.body.accepted_code_at) {
      query.update('accepted_code_at', db.fn.now())
      .then(query.update('accepted_terms_at', db.fn.now()))
      .then(res.status(201).send('Stored code and terms agreement timestamps.'))
      .catch(err=> {console.error('ERROR: ', err)})
    }
  });

/**
 * Check that the logged in user is an admin.
 */
function checkAdmin(req, res, next) {
  if (!req.user || !req.user.sub) {
    next(new checkJwt.UnauthorizedError('credentials_required',
      { message: 'No authorization token was found' }));
    return;
  }

  const auth0_id = req.user.sub;
  userService.isAdmin(auth0_id, function (error, isAdmin) {
    if (error) {
      next(error);
      return;
    }
    if (!isAdmin) {
      // Normally, we would send back a 401 or a 403, but if we don't want to
      // expose that this is a real route, then send back a 404.
      res.status(404).send('Not found');
      return;
    }
    next();
  });
}

// Check that a user is an admin.  You have to be an admin to do so, but you can
// check on another user.
router.route('/s/isAdmin')
  .get(checkJwt, checkAdmin, function(req, res) {
    const auth0_id = req.query.auth0_id;
    if (!auth0_id) {
      res.status(400);
      return;
    }
    userService.isAdmin(auth0_id, function (error, isAdmin) {
      if (error) {
        console.error(error);
        res.status(500);
        return;
      }
      res.json({ is_admin: isAdmin });
    });
  });

router.route('/s/users')
  .get(checkJwt, checkAdmin, function(req, res) {
    db('users')
      .then(function(result) {
        res.json(result)
      })
      .catch(err => {console.error(err);})
  });

router.route('/s/stats')
  .get(checkJwt, checkAdmin, function(req, res) {
    db('voters')
      .then(function(result) {
        let availableCount = result.length;
        let adoptedCount = result.filter(voter =>
          voter.adopted_at && !voter.confirmed_prepped_at && !voter.confirmed_sent_at).length;
        let preppedCount = result.filter(voter =>
          voter.adopted_at && voter.confirmed_prepped_at && !voter.confirmed_sent_at).length;
        let sentCount = result.filter(voter =>
          voter.adopted_at && voter.confirmed_prepped_at && voter.confirmed_sent_at).length;
        let totalCount = result.filter(voter =>
          voter.adopted_at).length;
        let counts = {
          available: availableCount,
          adopted: adoptedCount,
          prepped: preppedCount,
          sent: sentCount,
          total: totalCount
        };
        res.json(counts)
      })
      .catch(err => {console.error(err);})
  });

//Use router configuration at /api
app.use('/api', router);

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

//start server and listen for requests
var server = app.listen(port, function() {
  console.log(`api running on port ${port}`);
});

module.exports = server;
