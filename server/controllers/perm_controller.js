const {Perm} = require('../models/perm');
const {Group} = require('../models/group');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

module.exports = {
  create(req, res) {

    //Todo : make 2 indexes unique, this is very bad hack, because it makes 2 queries to the db, right
    // now the 2 index uniqueness doesn't work, need investigation.
    Perm.find({_group: req.body.group_id, _applicant: req.user._id})
      .then((res) => {

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
  },

  getForUser(req, res) {
    Group.find({_manager:req.user._id})
    .then((groups) => {

      var groupIds = groups.map(function(doc) { return doc._id; });
      return Perm.find({_group: {$in: groupIds}}).populate('_applicant').populate('_group')

    }).then((perms) => {

      var permsFiltered = perms.map((perm) => {

          return {
            group_id:perm._group.id,
            group_name: perm._group.name,
            applicant_id: perm._applicant.id,
            applicant_name: perm._applicant.name,
            applicant_pic: perm._applicant.pic,
            message: perm.message
          };
      })

      res.send(permsFiltered);
    }).catch((e) => {
      console.log(e);
      res.status(400).send(e);
    })
  },

  accept(req, res) {
    var groupId = req.body.group_id;
    var applicantId = req.body.applicant_id;

    return Promise.all([Perm.remove({_group:groupId, _applicant: applicantId}),
                      Group.findOneAndUpdate({_id: groupId, 'members': {$ne: applicantId}}, {$push: {members: applicantId}}, {new: true})])
                      .then((result) => {
                        res.send({});

                      }).catch((e) => {
                        console.log(e);
                        res.status(400).send(e);
                      })
  },

  reject(req, res) {
    var groupId = req.body.group_id;
    var applicantId = req.body.applicant_id;

    return Perm.remove({_group:groupId, _applicant: applicantId})
                      .then((result) => {
                        console.log(result);
                        res.send({});

                      }).catch((e) => {
                        console.log(e);
                        res.status(400).send(e);
                      })
  }
}
