// User.js
var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name: String,
  home: String,
  trashed: Boolean
});
mongoose.model('nodeapi-test-User', UserSchema); // This defines collection name in MongoDB
module.exports = mongoose.model('nodeapi-test-User');