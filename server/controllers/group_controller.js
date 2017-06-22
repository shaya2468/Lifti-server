const {Group} = require('../models/group');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
module.exports = {

  create(req, res) {
   var group = new Group({
      name: req.body.name,
      description: req.body.description,
      _manager: req.user._id
    });

    group.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  },

  getAll(req, res){
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
  },

  getById(req, res){
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

      var returnGroup = {name: group.name, description:group.description, members: membersFilteredInfo}
      res.send(returnGroup);
    }).catch((e) => {
      console.log(e);
      res.status(400).send();
    });
  },

  search(req, res){
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
  },

  delete(req, res){
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
  },

  patch(req, res){
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
  }
};
