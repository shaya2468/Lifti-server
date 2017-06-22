const {Lift} = require('../models/lift');
const {ObjectID} = require('mongodb');
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
      return Lift.findOneAndUpdate({_id: id, 'riders': {$ne: req.user._id}}, {$push: {riders: req.user._id}}, {runValidators: true})

    }).then((lift) => {
      if (!lift) {
        return res.status(404).send();
      }
      res.send({});
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
  }
};
