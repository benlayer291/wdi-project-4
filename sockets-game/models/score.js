var mongoose = require('mongoose');

var scoreSchema = new mongoose.Schema({
  value: {type: Number, default: 0}
})

module.exports = mongoose.model('Score', scoreSchema);