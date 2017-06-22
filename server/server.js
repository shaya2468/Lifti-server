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

app.post('/groups/join/:id', authenticate, (req, res) => {

  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  //http://stackoverflow.com/questions/15921700/mongoose-unique-values-in-nested-array-of-objects
  Group.findOneAndUpdate({_id: id, 'members': {$ne: req.user._id}}, {$push: {members: req.user._id}})
  .then((group) => {
    if (!group) {
      return res.status(404).send();
    }
    res.send({});

  }).catch((e) => {
    console.log(e);
    res.status(400).send();
  })

});

app.get('/groups', authenticate, (req, res) => {
  Group.find({$or:[{_manager: req.user._id}, {'members': {$in: [req.user._id]}}]

  }).then((groups) => {

    var groupsFiltered = groups.map((group) => {
        var groupTemp = new Group({name: group.name, description: group.description, pic: group.pic, _manager: group._manager, members: group.members});
        return {
          name:group.name,
          description:group.description,
          pic: group.pic,
          user_status:groupTemp.userStatus(req.user._id)
        };
    })
    res.send({groupsFiltered});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/groups/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Group.findOne({
    _id: id,
    _manager: req.user._id
  }).populate( 'members')
  .then((group) => {
    if (!group) {
      return res.status(404).send();
    }
    var membersFilteredInfo = group.members.map((element) => {
      return {
        name:element.name,
        email:element.email
      };
    });

    var returnGroup = {name: group.name, members: membersFilteredInfo}
    res.send(returnGroup);
  }).catch((e) => {
    console.log(e);
    res.status(400).send();
  });
});

app.get('/groups/search/:query', authenticate, (req, res) => {
  var query = req.params.query;

  Group.find({
    name: new RegExp(query, 'i')
  }).populate( 'members')
  .then((groups) => {

    if (!groups){
      res.send([]);
      return;
    }

    var groupsEnhanced = groups.map((groupElement) => {
      var membersFilteredInfo = groupElement.members.map((element) => {
        return {
          id: element._id,
          name:element.name,
          email:element.email

        };
      });

      return{
        id: groupElement._id,
        name: groupElement.name,
        description: groupElement.description,
        image: groupElement.pic,
        members: membersFilteredInfo
      }


    })

    res.send(groupsEnhanced);

  }).catch((e) => {
    console.log(e);
    res.status(400).send();
  });
});

app.delete('/groups/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Group.findOneAndRemove({
    _id: id,
    _manager: req.user._id
  }).then((group) => {
    if (!group) {
      return res.status(404).send();
    }

    res.send({group});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/groups/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['name']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Group.findOneAndUpdate({_id: id, _manager: req.user._id}, {$set: body}, {new: true}).then((group) => {
    if (!group) {
      return res.status(404).send();
    }

    res.send({group});
  }).catch((e) => {
    res.status(400).send();
  })
});

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'name']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


///////upload Started

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



////upload ended

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

// Lifts

app.post('/lifts', authenticate, (req, res) => {

  var body = {
      origin_city: req.body.origin_city,
      origin_street: req.body.origin_street,
      destination_city: req.body.destination_city,
      destination_street: req.body.destination_street,
     _owner : req.user._id,
     description: req.body.description,
     leave_at:req.body.leave_at,
     capacity: req.body.capacity,
     groups: [new ObjectID(req.body.groups[0])]
  }

  var lift = new Lift(body);

  lift.save().then((doc) => {

    res.status(200).send(doc);
  }, (e) => {
    console.log('error');
    console.log(e);
    res.status(400).send(e);
  });
});

app.post('/lifts/join/:id', authenticate, (req, res) => {

  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Lift.findOne({_id: id})
  .then((lift) => {

    if (lift.capacity <= lift.riders.length){
      throw new Error("capacity full");
    }
    return Lift.findOneAndUpdate({_id: id, 'riders': {$ne: req.user._id}}, {$push: {riders: req.user._id}}, {runValidators: true})

  }).then((lift) => {
    if (!lift) {
      return res.status(404).send();
    }
    res.send({});
  }).catch((e) => {
    res.status(400).send(e.toString());
  })
});

app.get('/lifts/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Lift.findOne({
    _id: id
  }).populate( 'riders').populate('_owner')
  .then((lift) => {
    if (!lift) {
      return res.status(404).send();
    }
    var ridersFilteredInfo = lift.riders.map((element) => {
      return {
        name:element.name,
        email:element.email
      };
    });

    var returnLift = {owner: lift._owner.name, description: lift.description, origin:lift.origin, destination:lift.destination, riders: ridersFilteredInfo}
    res.send(returnLift);
  }).catch((e) => {
    console.log(e);
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
