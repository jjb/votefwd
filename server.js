 //server.js
'use strict'

var express = require('express');
var cors = require('cors');
var path = require('path');

var app = express();
var router = express.Router();
var port = process.env.REACT_APP_API_PORT || 3001;
var corsOption = {
  origin: true,
  moethods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
}

var voters = [
  { id: 1, name: 'jim', state: 'CA'},
  { id: 2, name: 'sally', state: 'PA'}
]

//app.use(express.static(path.join(__dirname, 'build')));
app.use(cors(corsOption));

router.get('/', function(req, res) {
  res.json('API initialized.');
});

router.route('/voters')
  .get(function(req, res) {
    res.json(voters);
  });

//Use router configuration at /api
app.use('/api', router);

//start server and listen for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
