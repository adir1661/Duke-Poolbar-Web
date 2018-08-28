var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose")
mongoose.connect("mongodb://localhost/poolbar");

var userSchema = new mongoose.Schema({
   name: String,
   username:String,
   password: String
});
userSchema.plugin(passportLocalMongoose);

var User =mongoose.model("User",userSchema);
module.exports =  User;