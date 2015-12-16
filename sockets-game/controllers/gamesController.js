var User = require('../models/user');
var Game = require('../models/game');

function gamesIndex(req,res) {
  Game.find({}, function(err, games){
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
  var user_id = req.body.user_id;
  var game_id = req.body.game_id;
  var newGame = new Game(req.body);

  if (game_id) {
    Game.findOne({_id: game_id}, function(err, game){
      if (err) return res.status(500).json({ message: 'Something went wrong.', err });
      if (!game) return res.status(404).json({ message: 'Game could not be found'});

      game.players.push(user_id);

      game.save(function(err, game){
        if (err) return res.status(500).json({ message: 'Something went wrong.' });
        return res.status(201).json({ message: 'Game found', game: game });  
      });
    })
  } else {

    newGame.save(function(err, newGame){
      if (err) return res.status(500).json({ message: 'Something went wrong.', err });

      Game.findOne({_id: newGame.id}, function(err, game){
        if (err) return res.status(500).json({ message: 'Something went wrong.', err });
        if (!game) return res.status(404).json({ message: 'Game could not be found'});

        game.players.push(user_id);

        game.save(function(err, game){
          if (err) return res.status(500).json({ message: 'Something went wrong.' });
          return res.status(201).json({ message: 'Game succesfully created by user', game: game });  
        });
      })
    });
  }
}

function gamesJoin(req, res) {
  var game_id = req.body.game_id;
  var user_id = req.body.user_id

  Game.findOne({_id: game_id}, function(err, game){
    if (err) return res.status(500).json({ message: 'Something went wrong.', err });
    if (!game) return res.status(404).json({ message: 'Game could not be found'});

    // game.players.push(user_id);

    // game.save(function(err, game){
    //   if (err) return res.status(500).json({ message: 'Something went wrong.' });
      return res.status(201).json({ message: 'Game found', game: game });  
    });
  // })
}

function gamesUpdate(req,res) {
  var id = req.params.id;
  Game.findOneAndUpdate({_id: id}, req.body, function(err, game){
    if (err) return res.status(500).json({ message: 'Something went wrong.' });
    if (!game) return res.status(404).json({ message: 'Game could not be found'});

    if (req.body.game_id) game.game_id = req.body.game_id;

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