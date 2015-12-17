var mongoose = require('mongoose');

var scoreSchema = new mongoose.Schema({
  value: {type: Number, default: 0},
  player: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Score', scoreSchema);