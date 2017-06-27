const _ = require('lodash');
const {City} = require('../models/city');

module.exports = {

  get(req, res) {
   var cities = req.body.cities;
   var citiesObjects = cities.map((city) => {
      return newCity = new City({name: city});
   })

   City.insertMany(citiesObjects).then((doc) => {
     res.send(doc);
   }).catch((e) => {
     res.status(400).send(e);
  })
 }
};
