require('../server/config/config');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('../server/db/mongoose');
// var {Todo} = require('./models/todo');

var {City} = require('../server/models/city');
// console.log(Citi);

const {cities} = mongoose.connection.collections;
// console.log(cities);
// cities.drop(() => {

  var city1 = new City({name: "aaa"});
  var city11 = new City({name: "bbb"});
  // var city2 = new Citi({city: beer7});

 City.collection.insert([city1, city11], (res) => {
   console.log('i got here ', res);
 })

 // .then((result) => {
 //    // console.log('first insert successfull');
 //    var city2 = new City({name: "ccc"});
 //    var city3 = new City({name: "ddd"});
 //    var city4 = new City({name: "eee"});
 //    var city5 = new City({name: "fff"});
 //    return City.collection.insert([city2, city3, city4, city5]);
 //
 //  }).then((result) =>{
 //    console.log('success');
 //  }).catch((e) => {
 //    console.log(e.code);
 //    console.log(e.message);
 //  })
// })
