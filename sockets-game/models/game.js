var mongoose = require('mongoose');

var gameSchema = new mongoose.Schema({
  socket_id: {type: String, required: true},
  grid: [],
  players: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], 
            validate: [arrayLimit, '{PATH} exceeds the limit of 2']},
  scores: [{type: mongoose.Schema.Types.ObjectId, ref: 'Score'}]
});

function arrayLimit(val) {
  return val.length <= 2;
}

module.exports = mongoose.model('Game', gameSchema);