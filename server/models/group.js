const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is mandatory'],
    minlength: 2
  },
  _manager: { type: Schema.Types.ObjectId, ref: 'user' },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }]
});

const Group = mongoose.model('group', GroupSchema);

module.exports = {Group};
