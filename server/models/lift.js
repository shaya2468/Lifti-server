const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LiftSchema = new Schema({
  origin: {
    type: String,
    required: [true, 'origin is mandatory'],
    minlength: 2
  },

  destination: {
    type: String,
    required: [true, 'origin is mandatory'],
    minlength: 2
  },

  description: String,

  capacity: {
    type: Number,
    required: [true, 'capacity is mandatory']
  },

  _owner: { type: Schema.Types.ObjectId, ref: 'user' },

  riders: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],

  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'group'
  }]
});

const Lift = mongoose.model('lift', LiftSchema);

module.exports = {Lift};
