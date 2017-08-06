const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Group} = require('./../../models/group');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
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

const populateGroups = (done) => {
  Group.remove({}).then(() => {
    return Group.insertMany(groups);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {populateGroups, populateUsers, users, groups};
