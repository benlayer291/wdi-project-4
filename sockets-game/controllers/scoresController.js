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