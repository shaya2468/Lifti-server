const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const {Group} = require('./../../models/group');
const {Lift} = require('./../../models/lift');
const {City} = require('./../../models/city');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const dateLift1 = moment("2017-06-29 14:00", "YYYY/MM/DD HH:mm").unix();
const users = [{
  _id: userOneId,
  name:'john',
  email: 'john@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  name:'paul',
  email: 'paul@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const groups = [{
  _id: new ObjectID(),
  name: 'group 1',
  description: 'description 1',
  _manager: userOneId
}, {
  _id: new ObjectID(),
  name: 'group 2',
  description: 'description 2',
  _manager: userOneId
}, {
  _id: new ObjectID(),
  name: 'group 3',
  description: 'description 3',
  _manager: userTwoId
}];

const cities = [{_id: new ObjectID(),name:"city1" }, {_id: new ObjectID(),name:"city2" }, {_id: new ObjectID(),name:"city3" }];

const lift1 = {
  _id: new ObjectID(),
  origin_city: cities[0]._id,
  origin_street: 'origin street 1',
  destination_city: cities[1]._id,
  destination_street: 'destination street 1',
  _owner : users[0]._id,
  description: 'description 1',
  leave_at:dateLift1,
  capacity: 3,
  groups: [groups[0]._id]
}

const lifts = [lift1]

const populateGroups = (done) => {
  Group.remove({}).then(() => {
    return Group.insertMany(groups);
  }).then(() => done());
};

const populateLifts = (done) => {
  Lift.remove({}).then(() => {
    done();
  })
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

const populateCities = (done) => {
  var citiesObjects = cities.map((city) => {
     return newCity = new City(city);
  })

  City.remove({}).then(() => {
    return City.insertMany(citiesObjects);
  }).then(() => done());
}

module.exports = {populateGroups, populateUsers, populateLifts, populateCities,  users, groups, lifts, cities, dateLift1};
