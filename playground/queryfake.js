require('../server/config/config');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('../server/db/mongoose');
// var {Todo} = require('./models/todo');
var {Group} = require('../server/models/group');
var {User} = require('../server/models/user');
var {Lift} = require('../server/models/lift');

const { users, groups,lifts } = mongoose.connection.collections;

// Group.findOne({
//   name: "zehavi"
// }).populate( 'members')
// .then((group) => {
//   if (!group) {
//     console.log('error ');
//   }
//   var membersFilteredInfo = group.members.map((element) => {
//     return {
//       name:element.name,
//       email:element.email
//     };
//   });
//
//   var returnGroup = {name: group.name, description: group.description, members: membersFilteredInfo}
//   console.log(returnGroup);
//
// }).catch((e) => {
//   console.log(e);
//
// });

Group.find({
  // name: "zehavi"
  name: new RegExp("havi", 'i')
}).populate( 'members')
.then((groups) => {

  var group = groups[0];
  if (!group) {
    console.log('error ');
  }
  var membersFilteredInfo = group.members.map((element) => {
    return {
      name:element.name,
      email:element.email
    };
  });

  var returnGroup = {name: group.name, description: group.description, members: membersFilteredInfo}
  console.log(returnGroup);

}).catch((e) => {
  console.log(e);

});
