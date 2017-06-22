const {Group} = require('../models/group');
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
  }
};
