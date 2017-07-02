const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LiftSchema = new Schema({

  origin_city: { type: Schema.Types.ObjectId, ref: 'city' },

  origin_street: {
    type: String,
    required: [true, 'origin_street is mandatory'],
    minlength: 1
  },

  destination_city: { type: Schema.Types.ObjectId, ref: 'city' },

  destination_street: {
    type: String,
    required: [true, 'destination_street is mandatory'],
    minlength: 1
  },

  description: String,
  user_status: String,
  capacity: {
    type: Number,
    required: [true, 'capacity is mandatory']
  },

  leave_at: {
    type: Number,
    required: [true, 'leave_at is mandatory']
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

LiftSchema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});

LiftSchema.methods.userStatus = function(userId) {

  if (this._owner._id.toString() === userId.toString()){
    this.user_status = 'owner'
    return 'owner';
  }

  if (this.riders.some(rider => rider._id.toString() === userId.toString())){
    this.user_status = 'rider'
    return 'rider';
  }

  this.user_status = 'none';
  return 'none'

};

const Lift = mongoose.model('lift', LiftSchema);

module.exports = {Lift};
