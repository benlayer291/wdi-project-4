var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  game_id: {type: String, required: true},
  players: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Game', gameSchema);