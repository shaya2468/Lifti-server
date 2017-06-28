const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is mandatory'],
    minlength: 2
  },
  description: {
    type: String,
    required: [true, 'description is mandatory'],
    minlength: 2
  },
  pic: {
    type: String
  },
  _manager: { type: Schema.Types.ObjectId, ref: 'user' },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }]
});

GroupSchema.set('toJSON', {
     transform: function (doc, ret, options) {
       console.log('transformers!!!!');
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});

GroupSchema.methods.userStatus = function(userId) {
  if (this._manager.toString() === userId.toString()){
    return 'manager';
  }

  if (this.members.some(member => member.toString() === userId.toString())){
    return 'member';
  }

  return 'non_member'

};

const Group = mongoose.model('group', GroupSchema);

module.exports = {Group};
