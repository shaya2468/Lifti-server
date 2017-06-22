const {Perm} = require('../models/perm');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

module.exports = {
  create(req, res) {

    let perm = new Perm({
      _group: req.body.group_id,
      _applicant: req.user._id,
      message: req.body.message
    });

    perm.save().then((doc) => {
      res.send({});
    }, (e) => {
      res.status(400).send(e);
    });
  }
}
