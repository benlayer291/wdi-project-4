var Game  = require('../models/game');
var User  = require('../models/user');
var Score = require('../models/score');

function gamesIndex(req,res) {
  Game.find({}).populate('players').exec(function(err, games){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(200).json({ games: games });
  });
}

function gamesShow(req,res) {
  var id = req.params.id;
  Game.findOne({_id: id}).populate('players').exec(function(err, game){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!game) return res.status(404).json({ message: 'Game could not be found'});
    return res.status(200).json({ game: game });
  });
}

function gamesCreateAndJoin(req,res) {
  var user_id   = req.body.user_id;
  var socket_id = req.body.socket_id;
  var game_id   = req.body.game_id;
  var newGame   = new Game(req.body);

  if (game_id) {
    Game.findOne({_id: game_id}, function(err, game){
      if (err) return res.status(500).json({ message: 'Something went wrong.' });

      User.findOne({_id: user_id}, function(err, user){
        if (err) return res.status(500).json({ message: 'Something went wrong.' });
        if (!user) return res.status(404).json({ message: 'User could not be found'});

        game.players.push(user);

        game.save(function(err, game){
          if (err) return res.status(500).json({ message: 'Something went wrong.' });
          return res.status(201).json({ message: 'Game succesfully joined and user added', game: game });  
        });
      });
    });
  } else {
    newGame.save(function(err, game){
      if (err) return res.status(500).json({ message: 'Something went wrong.' });

      User.findOne({_id: user_id}, function(err, user){
        if (err) return res.status(500).json({ message: 'Something went wrong.' });
        if (!user) return res.status(404).json({ message: 'User could not be found'});

        game.players.push(user);

        game.save(function(err){
          if (err) return res.status(500).json({ message: 'Something went wrong.' });
          return res.status(201).json({ message: 'Game succesfully created and user added', game: game });  
        });
      });
    });
  }
}

function gamesUpdate(req,res) {
  var id = req.params.id;
  Game.findOneAndUpdate({_id: id}, req.body, function(err, game){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!game) return res.status(404).json({ message: 'Game could not be found'});

    if (req.body.socket_id) game.socket_id = req.body.socket_id;

    game.save(function(err){
      if (err) return res.status(500).json({ message: 'Something went wrong.' });
      return res.status(201).json({ message: 'game succesfully updated'});
    });
  });
}

function gamesDelete(req,res) {
  var id     = req.params.id;

  Game.findOneAndRemove({_id: id}, function(err){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    return res.status(201).json({ message: 'Game succesfully deleted'});
  });
}

module.exports = {
  gamesIndex:         gamesIndex,
  gamesShow:          gamesShow,
  gamesCreateAndJoin: gamesCreateAndJoin,
  gamesUpdate:        gamesUpdate,
  gamesDelete:        gamesDelete,
}