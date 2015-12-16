var User = require('../models/user');

function usersIndex(req, res) {
  User.find({}, function(err, users){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(200).json({ users: users });
  });
}

function usersShow(req, res) {
  var id = req.params.id;
  User.findOne({_id: id}, function(err, user){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!user) return res.status(404).json({ message: 'User could not be found'});
    return res.status(200).json({ user: user });
  });
}

function usersUpdate(req, res) {

}

function usersDelete(req, res) {

}

module.exports = {
  usersIndex:  usersIndex,
  usersShow:   usersShow,
  usersUpdate: usersUpdate,
  usersDelete: usersDelete
}