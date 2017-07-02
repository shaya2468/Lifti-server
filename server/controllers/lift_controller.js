const {Lift} = require('../models/lift');
const {ObjectID} = require('mongodb');
const {Group} = require('../models/group');

const _ = require('lodash');

module.exports = {
  create(req, res) {
    var body = {
        origin_city: req.body.origin_city,
        origin_street: req.body.origin_street,
        destination_city: req.body.destination_city,
        destination_street: req.body.destination_street,
       _owner : req.user._id,
       description: req.body.description,
       leave_at:req.body.leave_at,
       capacity: req.body.capacity,
       groups: req.body.groups
    }

    var lift = new Lift(body);

    lift.save().then((doc) => {

      res.status(200).send(doc);
    }, (e) => {
      console.log('error');
      console.log(e);
      res.status(400).send(e);
    });
  },

  join(req, res) {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Lift.findOne({_id: id})
    .then((lift) => {

      if (lift.capacity <= lift.riders.length){
        throw new Error("capacity full");
      }
      return Lift.findOneAndUpdate({_id: id, 'riders': {$ne: req.user._id}}, {$push: {riders: req.user._id}}, {new: true}).populate('riders')

    }).then((lift) => {
      if (!lift) {
        return res.status(404).send();
      }
      res.send(lift);
    }).catch((e) => {
      res.status(400).send(e.toString());
    })
  },

  getLiftById(req, res) {
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
  },

  getLiftsByQuery(req, res){
    const {origin_city, destination_city, from_time, till_time}  = req.query;
    Group.find({$or:[{_manager: req.user._id}, {'members': {$in: [req.user._id]}}]

    }).then((groups) => {
      var groupIds = groups.map((group) => group._id);
      return Lift.find({'groups': {$in: groupIds}, origin_city, destination_city,
                        "leave_at": {$gt: from_time, $lt: till_time}})
                        .populate('origin_city')
                        .populate('destination_city')
                        .populate('_owner')
                        .populate('riders')
                        .sort({leave_at: 1})
    }).then((lifts) => {

      lifts.forEach((lift) => {
        lift.userStatus(req.user._id)
      })

      res.send(lifts);
    }).catch((e) => {
      console.log(e);
      res.status(400).send();
    })



  }
};
