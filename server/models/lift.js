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

  // riders: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'user';
  //   validate: [arrayLimit, '{PATH} exceeds the limit of 0']
  // }],
  riders: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
    }],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10']
  },

  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'group'
  }]
});

function arrayLimit(val) {
  console.log('got here with ' + val.length);
  return val.length < this.capacity;
}

// the runValidators does not work
LiftSchema.pre('update', function(next)  {
  console.log('in the middleware');
  this.options.runValidators = true;
  next();
});

const Lift = mongoose.model('lift', LiftSchema);

module.exports = {Lift};
