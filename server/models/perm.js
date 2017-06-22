const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermSchema = new Schema({

  _group: {
    type: Schema.Types.ObjectId,
    required: [true, 'group id is mandatory'],
    ref: 'group' },
  _applicant: {
    type: Schema.Types.ObjectId,
    required: [true, 'user id of applicanat is required'],
    ref: 'user' },
    message: String
});
// PermSchema.index({ _group: 1, _applicant: 1}, { unique: true }); this is not working
const Perm = mongoose.model('perm', PermSchema);

module.exports = {Perm};
