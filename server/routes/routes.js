const GroupController = require('../controllers/group_controller');
var {authenticate} = require('../middleware/authenticate');
module.exports = (app) => {
  app.post('/groups', authenticate, GroupController.create),
  app.get('/groups', authenticate, GroupController.getAll),
  app.get('/groups/:id', authenticate, GroupController.getById)
  app.get('/groups/search/:query', authenticate, GroupController.search),
  app.delete('/groups/:id', authenticate, GroupController.delete),
  app.patch('/groups/:id', authenticate, GroupController.patch)

};
