const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: String,
  pw: String
});

userSchema.methods.comparePassword = function(inputPassword, cb) {
	console.log('authentication...');
  if (inputPassword === this.pw) {
    cb(null, true);
  } else {
    cb('error');
  }
};

module.exports = mongoose.model('users', userSchema);