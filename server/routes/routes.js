const GroupController = require('../controllers/group_controller');
const UserController = require('../controllers/user_controller');
const LiftController = require('../controllers/lift_controller');
const UploadController = require('../controllers/upload_controller');
const PermController = require('../controllers/perm_controller');
const CitiesController = require('../controllers/cities_controller');
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
  // app.get('/lifts/:id', authenticate, LiftController.getLiftById), this is disabled for now, because i don't use it and it prevents me from using the bottom one, the bott
  app.get('/lifts', authenticate, LiftController.getLiftsByQuery),

  // upload
  app.post('/upload', authenticate, UploadController.upload),

  //perms
  app.post('/perms', authenticate, PermController.create),
  app.get('/perms', authenticate, PermController.getForUser),
  app.post('/perms/accept', authenticate, PermController.accept),
  app.post('/perms/reject', authenticate, PermController.reject),

  //cities
  app.post('/cities', authenticate, CitiesController.add),
  app.get('/cities', authenticate, CitiesController.getAll)

};
