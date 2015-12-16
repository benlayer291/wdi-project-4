var passport = require("passport");
var User     = require('../models/user');
var secret   = require('../config/config').secret; 
var jwt      = require('jsonwebtoken');

function register(req, res, next) {
  var localStrategy = passport.authenticate('local-signup', function(err, user, info){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user) return res.status(401).json({ message: 'This user already exists' });

    var token =jwt.sign(user, secret, { expiresIn: 60*60*24*7 });

    return res.status(201).json({
      success: true,
      message: 'You have succesfully registered.',
      token: token,
      user: user
      });
  });
  return localStrategy(req, res, next);
};

function login(req, res, next) {
  User.findOne({ 'local.email': req.body.email }, function(err, user){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if(!user) return res.status(404).json({ message: 'User not found.'});
    if(!user.validPassword(req.body.password)) return res.stats(403).json({ message: 'Incorrect password.'})

    var token =jwt.sign(user, secret, { expiresIn: 60*60*24*7 });

    return res.status(200).json({
      success: true,
      message: 'You have succesfully logged in.',
      token: token,
      user: user
    });
  });
};

module.exports = {
    register: register,
    login: login
}