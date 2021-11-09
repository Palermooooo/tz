var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = new mongoose.Schema({
  userID: String,
 id:String,
 username:String,
});

module.exports = mongoose.model("users", user);
