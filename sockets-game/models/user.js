var mongoose = require('mongoose');
var Score    = require('./score');
var bcrypt   = require('bcrypt');

var userSchema = new mongoose.Schema({
  local: {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  },
  scores: [Score.schema]
})

userSchema.statics.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);