require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Group} = require('./models/group');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/groups', authenticate, (req, res) => {
  var group = new Group({
    name: req.body.name,
    _manager: req.user._id
  });

  group.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

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
  Group.find({
    _manager: req.user._id
  }).then((groups) => {
    res.send({groups});
  }, (e) => {
    res.status(400).send(e);
  });
});

@// TODO: seperate request for members
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

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
