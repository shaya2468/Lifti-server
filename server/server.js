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



app.post('/upload', authenticate, (req, res) => {

    console.log('i go to upload route');
    function generateFileName(filename){
      console.log(filename);
      var ext_regex = /(?:\.([^.]+))?$/;
      var ext = ext_regex.exec(filename)[1];
      var date = new Date().getTime();
      var charBank = "abcdefghijklmnopqrstuvwxyz";
      var fstring = '';
      for (var i = 0; i<15; i ++){
        fstring += charBank[parseInt(Math.random()*26)];

      }
      return (fstring += date + '.' + ext);
    }


    var tmpFile, nFile, fname, groupId;
    var newForm = new formidable.IncomingForm();
        newForm.keepExtensions = true,
        newForm.parse(req, function(err, fields, files){
        console.log('error');
        console.log(err);

         groupId = fields.group_id;
         tmpFile = files.upload.path;
         fname = generateFileName(files.upload.name);
         console.log(fname);
         //temp directory on the server
         nfile = os.tmpDir() + '/' + fname;
       });

        newForm.on('end', function (){
          fs.rename(tmpFile, nfile, function (){
            // resize the image and we will upload this file into the s3 bucket
            // does not work on heroku
            gm(nfile).resize(300).write(nfile, function(){

              var uploadParams = {Bucket: process.env.S3_BUCKET, Key: '', Body: ''};
              uploadParams.Key = fname;
              var fileStream = fs.createReadStream(nfile);

              fileStream.on('error', function(err) {
                console.log('no such file stupid');
              });
              uploadParams.Body = fileStream;

              s3.upload (uploadParams, function (err, data) {
              if (err) {
                console.log("Error", err);
                res.status(404).end();

              } if (data) {
                console.log("Upload Success", data.Location);


                var doc = groupId ? Group: User;
                var _id = groupId ? groupId: req.user._id;

                doc.findOneAndUpdate({_id},  { $set: { pic: data.Location } }, { new: true })
                .then((result) => {
                  res.status(200);
                  res.send(result);
                }).catch((e) => {
                  res.status(404).end();
                });

                fs.unlink(nfile, function () {
                console.log(os.tmpDir());
                console.log('local file deleted');
                });

              }
              });
            });
          });
        });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
