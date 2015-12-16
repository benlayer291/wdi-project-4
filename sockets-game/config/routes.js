var express  = require('express');
var passport = require('passport'); 
var router   = express.Router();

var authenticationsController = require('../controllers/authenticationsController');
var usersController           = require('../controllers/usersController');

router.post('/register', authenticationsController.register);
router.post('/login', authenticationsController.login);

router.route('/users')
  .get(usersController.usersIndex)

router.route('/users/:id')
  .get(usersController.usersShow)
  .put(usersController.usersUpdate)
  .delete(usersController.usersDelete)

module.exports = router;