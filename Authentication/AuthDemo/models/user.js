var mongoose = require("mongoose");
var passPortLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username : String,
  password : String
});

userSchema.plugin(passPortLocalMongoose);

module.exports = mongoose.model("User", userSchema);
