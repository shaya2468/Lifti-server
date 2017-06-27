const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const CitySchema = new Schema({

  name: {
    type: String,
    required: [true, 'city id is mandatory'],
    unique: true,
    dropDups: true
  }
});

CitySchema.plugin(uniqueValidator);

const City = mongoose.model('city', CitySchema);

module.exports = {City};
