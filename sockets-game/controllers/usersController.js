var User = require('../models/user');

function usersIndex(req, res) {
  User.find({}, function(err, users){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(200).json({ users: users });
  });
}

function usersShow(req, res) {
  var id = req.params.id;
  User.findOne({_id: id}).populate('scores').exec(function(err, user){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user) return res.status(404).json({ message: 'User could not be found'});
    return res.status(200).json({ user: user });
  });
}

function usersUpdate(req, res) {
  var id = req.params.id;
  User.findOneAndUpdate({_id: id}, req.body, function(err, user){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user) return res.status(404).json({ message: 'User could not be found'});

    if (req.body.firstname) user.local.firstname = req.body.firstname;
    if (req.body.lastname) user.local.lastname = req.body.lastname;
    if (req.body.email) user.local.email = req.body.email;
    if (req.body.password) user.local.password = req.body.password;

    user.save(function(err){
      if (err) return res.status(500).json({ message: 'Something went wrong.' });
      return res.status(201).json({ message: 'User succesfully updated'});
    });
  });
}

function usersDelete(req, res) {
  var id = req.params.id;
  User.findOneAndRemove({_id: id}, function(err){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(200).json({ message: 'User succesfully deleted' });
  });
}

module.exports = {
  usersIndex:  usersIndex,
  usersShow:   usersShow,
  usersUpdate: usersUpdate,
  usersDelete: usersDelete
}