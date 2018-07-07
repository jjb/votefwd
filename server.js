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

var rateLimits = require('./rateLimits')
var voterService = require('./voterService');
var letterService = require('./letterService');
var db = require('./src/db');
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

app.use(express.static(path.join(__dirname, 'build')));

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
            });
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
      res.json(true);
      // TODO: MAKE THIS ACTUALLY WORK! CURRENTLY ALWAYS TRUE FOR ALPHA TESTING
      //if(r) {
        //res.json(r);
      //} else {
        //res.status(400);
        //res.send({
          //error: 'Please verify that you\'re human'
        //})
      //}
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
      .then(res.status(201).send('Stored code agreement timestamp.'))
      .catch(err=> {console.error('ERROR: ', err)})
    }
  });


// TODO: make sure to grant access to this route only to a (for now probably
// just hard-coded) list of administrators (once we have a way to protect them)
router.route('/s/users')
  .get(function(req, res) {
    db('users')
      .then(function(result) {
        res.json(result)
      })
      .catch(err => {console.error(err);})
  });

//Use router configuration at /api
app.use('/api', router);

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

//start server and listen for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
