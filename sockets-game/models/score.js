var mongoose = require('mongoose');

var scoreSchema = new mongoose.Schema({
  value: Number
})

module.exports = mongoose.model('Score', scoreSchema);