const GroupController = require('../controllers/group_controller');
var {authenticate} = require('../middleware/authenticate');
module.exports = (app) => {
  app.post('/groups', authenticate, GroupController.create);
};
