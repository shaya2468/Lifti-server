require('../server/config/config');
var moment = require('moment');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('../server/db/mongoose');
// var {Todo} = require('./models/todo');
var {Group} = require('../server/models/group');
var {User} = require('../server/models/user');
var {Lift} = require('../server/models/lift');
var {City} = require('../server/models/city');



  var body = {name: "shaya", email:"shaya@gmail.com", password:"123456"}
  var user = new User(body);
  console.log('im starting');



var saveUserPromise = function (name, email, password, pic){

  var user = new User({name, email, password, pic});

  return user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    return {id: user._id, name: user.name};

  }).catch((e) => {
    console.log(name, 'error');
    return e;
  })
}
let shaya;
let simcha;
let imm;
let bina;
let shmulkiz;
let thisGroup;
const { users, groups,lifts, cities } = mongoose.connection.collections;
users.drop(() => {
  groups.drop(() => {
    lifts.drop(() => {


      return Promise.all
      ([
        saveUserPromise("shaya", "shaya@gmail.com", "123456", "https://vignette4.wikia.nocookie.net/villains/images/2/2f/Elmer_fudd.jpg/revision/latest?cb=20140525133914"),
        saveUserPromise("simcha", "simcha@gmail.com", "123456", "https://vignette3.wikia.nocookie.net/looneytunes/images/8/88/Daffy-1-.jpg/revision/latest?cb=20130825180446"),
        saveUserPromise("imm", "immanuel@gmail.com", "123456", "http://content.internetvideoarchive.com/content/photos/11026/903101_012.jpg"),
        saveUserPromise("bina", "bina@gmail.com", "123456", "http://www.noslang.com/smurf/smurf.jpg"),
        saveUserPromise("shula maabula", "shula@gmail.com", "123456", "https://media.yayomg.com/wp-content/uploads/2016/09/yayomg-smurfs-lost-village-teaser-4.png"),
        saveUserPromise("shmulkiz", "shmulkiz@gmail.com", "123456", "https://upload.wikimedia.org/wikipedia/en/2/26/Papasmurf1.jpg")
      ])
      .then((result) => {
         shaya = result.filter((u) => {
          return (u.name === 'shaya')
        })[0];

         simcha = result.filter((u) => {
          return (u.name === 'simcha')
        })[0];

         imm = result.filter((u) => {
          return (u.name === 'imm')
        })[0];

        bina = result.filter((u) => {
         return (u.name === 'bina')
       })[0];

       shmulkiz = result.filter((u) => {
         return (u.name === 'shmulkiz')
       })[0];

        let group = new Group({
          name: "zehavi",
          description: "ajzner dudes",
          _manager: shaya.id
        });

        let group2 = new Group({
          name: "beatles",
          description: "love da beatles ",
          _manager: shaya.id
        });

        let group3 = new Group({
          name: "beer sheva studs",
          description: "uni of b7",
          _manager: shaya.id
        });

        let group4 = new Group({
          name: "lod",
          description: "garin people",
          _manager: shaya.id
        });

        let group5 = new Group({
          name: "mars",
          description: "group for martians",
          _manager: shaya.id
        });
        return Promise.all([group.save(), group2.save(), group3.save(), group4.save(), group5.save()]);
        // return group.save();
      }).then((groups) => {
        var group = groups[0];
        var group2 = groups[1];
        return Promise.all([
          Group.findOneAndUpdate({_id: group._id, 'members': {$nin: [simcha.id, imm.id, bina.id]}}, {$push: {members: {$each: [simcha.id, imm.id, bina.id]}}}),
          Group.findOneAndUpdate({_id: group2._id, 'members': {$nin: [simcha.id]}}, {$push: {members: {$each: [simcha.id]}}})
        ]);

      }).then((groups) => {
        if (!groups) {
          console.log('error');
        }
        thisGroup = groups[0];
        return onDoneFillingDb(thisGroup, simcha, imm, bina, shmulkiz);
      }).then((user) => {
        console.log('done!');
      }).catch((e) => {
        console.log(e);
      })
    })
  })

});



//http://stackoverflow.com/questions/25101386/many-to-many-relationship-with-nosql-mongodb-and-mongoose
var onDoneFillingDb = function(group, simcha, imm, bina, shmulkiz){
  // console.log(group);
  // console.log(simcha);


  City.find()
  .then((cities) => {
    // console.log(cities);
    var timestamp = moment("2017-07-02 14:30", "YYYY/MM/DD HH:mm").unix();
    var body = {
        destination_street: 'rachel alter',
        destination_city: cities[0]._id,
        origin_street: 'alentbi 34',
        origin_city: cities[1]._id,
       _owner : simcha.id,
       description: 'need to love heavy metal',
       capacity: 5,
       groups: [group._id],
       leave_at: timestamp
    }



    var lift = new Lift(body);

    return lift.save()
    .then((lift) => {
      // return Lift.findOneAndUpdate({_id: lift._id, 'riders': {$ne: imm.id}}, {$push: {riders: imm.id}}, {runValidators: true})

      // return Lift.findOneAndUpdate({_id: lift._id, 'riders': {$nin: [imm.id, bina.id]}}, { $push: {riders: {$each: [imm.id, bina.id]}}}, {runValidators: true});
    })
    .then((lift) => {
      console.log('DONE!!!@@@###');
    }).catch((e) => {
      console.log(e);
    });
  }, (e) => {
    console.log(e);
  });





  // console.log(body);
}















//
