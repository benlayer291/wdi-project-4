var express  = require('express');
var passport = require('passport'); 
var router   = express.Router();

var authenticationsController = require('../controllers/authenticationsController');

router.post('/register', authenticationsController.register);
router.post('/login', authenticationsController.login);

module.exports = router;