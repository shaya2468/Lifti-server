const GroupController = require('../controllers/group_controller');
const UserController = require('../controllers/user_controller');
const LiftController = require('../controllers/lift_controller');
var {authenticate} = require('../middleware/authenticate');
module.exports = (app) => {

  // groups
  app.post('/groups', authenticate, GroupController.create),
  app.get('/groups', authenticate, GroupController.getAll),
  app.get('/groups/:id', authenticate, GroupController.getById)
  app.get('/groups/search/:query', authenticate, GroupController.search),
  app.delete('/groups/:id', authenticate, GroupController.delete),
  app.patch('/groups/:id', authenticate, GroupController.patch),

  // users
  app.post('/users', UserController.create),
  app.post('/users/login', UserController.login),
  app.delete('/users/me/token', authenticate, UserController.deleteToken),
  app.get('/users/me', authenticate, UserController.getMe),

  // lifts
  app.post('/lifts', authenticate, LiftController.create),
  app.post('/lifts/join/:id', authenticate, LiftController.join),
  app.get('/lifts/:id', authenticate, LiftController.getLiftById)
};
