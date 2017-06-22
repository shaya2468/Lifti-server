require('./config/config');


const express = require('express');
const bodyParser = require('body-parser');
var methodOverride = require('method-override');
var {mongoose} = require('./db/mongoose');
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
