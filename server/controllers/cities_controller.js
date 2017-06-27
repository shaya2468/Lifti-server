const _ = require('lodash');
const {City} = require('../models/city');

module.exports = {

  add(req, res) {
   var cities = req.body.cities;
   var citiesObjects = cities.map((city) => {
      return newCity = new City({name: city});
   })

   City.insertMany(citiesObjects).then((doc) => {
     res.send(doc);
   }).catch((e) => {
     res.status(400).send(e);
  })
},

getAll(req, res){

  // not neccacary, because in the city model i removed it. just keeping around for future reference
  // var projection = {
  //   __v: false,
  // };
  // City.find({}, projection).then((cities) => {

  City.find().then((cities) => {

    res.send(cities);
  }, (e) => {
    res.status(400).send(e);
  });
}

};
