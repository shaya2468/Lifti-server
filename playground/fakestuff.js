require('../server/config/config');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('../server/db/mongoose');
// var {Todo} = require('./models/todo');
var {Group} = require('../server/models/group');
var {User} = require('../server/models/user');



  var body = {name: "shaya", email:"shaya@gmail.com", password:"123456"}
  var user = new User(body);
  console.log('im starting');



var saveUserPromise = function (name, email, password){

  var user = new User({name, email, password});

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
const { users, groups } = mongoose.connection.collections;
users.drop(() => {
  groups.drop(() => {
    return Promise.all
    ([
      saveUserPromise("shaya", "shaya@gmail.com", "123456"),
      saveUserPromise("simcha", "simcha@gmail.com", "123456"),
      saveUserPromise("imm", "immanuel@gmail.com", "123456"),
      saveUserPromise("bina", "bina@gmail.com", "123456"),
      saveUserPromise("shula maabula", "shula@gmail.com", "123456"),
      saveUserPromise("shmulkiz", "shmulkiz@gmail.com", "123456")
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


      let group = new Group({
        name: "zehavi",
        _manager: shaya._id
      });
      return group.save();
    }).then((group) => {

      return Group.findOneAndUpdate({_id: group._id, 'members': {$ne: simcha.id}}, {$push: {members: simcha.id}})

    }).then((group) => {
      if (!group) {
        console.log('error');
      }
      return onDoneFillingDb(simcha);
    }).then((user) => {
      console.log('done!');
    }).catch((e) => {
      console.log(e);
    })
  })

});



//http://stackoverflow.com/questions/25101386/many-to-many-relationship-with-nosql-mongodb-and-mongoose
var onDoneFillingDb = function(simcha){
  console.log('done filling db');
  console.log(simcha.id);
  return Group.find({members: simcha.id}).then((res) => {
    console.log(res);
  });
}














//
