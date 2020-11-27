const mongoose = require('mongoose');

/* crypto func */
const {encrypt, decrypt} = require('./crypto.js');

const userSchema = new mongoose.Schema({
  id: String,
  pw: String
});

userSchema.methods.comparePassword = function(inputPassword, cb) {
	console.log('authentication...');
  if (inputPassword === decrypt(this.pw)) {
    cb(null, true);
  } else {
    cb('error');
  }
};

module.exports = mongoose.model('portfolio_users', userSchema)
