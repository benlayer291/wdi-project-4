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
        return res.status(201).json({ message: 'Score succesfully created and added to user', user: user });  
      });
    });
  });
  
}

function scoresUpdate(req, res) {
  var id = req.params.id;
  Score.findOneAndUpdate({_id: id}, req.body, function(err, score){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!score) return res.status(404).json({ message: 'Score could not be found'});

    if (req.body.value) score.value = parseInt(score.value) + parseInt(req.body.value);

    score.save(function(err){
      if (err) return res.status(500).json({ message: 'Something went wrong.' });
      return res.status(201).json({ message: 'Score succesfully updated'});
    });
  });
}

function scoresDelete(req, res) {
  var userId = req.body.user_id;
  var id     = req.params.id;

  User.findOne({_id: userId}, function(err, user){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });

    var scoreId = user.scores.indexOf(id);
    user.scores.splice(scoreId, 1);

    Score.findOneAndRemove({_id: id}, function(err){
      if (err) return res.status(500).json({ message: 'Something went wrong.' });

      user.save(function(err, user){
        if (err) return res.status(500).json({ message: 'Something went wrong.' });
        return res.status(201).json({ message: 'Score succesfully deleted'});  
      });
    });
  });
}

module.exports = {
  scoresIndex:  scoresIndex,
  scoresShow:   scoresShow,
  scoresCreate: scoresCreate,
  scoresUpdate: scoresUpdate,
  scoresDelete: scoresDelete
}