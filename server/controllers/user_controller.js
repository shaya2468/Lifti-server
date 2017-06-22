const {User} = require('../models/user');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

module.exports = {
  create(req, res) {
    console.log('ddddiiiii');
    var body = _.pick(req.body, ['email', 'password', 'name']);
    var user = new User(body);

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
  },

  login(req, res) {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
  },

  deleteToken(req, res) {
    req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
  },

  getMe(req, res) {
    res.send(req.user);
  }
};
