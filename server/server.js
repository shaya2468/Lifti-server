require('./config/config');
var path = require('path'),

  fs = require('fs'),
  os = require('os'),
  formidable = require('formidable'),
  gm = require('gm'),
  s3 = require('./amazon/s3.js');


const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var methodOverride = require('method-override');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Group} = require('./models/group');
var {Lift} = require('./models/lift');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var routes = require('./routes/routes')
var app = express();
const port = process.env.PORT;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
  res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");

  next();
});

app.use(bodyParser.urlencoded({
    extended: true
  }))
app.use(bodyParser.json());
app.use(methodOverride());

routes(app);

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
