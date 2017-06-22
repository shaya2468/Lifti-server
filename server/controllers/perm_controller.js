const {Perm} = require('../models/perm');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

module.exports = {
  create(req, res) {

    //Todo : make 2 indexes unique, this is very bad hack, because it makes 2 queries to the db, right
    // now the 2 index uniqueness doesn't work, need investigation.
    Perm.find({_group: req.body.group_id, _applicant: req.user._id})
      .then((res) => {
        console.log(res);
        console.log(res.length);
        if (res.length > 0){
          throw({message: "request already exists"})
        }

        let perm = new Perm({
          _group: req.body.group_id,
          _applicant: req.user._id,
          message: req.body.message
        });

        return perm.save();

      }).then((result) => {
          res.send({});
      }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
      })
  }
}
