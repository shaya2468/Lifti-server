const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: String,
  _user: { type: Schema.Types.ObjectId, ref: 'user' }
});

const Group = mongoose.model('group', GroupSchema);

module.exports = {Group};
