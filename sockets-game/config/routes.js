var express  = require('express');
var passport = require('passport'); 
var router   = express.Router();

var authenticationsController = require('../controllers/authenticationsController');
var usersController           = require('../controllers/usersController');
var scoresController          = require('../controllers/scoresController');

//Authentication routes
router.post('/register', authenticationsController.register);
router.post('/login', authenticationsController.login);

//User routes
router.route('/users')
  .get(usersController.usersIndex)

router.route('/users/:id')
  .get(usersController.usersShow)
  .put(usersController.usersUpdate)
  .delete(usersController.usersDelete)

// Score routes
router.route('/scores')
  .get(scoresController.scoresIndex)
  .post(scoresController.scoresCreate)

router.route('/scores/:id')
  .get(scoresController.scoresShow)
  .put(scoresController.scoresUpdate)
  .delete(scoresController.scoresDelete)

module.exports = router;