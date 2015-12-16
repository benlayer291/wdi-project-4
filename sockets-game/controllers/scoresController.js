var User = require('../models/user');
var Score = require('../models/score');

function scoresIndex(req, res) {
  Score.find({}, function(err, scores){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(200).json({ scores: scores });
  });
}

function scoresShow(req, res) {
  var id = req.params.id;
  Score.findOne({_id: id}, function(err, score){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!score) return res.status(404).json({ message: 'Score could not be found'});
    return res.status(200).json({ score: score });
  });
}

function scoresCreate(req, res) {
  var userId = req.body.user_id;

  User.findOne({_id: userId}, function(err, user){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });

    var newScore = new Score(req.body);

    newScore.save(function(err, score){
      if (err) return res.status(500).json({ message: 'Something went wrong.' });

      user.scores.push(score);

      user.save(function(err, user){
        if (err) return res.status(500).json({ message: 'Something went wrong.' });
        return res.status(201).json({ message: 'Score succesfully created and added to user', score: score });  
      });
    });
  });
  
}

function scoresUpdate(req, res) {
  
}

function scoresDelete(req, res) {
  
}

module.exports = {
  scoresIndex:  scoresIndex,
  scoresShow:   scoresShow,
  scoresCreate: scoresCreate,
  scoresUpdate: scoresUpdate,
  scoresDelete: scoresDelete
}